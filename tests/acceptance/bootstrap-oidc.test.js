// Acceptance tests for task 2.1 of change solar-system-background-preview-pipeline:
// the one-time GitHub OIDC bootstrap CloudFormation template at infra/bootstrap-oidc.yaml.
//
// Run with:  node --test tests/acceptance/
//
// Sources:
//  - openspec/changes/solar-system-background-preview-pipeline/specs/ci-aws-access/spec.md,
//    Requirement "OIDC bootstrap template", Scenario "Bootstrap deployed".
//  - openspec/changes/solar-system-background-preview-pipeline/specs/preview-deployment/spec.md,
//    Requirement "Prod isolation" (bucket `ethantrevizo.com`, distribution `E130ND0ZBIO9C6`).
//  - tasks.md 2.1 text and its verification commands (grep checks reproduced below).
//  - design.md "Least-privilege role".
// Expected values come from those documents, never from the template under test.

'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const YAML = require('yaml');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const TEMPLATE_PATH = path.join(REPO_ROOT, 'infra', 'bootstrap-oidc.yaml');
const REPO_SLUG = 'EthanIsaac/ethan-portfolio'; // origin: github.com/EthanIsaac/ethan-portfolio
const FAKE_ACCOUNT = '123456789012';
const PROD_BUCKET_ARN = 'arn:aws:s3:::ethantrevizo.com';
const PROD_OBJECT_ARN = 'arn:aws:s3:::ethantrevizo.com/index.html';
const PROD_DISTRIBUTION_ARN = `arn:aws:cloudfront::${FAKE_ACCOUNT}:distribution/E130ND0ZBIO9C6`;

// ---------------------------------------------------------------------------------------------
// Template loading: YAML with CloudFormation short-form tags -> long-form JSON-like objects.
// ---------------------------------------------------------------------------------------------

function nodeToJs(node) {
  if (node === null || node === undefined) return null;
  let value;
  const type = node.type || '';
  if (/MAP/.test(type)) {
    value = {};
    for (const pair of node.items) {
      const key = pair.key && typeof pair.key === 'object' ? pair.key.value : pair.key;
      value[String(key)] = nodeToJs(pair.value);
    }
  } else if (/SEQ/.test(type)) {
    value = node.items.map(nodeToJs);
  } else if (node.items) {
    value = node.items.map(nodeToJs);
  } else {
    value = node.value;
  }
  const tag = node.tag;
  if (tag && tag.startsWith('!')) {
    const name = tag.slice(1);
    if (name === 'Ref') return { Ref: value };
    if (name === 'Condition') return { Condition: value };
    if (name === 'GetAtt' && typeof value === 'string') {
      const i = value.indexOf('.');
      return { 'Fn::GetAtt': [value.slice(0, i), value.slice(i + 1)] };
    }
    return { [`Fn::${name}`]: value };
  }
  return value;
}

let cached;
function loadTemplate() {
  if (cached) return cached;
  assert.ok(fs.existsSync(TEMPLATE_PATH), `bootstrap template missing at ${TEMPLATE_PATH}`);
  const raw = fs.readFileSync(TEMPLATE_PATH, 'utf8');
  const doc = YAML.parseDocument(raw);
  assert.deepEqual(doc.errors.map(String), [], 'template must be valid YAML');
  const tpl = nodeToJs(doc.contents);
  assert.ok(tpl && typeof tpl === 'object', 'template must be a YAML mapping');
  cached = { raw, tpl };
  return cached;
}

function resourcesOfType(tpl, type) {
  return Object.entries(tpl.Resources || {}).filter(([, r]) => r && r.Type === type);
}

