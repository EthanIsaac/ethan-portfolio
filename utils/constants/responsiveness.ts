export const MOBILE_MAX_WIDTH_PX = 600;

export const mobileCss = (css: string) => {
  return `
  @media (max-width: ${MOBILE_MAX_WIDTH_PX}px) {
    ${css}
  }
  `;
};

export const desktopCss = (css: string) => {
  return `
  @media (min-width: ${MOBILE_MAX_WIDTH_PX}px) {
    ${css}
  }
  `;
};
