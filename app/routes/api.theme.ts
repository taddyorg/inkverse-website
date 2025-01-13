import type { ActionFunction } from "react-router";
import { setTheme } from "@/lib/action/theme";

export const action: ActionFunction = async ({ request }: { request: Request }) => {
  try {
    if (request.method !== "POST") {
      throw new Response("Method not allowed", { status: 405 });
    }

    const { theme } = await request.json();
    
    if (theme !== "dark" && theme !== "light") {
      throw new Response("Invalid theme", { status: 400 });
    }

    const cookie = await setTheme(theme);
    
    if (!cookie) {
      throw new Error("Failed to set theme cookie");
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": cookie,
      },
    });
  } catch (error) {
    console.error("Theme setting error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to set theme" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};