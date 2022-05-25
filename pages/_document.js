import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300;400;500;600;700&family=Gothic+A1:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://embed.prod.simpletix.com/assets/widget/widget.min.css"
          rel="stylesheet"
        />
        <script src="https://embed.prod.simpletix.com/assets/widget/widget.min.js" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
