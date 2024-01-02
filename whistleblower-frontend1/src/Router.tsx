import { Outlet } from "react-router-dom";
import NotFoundPage from "./pages/404";
import DashBoard from "./pages/Dashboard";
import { TopNav } from "./components/TopNav";
import WalletConnect from "./components/WalletConnect";
import { useContext } from "react";
import { Context } from "./context";
import { Button } from "@mui/material";

export default function Router() {
  const { whistleblowerApi } = useContext(Context);

  const demo = async () => {
    await whistleblowerApi.vote(0, true);
  }

  return (
    <div>
      {/* <TopNav /> */}
      aaa
      <Button onClick={demo}>Demo</Button>
      <WalletConnect/>
    </div>
  );
}
