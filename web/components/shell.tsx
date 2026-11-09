"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import type { Vars } from "@/lib/i18n";
import { getProduct } from "@/lib/products";
import { useStore } from "@/lib/store";
import { Icon, type IconName } from "./icon";
import { ModalHost, Toast } from "./modal-host";

const NAV: { href: string; label: string; icon: IconName }[] = [
  { href: "/", label: "피드", icon: "home" },
  { href: "/explore", label: "탐색", icon: "search" },
  { href: "/trending", label: "트렌딩", icon: "trend" },
  { href: "/library", label: "내 앱", icon: "save" },
  { href: "/me", label: "마이", icon: "user" },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function breadcrumb(pathname: string, t: (ko: string, vars?: Vars) => string) {
  if (pathname === "/") return t("발견");
  if (pathname.startsWith("/apps/")) {
    const app = getProduct(pathname.split("/")[2] ?? "");
    return app ? t("{name} / 앱 상세", { name: app.name }) : t("앱 상세");
  }
  if (pathname.startsWith("/register")) return t("메이커 / 앱 등록");
  const label = NAV.find((n) => isActive(pathname, n.href))?.label;
  return label ? t(label) : "";
}

export function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { savedCount, query, setQuery, lang, setLang, t } = useStore();
  const isFeed = pathname === "/";

  return (
    <>
      <div className={isFeed ? "shell feed-shell" : "shell"}>
        <aside className="sidebar">
          <div className="brand-row">
            <Link className="brand" href="/" aria-label={t("Appetizer 홈")}>
              <span className="brand-mark">↗</span>Appetizer
            </Link>
            <Link className="outline mobile-only" href="/register">
              {t("앱 소개 ↗")}
            </Link>
          </div>
          <nav className="nav" aria-label={t("주요 메뉴")}>
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
                  <span>{t(n.label)}</span>
                  {n.href === "/library" && <span className="badge">{savedCount}</span>}
                </Link>
              );
            })}
          </nav>
          <div className="sidebar-note">
            <small>
              {t("새로운 앱과의 첫 만남.")}
              <br />
              {t("써보고, 마음에 들면 내 앱으로.")}
            </small>
          </div>
          <div className="sidebar-bottom">
            <Link className="outline" style={{ width: "100%" }} href="/register">
              {t("내 앱 소개하기")} <span aria-hidden="true">↗</span>
            </Link>
            <p>
              {t("작은 팀의 큰 아이디어를 만나요.")}
              <br />{t("© Appetizer · 인터랙티브 데모")}
            </p>
          </div>
        </aside>
        <div className="workspace">
          <header className="topbar">
            <div className="breadcrumb">{breadcrumb(pathname, t)}</div>
            <div className="top-actions">
              <label className="search-wrap">
                <Icon name="search" />
                <input
                  aria-label={t("앱 검색")}
                  placeholder={t("어떤 앱을 찾고 있나요?")}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    if (!pathname.startsWith("/explore")) router.push("/explore");
                  }}
                />
              </label>
              <button
                type="button"
                className="lang-toggle"
                aria-label={t("언어 바꾸기")}
                onClick={() => setLang(lang === "en" ? "ko" : "en")}
              >
                <span aria-current={lang === "en" || undefined}>EN</span>
                <span aria-current={lang === "ko" || undefined}>한</span>
              </button>
              <Link className="profile" href="/me" aria-label={t("내 프로필")}>
                {t("나")}
              </Link>
            </div>
          </header>
          <main className={isFeed ? "content is-feed" : "content"}>{children}</main>
        </div>
      </div>
      <nav className="tabbar" aria-label={t("하단 메뉴")}>
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
              <span>{t(n.label)}</span>
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
