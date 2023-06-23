export interface LoginInfo {
  user: string;
  photo: string;
}

export function isLoginInfo(obj: any): obj is LoginInfo {
  return (
    "user" in obj &&
    typeof obj["user"] === "string" &&
    "photo" in obj &&
    typeof obj["photo"] === "string"
  );
}