// Resolve intrinsic functions to strings where possible, using parameter defaults and
// pseudo-parameters (account replaced by a fixed fake id). Unresolvable parts become '*'
// so that glob matching stays conservative only where the template itself is dynamic.
function resolve(tpl, v, locals = {}) {
  if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (Array.isArray(v)) return v.map((x) => resolve(tpl, x, locals));
  if (!v || typeof v !== 'object') return v;
  const pseudo = {
    'AWS::AccountId': FAKE_ACCOUNT,
    'AWS::Partition': 'aws',
    'AWS::Region': 'us-east-2',
    'AWS::URLSuffix': 'amazonaws.com',
    'AWS::StackName': 'bootstrap',
  };
  const refName = (name) => {
    if (name in locals) return resolve(tpl, locals[name], locals);
    if (name in pseudo) return pseudo[name];
    const p = (tpl.Parameters || {})[name];
    if (p && p.Default !== undefined) return String(p.Default);
    if (tpl.Resources && tpl.Resources[name]) return `<ref:${name}>`;
    if (name.includes('.')) {
      const [r, a] = name.split('.');
      return `<getatt:${r}.${a}>`;
    }
    return '*';
  };
  if ('Ref' in v) return refName(v.Ref);
  if ('Fn::Sub' in v) {
    let str = v['Fn::Sub'];
    let vars = {};
    if (Array.isArray(str)) {
      vars = str[1] || {};
      str = str[0];
    }
    return String(str).replace(/\$\{([^}!]+)\}/g, (_, n) => {
      const name = n.trim();
      return name in vars ? resolve(tpl, vars[name], locals) : refName(name);
    });
  }
  if ('Fn::Join' in v) {
    const [sep, parts] = v['Fn::Join'];
    return (resolve(tpl, parts, locals) || []).join(sep);
  }
  if ('Fn::GetAtt' in v) {
    const ga = v['Fn::GetAtt'];
    return `<getatt:${Array.isArray(ga) ? ga.join('.') : ga}>`;
  }
  if ('Fn::If' in v) return resolve(tpl, v['Fn::If'][1], locals);
  // Plain mapping (e.g. a policy document): resolve recursively.
  const out = {};
  for (const [k, x] of Object.entries(v)) out[k] = resolve(tpl, x, locals);
  return out;
}

const asList = (x) => (x === undefined || x === null ? [] : Array.isArray(x) ? x : [x]);

// IAM-style glob: '*' any run of characters, '?' any single character. Case-sensitive for ARNs.
function globMatches(pattern, value, { ignoreCase = false } = {}) {
  const re = new RegExp(
    '^' + String(pattern).split('').map((c) => (c === '*' ? '.*' : c === '?' ? '.' : c.replace(/[.+^${}()|[\]\\/]/g, '\\$&'))).join('') + '$',
    ignoreCase ? 'i' : ''
  );
  return re.test(value);
}

// Every permission policy statement that applies to the bootstrap role: inline Policies on the
// role, plus AWS::IAM::Policy / AWS::IAM::ManagedPolicy resources attached to it.
function rolePermissionStatements(tpl, roleId) {
  const statements = [];
  const role = tpl.Resources[roleId];
  for (const p of asList(role.Properties && role.Properties.Policies)) {
    statements.push(...asList(resolve(tpl, p.PolicyDocument).Statement));
  }
  const refersToRole = (list) =>
    asList(list).some((x) => x && typeof x === 'object' && x.Ref === roleId);
  for (const [, r] of resourcesOfType(tpl, 'AWS::IAM::Policy')) {
    if (refersToRole(r.Properties && r.Properties.Roles)) {
      statements.push(...asList(resolve(tpl, r.Properties.PolicyDocument).Statement));
    }
  }
  const managedIds = new Set(
    asList(role.Properties && role.Properties.ManagedPolicyArns)
      .filter((x) => x && typeof x === 'object' && x.Ref)
      .map((x) => x.Ref)
  );
  for (const [id, r] of resourcesOfType(tpl, 'AWS::IAM::ManagedPolicy')) {
    if (managedIds.has(id) || refersToRole(r.Properties && r.Properties.Roles)) {
      statements.push(...asList(resolve(tpl, r.Properties.PolicyDocument).Statement));
    }
  }
  return statements;
}

function getRole(tpl) {
  const roles = resourcesOfType(tpl, 'AWS::IAM::Role');
  assert.equal(roles.length, 1, 'bootstrap template must declare exactly one IAM role');
  return roles[0];
}

// ---------------------------------------------------------------------------------------------
// ci-aws-access "OIDC bootstrap template" / Scenario "Bootstrap deployed"
// ---------------------------------------------------------------------------------------------

test('Bootstrap deployed: template is a CloudFormation template with Resources', () => {
  // Source: ci-aws-access spec, Requirement "OIDC bootstrap template".
  const { tpl } = loadTemplate();
  assert.equal(String(tpl.AWSTemplateFormatVersion), '2010-09-09');
  assert.ok(tpl.Resources && Object.keys(tpl.Resources).length > 0, 'Resources section required');
});

