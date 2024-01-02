import { Avatar, Box, Link, Stack } from "@mui/material";
import { Logo } from "../icons/logo";

const TOP_NAV_HEIGHT = 64;

export const TopNav = () => (
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
        </Box>
      </Stack>
      <Stack alignItems="center" direction="row" spacing={2}>
        <Avatar
          src="/assets/avatars/avatar-chen-simmons.jpg"
          variant="rounded"
        />
      </Stack>
    </Stack>
  </Box>
);
