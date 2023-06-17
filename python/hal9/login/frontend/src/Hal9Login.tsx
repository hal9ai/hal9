import { useRenderData } from "streamlit-component-lib-react-hooks";
import React, { useCallback } from "react";

function Hal9Login() {
  const handleLoginRequest = useCallback(async () => {
    console.log("Login requested");
  }, []);

  const renderData = useRenderData();
  return <button onClick={handleLoginRequest}>Login</button>;
}

export default Hal9Login;
