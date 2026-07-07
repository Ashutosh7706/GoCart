import "./globals.css";
import { Provider } from "react-redux";
import { store } from "@/lib/store"; 
import Providers from "./providers";
import {Toaster} from "react-hot-toast";

export const metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL),

    title: {
        default: "GoCart",
        template: "%s | GoCart",
    },

    description:
        "GoCart is a modern multi-vendor marketplace for electronics, fashion, books and more.",

    keywords: [
        "GoCart",
        "Ecommerce",
        "Marketplace",
        "Shopping",
        "Online Store",
    ],

    openGraph: {
        title: "GoCart",
        description:
            "Multi-vendor shopping platform",

        type: "website",

        url: process.env.NEXT_PUBLIC_APP_URL,

        siteName: "GoCart",

        images: [
            {
                url: "/logo.png",
                width: 1200,
                height: 630,
            },
        ],
    },

    twitter: {

        card: "summary_large_image",

        title: "GoCart",

        description:
            "Modern Ecommerce Platform",

        images: ["/logo.png"],

    },

    robots: {

        index: true,

        follow: true,

    },

};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
  {children}
  <Toaster
  position = "top-right"
  reverseOrder = {false}
  toastOptions = {{
    duration: 3000,
  }}/>
        </Providers>
      </body>
    </html>
  );
}