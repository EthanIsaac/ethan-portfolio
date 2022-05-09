import styled from 'styled-components';

export const WithFadeContainer = styled.div<{ visible: boolean }>`
  ${(props) =>
    props.visible
      ? `
animation: blurIn 1s ease 0s forwards;
-webkit-animation: blurIn 1s ease 0s  forwards;
-moz-animation: blurIn 1s ease 0s  forwards;`
      : `
animation: blurOut 1s ease 0s forwards;
-webkit-animation: blurOut 1s ease 0s forwards;
-moz-animation: blurOut 1s ease 0s forwards;`}
`;
