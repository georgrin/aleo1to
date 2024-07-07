import { useEffect, useState } from "react";
import HomePage from "./pages/Home";
import { useMemo } from "react";
import { withProfiler } from "@sentry/react";
import Modal from "react-modal";
import "react-tooltip/dist/react-tooltip.css";
import "./index.scss";
import { LeoWalletAdapter } from "@demox-labs/aleo-wallet-adapter-leo";
import { WalletProvider } from "@demox-labs/aleo-wallet-adapter-react";
import { DecryptPermission, WalletAdapterNetwork } from "@demox-labs/aleo-wallet-adapter-base";
import { WalletModalProvider } from "@demox-labs/aleo-wallet-adapter-reactui";
import { Header } from "./router/layouts/Header";
import { Footer } from "./router/layouts/Footer";
import TestnetRewards from "./pages/TestnetRewards";
import { Route } from "./model";
import { SnackbarProvider } from "./router/layouts/SnackbarProvider";

Modal.setAppElement("#modals");

function App() {
  const wallets = useMemo(
    () => [
      new LeoWalletAdapter({
        appName: "Leo Demo App",
      }),
    ],
    []
  );
  const { currentRoute } = useRouter();

  // Simple route matching
  const renderComponent = () => {
    switch (currentRoute) {
      case Route.HOME:
        return <HomePage />;
      case Route.REWARDS:
        return <TestnetRewards />;
      default:
        return <HomePage />;
    }
  };

  return (
    <>
      <Header />

      <WalletProvider
        wallets={wallets}
        decryptPermission={DecryptPermission.UponRequest}
        network={WalletAdapterNetwork.TestnetBeta}
      >
        <WalletModalProvider>
          <SnackbarProvider>{renderComponent()}</SnackbarProvider>
        </WalletModalProvider>
      </WalletProvider>
      <Footer />
    </>
  );
}

export default withProfiler(App);

function useRouter() {
  const [currentRoute, setCurrentRoute] = useState(window.location.pathname);

  //simple router
  useEffect(() => {
    const onLocationChange = () => setCurrentRoute(window.location.pathname);
    window.addEventListener("popstate", onLocationChange);

    return () => window.removeEventListener("popstate", onLocationChange);
  }, []);

  return {
    currentRoute,
  };
}