test('Bootstrap deployed: creates the GitHub OIDC identity provider for sts.amazonaws.com', () => {
  // Source: ci-aws-access spec, Scenario "Bootstrap deployed" (account has the GitHub OIDC
  // provider); GitHub's documented issuer https://token.actions.githubusercontent.com and
  // audience sts.amazonaws.com used by aws-actions/configure-aws-credentials.
  const { tpl } = loadTemplate();
  const providers = resourcesOfType(tpl, 'AWS::IAM::OIDCProvider');
  assert.equal(providers.length, 1, 'exactly one AWS::IAM::OIDCProvider resource');
  const props = providers[0][1].Properties || {};
  assert.equal(resolve(tpl, props.Url), 'https://token.actions.githubusercontent.com');
  assert.ok(
    asList(resolve(tpl, props.ClientIdList)).includes('sts.amazonaws.com'),
    'ClientIdList must include sts.amazonaws.com'
  );
});

test('Bootstrap deployed: role is trusted only for this repository via the OIDC provider', () => {
  // Source: task 2.1 "IAM role trusted only for this repository's workflows"; design.md
  // "Least-privilege role" (trust limited to this repository's workflow subject).
  const { tpl } = loadTemplate();
  const [providerId] = resourcesOfType(tpl, 'AWS::IAM::OIDCProvider')[0] || [];
  assert.ok(providerId, 'OIDC provider resource required');
  const [, role] = getRole(tpl);
  const trustRaw = role.Properties && role.Properties.AssumeRolePolicyDocument;
  assert.ok(trustRaw, 'role needs an AssumeRolePolicyDocument');
  const trustAllows = asList(trustRaw.Statement).filter((s) => s.Effect === 'Allow');
  assert.ok(trustAllows.length >= 1, 'at least one Allow trust statement');

  for (const s of trustAllows) {
    // Only the web-identity action, only the federated GitHub provider.
    assert.deepEqual(asList(s.Action), ['sts:AssumeRoleWithWebIdentity']);
    const principal = s.Principal || {};
    assert.deepEqual(Object.keys(principal), ['Federated'], 'principal must be Federated only');
    const fed = principal.Federated;
    const fedOk =
      (fed && fed.Ref === providerId) ||
      (fed && fed['Fn::GetAtt'] && asList(fed['Fn::GetAtt'])[0] === providerId) ||
      /oidc-provider\/token\.actions\.githubusercontent\.com$/.test(resolve(tpl, fed) || '');
    assert.ok(fedOk, 'Federated principal must be the GitHub OIDC provider');

    const cond = resolve(tpl, s.Condition || {});
    const flat = {};
    for (const [op, kv] of Object.entries(cond)) {
      for (const [k, vals] of Object.entries(kv)) flat[k] = { op, vals: asList(vals) };
    }
    const aud = flat['token.actions.githubusercontent.com:aud'];
    assert.ok(aud, 'condition on token.actions.githubusercontent.com:aud required');
    assert.equal(aud.op, 'StringEquals');
    assert.deepEqual(aud.vals, ['sts.amazonaws.com']);

    const sub = flat['token.actions.githubusercontent.com:sub'];
    assert.ok(sub, 'condition on token.actions.githubusercontent.com:sub required');
    assert.ok(['StringEquals', 'StringLike'].includes(sub.op), `sub operator ${sub.op}`);
    assert.ok(sub.vals.length >= 1);
    for (const v of sub.vals) {
      assert.ok(
        v.toLowerCase().startsWith(`repo:${REPO_SLUG}:`.toLowerCase()),
        `sub value "${v}" must be scoped to repo:${REPO_SLUG}:`
      );
      // The owner/repo part must be literal: no wildcard can widen it to other repositories.
      const repoPart = v.slice(0, `repo:${REPO_SLUG}:`.length);
      assert.ok(!/[*?]/.test(repoPart), `sub value "${v}" must not wildcard the repository`);
    }
  }
});

test('Bootstrap deployed: role ARN is a stack output via !GetAtt <Role>.Arn', () => {
  // Source: ci-aws-access spec, Scenario "Bootstrap deployed" (role ARN available as a stack
  // output); task 2.1 verification "role ARN output via !GetAtt <Role>.Arn".
  const { raw, tpl } = loadTemplate();
  assert.match(raw, /^Outputs:/m, 'top-level Outputs section required');
  const [roleId] = getRole(tpl);
  const outputs = Object.values(tpl.Outputs || {});
  const hasRoleArn = outputs.some((o) => {
    const ga = o && o.Value && o.Value['Fn::GetAtt'];
    return ga && ga[0] === roleId && ga[1] === 'Arn';
  });
  assert.ok(hasRoleArn, `an output whose Value is !GetAtt ${roleId}.Arn is required`);
});

