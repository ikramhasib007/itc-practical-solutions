import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html dir="ltr" lang="en" className="h-full bg-gray-50 antialiased text-gray-900 scroll-smooth">
      <Head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </Head>
      <body className="min-h-screen h-full bg-gray-50 font-sans text-base font-normal tracking-normal">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
