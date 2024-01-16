import { Link as RouterLink, matchPath, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ChartPieIcon from "@heroicons/react/24/solid/ChartPieIcon";
import CogIcon from "@heroicons/react/24/solid/CogIcon";
import DocumentTextIcon from "@heroicons/react/24/solid/DocumentTextIcon";
import ExclamationTriangleIcon from "@heroicons/react/24/solid/ExclamationTriangleIcon";
import ShoppingCartIcon from "@heroicons/react/24/solid/ShoppingCartIcon";
import UserCircleIcon from "@heroicons/react/24/solid/UserCircleIcon";
import StarIcon from "@heroicons/react/24/solid/StarIcon";
import { SvgIcon } from "@mui/material";

export const items = [
  {
    href: "/",
    icon: (
      <SvgIcon>
        <ChartPieIcon />
      </SvgIcon>
    ),
    label: "Home",
  },
  {
    href: "/my",
    icon: (
      <SvgIcon>
        <UserCircleIcon />
      </SvgIcon>
    ),
    label: "Profile",
  },
  {
    href: "/settings",
    icon: (
      <SvgIcon>
        <CogIcon />
      </SvgIcon>
    ),
    label: "Settings",
  },
  //   {
  //     href: '/theme',
  //     icon: (
  //       <SvgIcon>
  //         <DocumentTextIcon />
  //       </SvgIcon>
  //     ),
  //     label: 'Theme'
  //   },
  //   {
  //     href: '/icons',
  //     icon: (
  //       <SvgIcon>
  //         <StarIcon />
  //       </SvgIcon>
  //     ),
  //     label: 'Icons'
  //   },
  //   {
  //     href: '/404',
  //     icon: (
  //       <SvgIcon>
  //         <ExclamationTriangleIcon />
  //       </SvgIcon>
  //     ),
  //     label: 'Error'
  //   }
];

const SIDE_NAV_WIDTH = 73;
const TOP_NAV_HEIGHT = 64;

export const SideNav = () => {
  const location = useLocation();

  return (
    <Drawer
      open
      variant="permanent"
      PaperProps={{
        sx: {
          backgroundColor: "background.default",
          display: "flex",
          flexDirection: "column",
          height: `calc(100% - ${TOP_NAV_HEIGHT}px)`,
          p: 1,
          top: TOP_NAV_HEIGHT,
          width: SIDE_NAV_WIDTH,
          zIndex: (theme) => theme.zIndex.appBar - 100,
        },
      }}
    >
      <List sx={{ width: "100%" }}>
        {items.map((item) => {
          const active = matchPath(
            { path: item.href, end: true },
            location.pathname
          );

          return (
            <ListItem
              disablePadding
              component={RouterLink}
              key={item.href}
              to={item.href}
              sx={{
                flexDirection: "column",
                px: 2,
                py: 1.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: "auto",
                  color: active ? "primary.main" : "neutral.400",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  variant: "caption",
                  sx: {
                    color: active ? "primary.main" : "text.secondary",
                  },
                }}
              />
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};
