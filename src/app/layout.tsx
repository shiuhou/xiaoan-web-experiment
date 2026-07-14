import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/inter-tight";
import { MotionProvider } from "@/components/motion/motion-provider";
import { SignalThread } from "@/components/motion/signal-thread";
import { SceneNavigator } from "@/components/ui/scene-navigator";
import "./globals.css";

export const metadata: Metadata = {
  title: "Xiao-An — From Signal to Presence",
  description:
    "An experimental scroll narrative for Xiao-An, the embodied desktop Agent built around Intel DK-2500 and OpenClaw.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020507",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="zh-Hant">
      <body>
        <a className="skip-link" href="#main-content">
          跳到主要內容
        </a>
        <MotionProvider>
          <SceneNavigator />
          <SignalThread />
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}