// ---------------------------------------------------------------------------------------------
// preview-deployment "Prod isolation" (explicit deny) and least privilege
// ---------------------------------------------------------------------------------------------

function unconditionalDenies(tpl) {
  const [roleId] = getRole(tpl);
  return rolePermissionStatements(tpl, roleId).filter(
    (s) => s.Effect === 'Deny' && !s.Condition && !s.NotResource && !s.NotAction
  );
}

function denyCovers(statements, service, arn) {
  return statements.some(
    (s) =>
      asList(s.Action).some((a) => globMatches(a, `${service}:AnyAction`, { ignoreCase: true }) && globMatches(a, `${service}:GetObject`, { ignoreCase: true })) &&
      asList(s.Resource).some((r) => globMatches(r, arn))
  );
}

test('Prod isolation: explicit deny of all S3 actions on bucket ethantrevizo.com and its objects', () => {
  // Source: preview-deployment spec, Requirement "Prod isolation" (SHALL NOT read from, write
  // to or modify bucket ethantrevizo.com); task 2.1 "explicit deny on bucket ethantrevizo.com";
  // verification: Deny on arn:aws:s3:::ethantrevizo.com and arn:aws:s3:::ethantrevizo.com/*.
  const { tpl } = loadTemplate();
  const denies = unconditionalDenies(tpl);
  assert.ok(denies.length > 0, 'role must carry an unconditional Effect: Deny statement');
  assert.ok(denyCovers(denies, 's3', PROD_BUCKET_ARN), `Deny s3:* must cover ${PROD_BUCKET_ARN}`);
  assert.ok(denyCovers(denies, 's3', PROD_OBJECT_ARN), `Deny s3:* must cover ${PROD_BUCKET_ARN}/*`);
});

test('Prod isolation: explicit deny of all CloudFront actions on distribution E130ND0ZBIO9C6', () => {
  // Source: preview-deployment spec, Requirement "Prod isolation" (SHALL NOT modify
  // distribution E130ND0ZBIO9C6); task 2.1 "explicit deny on ... distribution E130ND0ZBIO9C6".
  const { tpl } = loadTemplate();
  const denies = unconditionalDenies(tpl);
  assert.ok(
    denyCovers(denies, 'cloudfront', PROD_DISTRIBUTION_ARN),
    `Deny cloudfront:* must cover ${PROD_DISTRIBUTION_ARN}`
  );
});

test('Prod isolation: no Allow statement grants S3 access on the prod bucket', () => {
  // Source: task 2.1 "permissions scoped to the dev stacks"; design.md "Least-privilege role"
  // (permissions scoped to the dev bucket ARN, not the prod bucket).
  const { tpl } = loadTemplate();
  const [roleId] = getRole(tpl);
  const allows = rolePermissionStatements(tpl, roleId).filter((s) => s.Effect === 'Allow');
  assert.ok(allows.length > 0, 'role must have Allow statements for the dev stacks');
  for (const s of allows) {
    const s3 = asList(s.Action).some((a) => globMatches(a, 's3:PutObject', { ignoreCase: true }));
    if (!s3) continue;
    for (const r of asList(s.Resource)) {
      assert.ok(!globMatches(r, PROD_BUCKET_ARN), `Allow s3 resource "${r}" covers the prod bucket`);
      assert.ok(!globMatches(r, PROD_OBJECT_ARN), `Allow s3 resource "${r}" covers prod objects`);
    }
  }
});

test('No access-key creation: no Allow grants iam:CreateAccessKey, iam:UpdateAccessKey, iam:CreateUser, iam:* or *', () => {
  // Source: task 2.1 verification "no access-key creation"; ci-aws-access "Keyless workflow
  // authentication" (no long-lived AWS access keys).
  const { tpl } = loadTemplate();
  const [roleId] = getRole(tpl);
  const allows = rolePermissionStatements(tpl, roleId).filter((s) => s.Effect === 'Allow');
  assert.ok(allows.length > 0, 'role must have Allow statements');
  const forbidden = ['iam:CreateAccessKey', 'iam:UpdateAccessKey', 'iam:CreateUser', 'iam:AttachUserPolicy'];
  for (const s of allows) {
    assert.ok(!s.NotAction, 'Allow with NotAction is too broad');
    for (const a of asList(s.Action)) {
      for (const f of forbidden) {
        assert.ok(!globMatches(a, f, { ignoreCase: true }), `Allow action "${a}" grants ${f}`);
      }
    }
  }
  const users = [...resourcesOfType(tpl, 'AWS::IAM::User'), ...resourcesOfType(tpl, 'AWS::IAM::AccessKey')];
  assert.deepEqual(users.map(([id]) => id), [], 'no IAM users or access keys may be created');
});

