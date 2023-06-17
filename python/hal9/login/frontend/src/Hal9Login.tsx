import { Streamlit } from "streamlit-component-lib";
import React, { useState, useCallback } from "react";

const LOGIN_TOKEN_REQUEST_API_URL = "https://api.hal9.com/api/login";
const LOGIN_PAGE_URL = "https://api.hal9.com/login";
const LOGIN_INFO_API_URL = "https://api.hal9.com/api/login";

function getHal9LoginPageUrl(token: string) {
  return `${LOGIN_PAGE_URL}?token=${token}`;
}

function getHal9LoginInfoApiUrl(token: string) {
  return `${LOGIN_INFO_API_URL}?token=${token}`;
}

async function fetchLoginToken() {
  const res = await fetch(LOGIN_TOKEN_REQUEST_API_URL, {
    method: "POST",
  });
  const resJson = await res.json();
  const token = resJson.token;
  return token;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface LoginInfo {
  user: string;
  photo: string;
}

function isLoginInfo(obj: any): obj is LoginInfo {
  return (
    "user" in obj &&
    typeof obj["user"] === "string" &&
    "photo" in obj &&
    typeof obj["photo"] === "string"
  );
}

async function subscribeLoginInfo(token: string): Promise<LoginInfo> {
  // Ref: https://javascript.info/long-polling

  const res = await fetch(getHal9LoginInfoApiUrl(token));

  if (res.status === 502) {
    return subscribeLoginInfo(token);
  } else if (res.status !== 200) {
    console.log(res.statusText);
    await delay(1000);
    return subscribeLoginInfo(token);
  } else {
    const resJson = await res.json();
    if ("done" in resJson && resJson["done"] === false) {
      console.debug("Login not done yet.");
      await delay(1000);
      return subscribeLoginInfo(token);
    } else {
      if (!isLoginInfo(resJson)) {
        throw new Error("Invalid login info");
      }
      return resJson;
    }
  }
}

async function login(): Promise<LoginInfo> {
  const token = await fetchLoginToken();

  window.open(getHal9LoginPageUrl(token), "_blank");

  return subscribeLoginInfo(token);
}

interface StreamlitComponentValue {
  user: string | null;
}
function setStreamlitComponentValue(value: StreamlitComponentValue) {
  Streamlit.setComponentValue(value);
}

function Hal9Login() {
  const [loginInfo, setLoginInfo] = useState<LoginInfo>();

  const handleLoginRequest = useCallback(() => {
    setLoginInfo(undefined);
    setStreamlitComponentValue({ user: null });

    try {
      login().then((loginInfo) => {
        setLoginInfo(loginInfo);
        setStreamlitComponentValue({ user: loginInfo.user });
      });
    } catch (e) {
      console.error(e);
    }
  }, []);

  setTimeout(() => {
    Streamlit.setFrameHeight();
  });

  if (loginInfo === undefined) {
    return <button onClick={handleLoginRequest}>Login</button>;
  }

  return (
    <div>
      <p>
        Logged in as <b>{loginInfo.user}</b>
      </p>
      <img src={loginInfo.photo} />
    </div>
  );
}

export default Hal9Login;
