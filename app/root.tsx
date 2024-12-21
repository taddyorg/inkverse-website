import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useMatches,
} from "react-router";

import type { Route } from "./+types/root";
import stylesheet from "./app.css?url";
import { getClient } from "@/lib/apollo/client.client";
import { useEffect } from 'react';

import 'react-notion-x/src/styles.css'
import 'prismjs/themes/prism-tomorrow.css'
import 'katex/dist/katex.min.css'

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;800&display=swap",
  },
  { rel: "stylesheet", href: stylesheet },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const matches = useMatches();
  const currentRouteData = matches[matches.length - 1]?.data;
  
  useEffect(() => {
    if ((currentRouteData as any)?.apolloState) {
      const client = getClient();
      if (client) {
        client.restore((currentRouteData as any).apolloState);
      }
    }
  }, [currentRouteData]);
  
  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Navbar />
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

function Navbar() {
  const ignoreNavRoutes = ["/blog", "/terms-of-service", "/open-source", "/brand-kit"];
  const matches = useMatches();
  
  // Check if the current route starts with any of the ignoreNavRoutes
  const ignoreNav = matches.some((match) => 
    ignoreNavRoutes.some(route => match.pathname.startsWith(route))
  );

  return (ignoreNav ? null :
    <nav className="p-4">
      <ul className="flex space-x-4">
        <li><a href="/" className="text-white">Home</a></li>
        <li><a href="/about" className="text-white">About</a></li>
        <li><a href="/contact" className="text-white">Contact</a></li>
      </ul>
    </nav>
  )
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
