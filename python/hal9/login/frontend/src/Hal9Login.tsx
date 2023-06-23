import { Streamlit } from "streamlit-component-lib";
import React, { useState, useCallback, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { fetchLoginToken, openLoginPage, subscribeLoginInfo } from "./api";
import { LoginInfo } from "./types";

interface StreamlitComponentValue {
  user: string | null;
}
function setStreamlitComponentValue(value: StreamlitComponentValue) {
  Streamlit.setComponentValue(value);
}

const TOKEN_LOCAL_STORAGE_KEY = "hal9_login_token";

function Hal9Login() {
  const [loginInfo, setLoginInfo] = useState<LoginInfo>();

  useEffect(() => {
    // Auto-login with a token stored in localStorage.
    const restoredToken = localStorage.getItem(TOKEN_LOCAL_STORAGE_KEY);
    if (restoredToken == null) {
      return;
    }

    subscribeLoginInfo(restoredToken).then((loginInfo) => {
      setLoginInfo(loginInfo);
      setStreamlitComponentValue({ user: loginInfo.user });
    });
  }, []);

  const handleLoginRequest = useCallback(async () => {
    setLoginInfo(undefined);
    setStreamlitComponentValue({ user: null });

    try {
      const token = await fetchLoginToken();

      localStorage.setItem(TOKEN_LOCAL_STORAGE_KEY, token);

      openLoginPage(token);

      subscribeLoginInfo(token).then((loginInfo) => {
        setLoginInfo(loginInfo);
        setStreamlitComponentValue({ user: loginInfo.user });
      });
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    Streamlit.setFrameHeight();
  });

  if (loginInfo === undefined) {
    return (
      <Button variant="contained" color="primary" onClick={handleLoginRequest}>
        Login
      </Button>
    );
  }

  return <Avatar alt={loginInfo.user} src={loginInfo.photo} />;
}

export default Hal9Login;
