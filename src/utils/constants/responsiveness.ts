export const MOBILE_MAX_WIDTH_PX = 1200;
export const MOBILE_MAX_HEIGHT_PX = 900;

export const mobileCss = (css: string) => {
  return `
  @media (max-width: ${MOBILE_MAX_WIDTH_PX}px) or (max-height: ${MOBILE_MAX_HEIGHT_PX}px) {
    ${css}
  }
  `;
};

export const desktopCss = (css: string) => {
  return `
  @media (min-width: ${MOBILE_MAX_WIDTH_PX}px) and (min-height: ${MOBILE_MAX_HEIGHT_PX}px) {
    ${css}
  }
  `;
};

export const landscapeCss = (css: string) => {
  return `
  @media (orientation: landscape) {
    ${css}
  }
  `;
};

export const portraitCss = (css: string) => {
  return `
  @media (orientation: portrait) {
    ${css}
  }
  `;
};
