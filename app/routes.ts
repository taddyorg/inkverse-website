import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("blog/:slug?", "routes/blog.tsx"),
    route("open-source/:slug?", "routes/open-source.tsx"),
    route("brand-kit/:slug?", "routes/brand-kit.tsx"),
    route("terms-of-service/:slug?", "routes/terms-of-service.tsx"),
    route("comics/:shortUrl?", "routes/comics.tsx"),
] satisfies RouteConfig;
