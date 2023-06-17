import React from "react";
import ReactDOM from "react-dom";
import { StreamlitProvider } from "streamlit-component-lib-react-hooks";
import Hal9Login from "./Hal9Login";

ReactDOM.render(
  <React.StrictMode>
    <StreamlitProvider>
      <Hal9Login />
    </StreamlitProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
