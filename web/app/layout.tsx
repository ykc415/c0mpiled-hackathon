import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Shell } from "@/components/shell";
import { StoreProvider } from "@/lib/store";
import "./globals.css";

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Appetizer — 새로운 앱을 만나는 곳",
  description: "작은 팀의 큰 아이디어를 15초 만에 발견하고, 설치 없이 써보세요.",
};

export const viewport: Viewport = {
  themeColor: "#0B0B0F",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body>
        <StoreProvider>
          <Shell>{children}</Shell>
        </StoreProvider>
      </body>
    </html>
  );
}
