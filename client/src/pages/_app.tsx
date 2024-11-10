import 'cross-fetch/polyfill'
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from 'next/head'
import { ApolloProvider } from "@apollo/client/react";
import Router from "next/router";
import ProgressBar from "@badrap/bar-of-progress";
import getClient from 'apollo';

const progress = new ProgressBar({
  size: 2,
  color: "#EF4023",
  className: "bar-of-progress",
  delay: 100,
});

Router.events.on("routeChangeStart", progress.start);
Router.events.on("routeChangeComplete", progress.finish);
Router.events.on("routeChangeError", progress.finish);

export default function App({ Component, pageProps }: AppProps) {
  const client = getClient(pageProps.token)
  return (
    <ApolloProvider client={client}>
      <Head>
        <title>ITC practical exam solutions</title>
      </Head>
      <Component {...pageProps} />
    </ApolloProvider>
  )
}
