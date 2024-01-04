import { Avatar, Box, Link, Stack } from "@mui/material";
import { Logo } from "../icons/logo";
import WalletConnect from "./WalletConnect";
import zIndex from "@mui/material/styles/zIndex";
import { useContext } from "react";
import { Context } from "../context";
import { MPCWalletLogo } from "../icons/mpc-logo";

const TOP_NAV_HEIGHT = 64;

export const TopNav = () => {
  const { currentAccount } = useContext(Context);
  const avtarImgUrl = currentAccount
    ? "https://api.dicebear.com/7.x/pixel-art/svg?seed=" +
      currentAccount.address
    : "/assets/avatars/avatar-chen-simmons.jpg";

  return (
    <Box
      component="header"
      sx={{
        backgroundColor: "neutral.900",
        color: "common.white",
        position: "fixed",
        width: "100%",
        zIndex: (theme) => theme.zIndex.appBar,
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{
          minHeight: TOP_NAV_HEIGHT,
          px: 3,
        }}
      >
        <Stack alignItems="center" direction="row" spacing={3}>
          <Box
            sx={{
              display: "inline-flex",
              height: 24,
              width: 24,
            }}
          >
            <Logo />
            <MPCWalletLogo />
          </Box>
        </Stack>
        <Stack alignItems="center" direction="row" spacing={2}>
          <Avatar src={avtarImgUrl} variant="rounded" />
          <WalletConnect />
        </Stack>
      </Stack>
    </Box>
  );
};
