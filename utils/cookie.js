const setAuthCookie = (token) => {
  document.cookie = `auth_token=${token}; path=/;max-age=3600`;
};

const getAuthCookie = () => {
  if (typeof window === "undefined") return;
  const cookie = document.cookie
    .split(";")
    .find((c) => c.trim().startsWith("auth_token="));
  if (!cookie) {
    return;
  }
  return cookie.split("=")[1];
};

const removeAuthCookie = () => {
  document.cookie = "auth_token=; max-age=0";
};

export { setAuthCookie, getAuthCookie, removeAuthCookie };
