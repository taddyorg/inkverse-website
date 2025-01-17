import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useMatches,
  useLoaderData,
  type LoaderFunction,
} from "react-router";

import { useEffect, useState } from 'react';
import { getTheme } from "@/lib/action/theme";

import type { Route } from "./+types/root";
import stylesheet from "./app.css?url";
import { getClient } from "@/lib/apollo/client.client";
import { Navbar } from './components/ui';

import 'react-notion-x/src/styles.css'
import 'prismjs/themes/prism-tomorrow.css'
import 'katex/dist/katex.min.css'

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://ink0.inkverse.co" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;800&display=swap",
  },
  { rel: "stylesheet", href: stylesheet },
  { rel: "icon", type: "image/x-icon", href: "/favicon/favicon.ico" },
  { rel: "apple-touch-icon", href: "/favicon/apple-touch-icon.png" },
  { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon/favicon-32x32.png" },
  { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon/favicon-16x16.png" },
  { rel: "icon", type: "image/png", sizes: "192x192", href: "/favicon/android-chrome-192x192.png" },
  { rel: "icon", type: "image/png", sizes: "512x512", href: "/favicon/android-chrome-512x512.png" },
];

export const loader: LoaderFunction = async ({ request }) => {
  const theme = await getTheme(request);
  return { theme };
};

export function Layout({ children }: { children: React.ReactNode }) {
  const { theme: initialTheme } = useLoaderData<{ theme: string }>();
  const [theme, setTheme] = useState(initialTheme);
  const matches = useMatches();
  const currentRouteData = matches[matches.length - 1]?.data;
  
  useEffect(() => {
    // Handle Apollo state restoration
    if ((currentRouteData as any)?.apolloState) {
      const client = getClient();
      if (client) {
        client.restore((currentRouteData as any).apolloState);
      }
    }
  }, [currentRouteData]);

  const toggleTheme = async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.className = newTheme;
    
    // Update the fetch path
    const response = await fetch('/api/theme', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ theme: newTheme }),
    });
    
    if (response.ok) {
      setTheme(newTheme);
    }
  };
  
  return (
    <html lang="en" className={theme}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Navbar isDarkMode={theme === 'dark'} onThemeToggle={toggleTheme} />
        {children}
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: (currentRouteData as any)?.apolloState
              ? `window.__APOLLO_STATE__=${JSON.stringify(
                  JSON.parse(JSON.stringify((currentRouteData as any).apolloState))
                ).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/\//g, '\\u002f')};`
              : '',
          }}
        />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
