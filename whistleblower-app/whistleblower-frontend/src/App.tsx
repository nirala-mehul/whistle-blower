import React from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
// import { routes } from './Router';
import { createTheme } from "./themes";
import { Suspense } from "react";
// import 'simplebar-react/dist/simplebar.min.css';
import "./App.css";
import Router from "./Router";
import { AppContextWrapper } from "./context";

function App() {
  const theme = createTheme({
    colorPreset: "green",
    contrast: "high",
  });

  return (
    <Suspense>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContextWrapper>
          <Router />
        </AppContextWrapper>
      </ThemeProvider>
    </Suspense>
  );
}

export default App;