// ---------------------------------------------------------------------------------------------
// Task 2.1 verification commands (text-level greps), reproduced literally.
// ---------------------------------------------------------------------------------------------

test('Verification greps: Deny, prod bucket ARN and prod distribution id are present', () => {
  // Source: task 2.1 verification
  // grep 'Effect: Deny' && grep 'arn:aws:s3:::ethantrevizo.com' && grep 'E130ND0ZBIO9C6'
  const { raw } = loadTemplate();
  assert.match(raw, /Effect: Deny/);
  assert.ok(raw.includes('arn:aws:s3:::ethantrevizo.com'));
  assert.ok(raw.includes('E130ND0ZBIO9C6'));
});

test('Verification greps: no IAM key/user/wildcard actions in the template text', () => {
  // Source: task 2.1 verification
  // ! grep -nEi 'iam:(CreateAccessKey|UpdateAccessKey|CreateUser|\*)|"?iam:\*"?|Action: "?\*"?$'
  const { raw } = loadTemplate();
  const re = /iam:(CreateAccessKey|UpdateAccessKey|CreateUser|\*)|"?iam:\*"?|Action: "?\*"?$/i;
  const hits = raw.split('\n').filter((line) => re.test(line));
  assert.deepEqual(hits, []);
});

test('Verification greps: trust conditions on sub and aud with sts.amazonaws.com', () => {
  // Source: task 2.1 verification
  // grep 'token.actions.githubusercontent.com:sub' && grep '...:aud' && grep 'sts.amazonaws.com'
  const { raw } = loadTemplate();
  assert.ok(raw.includes('token.actions.githubusercontent.com:sub'));
  assert.ok(raw.includes('token.actions.githubusercontent.com:aud'));
  assert.ok(raw.includes('sts.amazonaws.com'));
});

// ---------------------------------------------------------------------------------------------
// Self-check of the test helpers against hand-written inputs (independent of the template),
// so a helper bug cannot make the behavioural tests pass vacuously.
// ---------------------------------------------------------------------------------------------

(function helperSelfCheck() {
  // Source: independent computation (IAM wildcard semantics), written here. Runs at module
  // load so that a broken helper fails the whole suite instead of passing vacuously.
  assert.ok(globMatches('arn:aws:s3:::ethantrevizo.com*', PROD_OBJECT_ARN));
  assert.ok(globMatches('arn:aws:s3:::ethantrevizo.com/*', PROD_OBJECT_ARN));
  assert.ok(!globMatches('arn:aws:s3:::ethantrevizo.com', PROD_OBJECT_ARN));
  assert.ok(!globMatches('arn:aws:s3:::dev-*', PROD_BUCKET_ARN));
  assert.ok(globMatches('*', 'iam:CreateAccessKey'));
  assert.ok(globMatches('IAM:Create*', 'iam:CreateAccessKey', { ignoreCase: true }));
  const tpl = { Parameters: { R: { Default: 'EthanIsaac/ethan-portfolio' } }, Resources: {} };
  assert.equal(resolve(tpl, { 'Fn::Sub': 'repo:${R}:pull_request' }), 'repo:EthanIsaac/ethan-portfolio:pull_request');
  assert.equal(
    resolve(tpl, { 'Fn::Sub': 'arn:${AWS::Partition}:cloudfront::${AWS::AccountId}:distribution/E130ND0ZBIO9C6' }),
    PROD_DISTRIBUTION_ARN
  );
  assert.equal(resolve(tpl, { 'Fn::Join': ['', ['a', { Ref: 'R' }]] }), 'aEthanIsaac/ethan-portfolio');
  const doc = YAML.parseDocument('a: !GetAtt Role.Arn\nb: !Ref X\nc: !Sub "x"\n');
  assert.deepEqual(nodeToJs(doc.contents), {
    a: { 'Fn::GetAtt': ['Role', 'Arn'] },
    b: { Ref: 'X' },
    c: { 'Fn::Sub': 'x' },
  });
})();
