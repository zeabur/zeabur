import 'nextra-theme-docs/style.css';
import './override.css';
import type { AppProps } from 'next/app';

export default function Nextra({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
