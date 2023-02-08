import { MeshProvider } from "@meshsdk/react";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <MeshProvider>
      <Component {...pageProps} />
    </MeshProvider>
  );
}

export default MyApp;
