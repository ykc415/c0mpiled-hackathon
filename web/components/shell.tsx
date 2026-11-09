"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { getProduct } from "@/lib/products";
import { useStore } from "@/lib/store";
import { Icon, type IconName } from "./icon";
import { ModalHost, Toast } from "./modal-host";

const NAV: { href: string; label: string; icon: IconName }[] = [
  { href: "/", label: "피드", icon: "home" },
  { href: "/explore", label: "탐색", icon: "search" },
  { href: "/library", label: "내 앱", icon: "save" },
  { href: "/me", label: "마이", icon: "user" },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function breadcrumb(pathname: string) {
  if (pathname === "/") return "발견";
  if (pathname.startsWith("/apps/")) {
    const app = getProduct(pathname.split("/")[2] ?? "");
    return app ? `${app.name} / 앱 상세` : "앱 상세";
  }
  if (pathname.startsWith("/register")) return "메이커 / 앱 등록";
  return NAV.find((n) => isActive(pathname, n.href))?.label ?? "";
}

export function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { savedCount, query, setQuery } = useStore();
  const isFeed = pathname === "/";

  return (
    <>
      <div className="shell">
        <aside className="sidebar">
          <div className="brand-row">
            <Link className="brand" href="/" aria-label="Indie Shorts 홈">
              <span className="brand-mark">↗</span>Indie Shorts
            </Link>
            <Link className="outline mobile-only" href="/register">
              앱 소개 ↗
            </Link>
          </div>
          <nav className="nav" aria-label="주요 메뉴">
            {NAV.map((n) => {
              const active = isActive(pathname, n.href);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={active ? "active" : undefined}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon name={n.icon} />
                  <span>{n.label}</span>
                  {n.href === "/library" && <span className="badge">{savedCount}</span>}
                </Link>
              );
            })}
          </nav>
          <div className="sidebar-note">
            <small>
              새로운 앱과의 첫 만남.
              <br />
              써보고, 마음에 들면 내 앱으로.
            </small>
          </div>
          <div className="sidebar-bottom">
            <Link className="outline" style={{ width: "100%" }} href="/register">
              내 앱 소개하기 <span aria-hidden="true">↗</span>
            </Link>
            <p>
              작은 팀의 큰 아이디어를 만나요.
              <br />© Indie Shorts · 인터랙티브 데모
            </p>
          </div>
        </aside>
        <div className="workspace">
          <header className="topbar">
            <div className="breadcrumb">{breadcrumb(pathname)}</div>
            <div className="top-actions">
              <label className="search-wrap">
                <Icon name="search" />
                <input
                  aria-label="앱 검색"
                  placeholder="어떤 앱을 찾고 있나요?"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    if (!pathname.startsWith("/explore")) router.push("/explore");
                  }}
                />
              </label>
              <Link className="profile" href="/me" aria-label="내 프로필">
                나
              </Link>
            </div>
          </header>
          <main className={isFeed ? "content is-feed" : "content"}>{children}</main>
        </div>
      </div>
      <nav className="tabbar" aria-label="하단 메뉴">
        {NAV.map((n) => {
          const active = isActive(pathname, n.href);
          return (
            <Link
              key={n.href}
              href={n.href}
              className={active ? "active" : undefined}
              aria-current={active ? "page" : undefined}
            >
              <Icon name={n.icon} />
              <span>{n.label}</span>
              {n.href === "/library" && savedCount > 0 && (
                <span className="badge">{savedCount}</span>
              )}
            </Link>
          );
        })}
      </nav>
      <ModalHost />
      <Toast />
    </>
  );
}
