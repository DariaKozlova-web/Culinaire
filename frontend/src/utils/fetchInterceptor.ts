const originalFetch = fetch;
const serverURL = import.meta.env.VITE_APP_SERVER_URL;
if (!serverURL) {
  console.error("No server URL set");
}
const authServiceURL = serverURL + "/auth";

window.fetch = async (url, options, ...rest) => {
  let res = await originalFetch(
    url,
    { ...options, credentials: "include" },
    ...rest,
  );
  const authHeader = res.headers.get("WWW-Authenticate");
  if (authHeader?.includes("token_expired")) {
    console.info("ATTEMPT REFRESH");
    const refreshRes = await originalFetch(`${authServiceURL}/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (!refreshRes.ok) throw new Error("Login required");
    res = await originalFetch(
      url,
      { ...options, credentials: "include" },
      ...rest,
    );
  }
  return res;
};

export { serverURL, authServiceURL };
