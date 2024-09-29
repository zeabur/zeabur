import 'nextra-theme-docs/style.css';
import './override.css';

export default function Nextra({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
