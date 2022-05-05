import { default as Doc, DocumentContext } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

export default class Document extends Doc {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Doc.getInitialProps(ctx);
      const styles = (
        <>
          {initialProps.styles}
          {sheet.getStyleElement()}
        </>
      ) as any; // Note: Just ignore this typescript error, it works...
      return {
        ...initialProps,
        styles,
      };
    } finally {
      sheet.seal();
    }
  }
}
