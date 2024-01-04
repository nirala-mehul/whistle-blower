import NotFoundPage from "./pages/404";
import DashBoard from "./pages/Dashboard";
import { TopNav } from "./components/TopNav";
import { useContext } from "react";
import { Context } from "./context";
import { Button } from "@mui/material";
import { SideNav } from "./components/SideNav";
import { BrowserRouter } from "react-router-dom";

export default function Router() {
  const { whistleblowerApi } = useContext(Context);

  const demo = async () => {
    await whistleblowerApi.vote(0, true);
  };

  return (
    <BrowserRouter>
      <TopNav />
      <SideNav />
      <DashBoard />
    </BrowserRouter>
  );
}
