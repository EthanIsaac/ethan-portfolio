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
          <head>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
            <link rel="preconnect" href="https://fonts.googleapis.com"></link>
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"></link>
            <link
              href="https://fonts.googleapis.com/css2?family=Unna:wght@400;700&display=swap"
              rel="stylesheet"
            ></link>
          </head>
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
