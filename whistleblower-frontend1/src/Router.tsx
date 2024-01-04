import NotFoundPage from "./pages/404";
import DashBoard from "./pages/Dashboard";
import { TopNav } from "./components/TopNav";
import { useContext } from "react";
import { Context } from "./context";
import { Button } from "@mui/material";
import { SideNav } from "./components/SideNav";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Profile from "./pages/Profile";

export default function Router() {
  const { whistleblowerApi } = useContext(Context);

  const demo = async () => {
    await whistleblowerApi.vote(0, true);
  };

  return (
    <BrowserRouter>
      <TopNav />
      <SideNav />
      <Routes>
        <Route path="/my" Component={Profile} />
        <Route path="/" Component={DashBoard} />
        <Route Component={NotFoundPage} />
      </Routes>
    </BrowserRouter>
  );
}
