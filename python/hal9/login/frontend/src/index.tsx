import React from "react";
import ReactDOM from "react-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "./ThemeProvider";
import { StreamlitProvider } from "streamlit-component-lib-react-hooks";
import Hal9Login from "./Hal9Login";

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <StreamlitProvider>
      <ThemeProvider>
        <Hal9Login />
      </ThemeProvider>
    </StreamlitProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
