import { delay } from "./utils";
import { isLoginInfo, type LoginInfo } from "./types";

const LOGIN_TOKEN_REQUEST_API_URL = "https://api.hal9.com/api/login";
const LOGIN_PAGE_URL = "https://api.hal9.com/login";
const LOGIN_INFO_API_URL = "https://api.hal9.com/api/login";

function getHal9LoginPageUrl(token: string) {
  return `${LOGIN_PAGE_URL}?token=${token}`;
}

function getHal9LoginInfoApiUrl(token: string) {
  return `${LOGIN_INFO_API_URL}?token=${token}`;
}

export async function fetchLoginToken(): Promise<string> {
  const res = await fetch(LOGIN_TOKEN_REQUEST_API_URL, {
    method: "POST",
  });
  const resJson = await res.json();
  const token = resJson.token;
  if (typeof token !== "string") {
    throw new Error("Invalid token");
  }
  return token;
}

export function openLoginPage(token: string): void {
  window.open(getHal9LoginPageUrl(token), "_blank");
}

export async function subscribeLoginInfo(token: string): Promise<LoginInfo> {
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
