import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Water Tracker",
    short_name: "WaterTrack",
    description: "Track your daily water consumption",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#3b82f6",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
    orientation: "portrait",
  }
}

