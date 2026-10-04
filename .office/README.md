# .office/

This repository is worked on by an Engineering Office. `office.yaml` says who may change
what, how to set up, test and lint the project, which paths only a human merges, and the
budgets. The office reads it from the default branch only, so a pull request can't change
the rules that judge it, and any change to this directory needs a human merge.

Add project-specific roles in `agents/<role>.md` (and declare them under `roles:`), and
skills in `skills/<name>/SKILL.md`.
