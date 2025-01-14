import { createCookie } from "react-router";

export const themeCookie = createCookie("theme", {
  path: "/",
  sameSite: "lax",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 24 * 400,
});

export async function getTheme(request: Request) {
  const cookieHeader = request.headers.get("Cookie");
  const theme = await themeCookie.parse(cookieHeader);
  return theme?.theme || "dark"; // Default to dark theme if no cookie exists
}

export async function setTheme(theme: "dark" | "light") {
  return await themeCookie.serialize({ theme });
}