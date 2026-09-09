import type { MetadataRoute } from "next";
import { navigation } from "@/lib/content";

const BASE_URL = "https://www.tropicaldigital.example";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["/", ...navigation.map((item) => item.href), "/accessibility", "/image-credits"];

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
