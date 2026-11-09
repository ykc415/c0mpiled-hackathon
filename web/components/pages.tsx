"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { filterProducts, getProduct, PRODUCTS, type Product } from "@/lib/products";
import { useStore } from "@/lib/store";
import { AppCta, AppIcon, AppImage } from "./app-media";
import { CategoryPills } from "./category-pills";
import { Icon } from "./icon";
import { PreviewModal } from "./modals";

function PageHeading({ title, desc }: { title: string; desc: string }) {
  const { t } = useStore();
  return (
    <div className="page-heading">
      <div>
        <div className="eyebrow">{t("새로운 앱을 만나는 곳")}</div>
        <h1>{t(title)}</h1>
        <p>{t(desc)}</p>
      </div>
      <span className="pill">{t("설치 전, 가볍게 경험하기")}</span>
    </div>
  );
}

function sourcePill(app: Product) {
  if (app.hasSample) return "샘플 체험";
  return app.id === "photo" ? "공식 생성 예시" : "공식 스크린샷";
}

export function Explore() {
  const { category, query, setQuery, setCategory, t } = useStore();
  const list = filterProducts(PRODUCTS, category, query, t);
  return (
    <>
      {/* Phones have no top bar, so Explore carries its own search field there. */}
      <label className="search-wrap explore-search mobile-only">
        <Icon name="search" />
        <input
          aria-label={t("앱 검색")}
          placeholder={t("어떤 앱을 찾고 있나요?")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>
      <CategoryPills />
      <div className="explore-meta">
        <span>{query ? t("“{query}” 검색 결과", { query }) : t("모든 앱")}</span>
        <span>{t("{n}개", { n: list.length })}</span>
      </div>
      {list.length ? (
        <div className="explore-grid">
          {list.map((app) => (
            <article className="explore-card" key={app.id}>
              <Link
                className="explore-media"
                href={`/apps/${app.id}`}
                aria-label={t("{name} 상세 보기", { name: app.name })}
              >
                <AppImage app={app} />
              </Link>
              <div className="explore-info">
                <Link className="app-row" href={`/apps/${app.id}`}>
                  <AppIcon app={app} />
                  <span>
                    <strong>{app.name}</strong>
                    <small>{app.categories.map((c) => t(c)).join(" · ")}</small>
                  </span>
                </Link>
                <p>{t(app.description)}</p>
                <div className="explore-card-footer">
                  <span className="pill">{t(sourcePill(app))}</span>
                  <Link className="text-button" href={`/apps/${app.id}`}>
                    {t("자세히 보기 ↗")}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty">
          <h2>{t("검색 결과가 없어요")}</h2>
          <p>{t("다른 앱 이름이나 카테고리로 찾아보세요.")}</p>
          <button
            type="button"
            className="primary"
            onClick={() => {
              setQuery("");
              setCategory("추천");
            }}
          >
            {t("필터 초기화")}
          </button>
        </div>
      )}
    </>
  );
}

const MEDALS = ["🥇", "🥈", "🥉"];

export function Trending() {
  const { appState, t } = useStore();
  // Sample trial counts plus this browser's own likes, saves and comments.
  const list = PRODUCTS.map((app) => {
    const s = appState(app.id);
    return { app, score: app.trend + Number(s.liked) + Number(s.saved) + s.comments.length };
  }).sort((a, b) => b.score - a.score);
  return (
    <section className="trending">
      <h1>
        <span aria-hidden="true">🔥</span> {t("트렌딩")}
      </h1>
      <ol className="trending-list">
        {list.map(({ app, score }, i) => {
          const thumb = app.icon ?? app.images[0];
          return (
            <li key={app.id}>
              <Link className="trending-row" href={`/apps/${app.id}`}>
                <span className="trending-rank" aria-label={t("{n}위", { n: i + 1 })}>
                  {MEDALS[i] ?? i + 1}
                </span>
                <Image
                  className="trending-thumb"
                  src={thumb.src}
                  width={thumb.width}
                  height={thumb.height}
                  alt=""
                />
                <span className="trending-info">
                  <strong>{app.name}</strong>
                  <span>{t(app.description)}</span>
                  <small>{app.categories.map((c) => t(c)).join(", ")}</small>
                </span>
                <span className="trending-score">
                  <span aria-label={t("체험 {n}회", { n: score })}>
                    <Icon name="trend" /> {score}
                  </span>
                  <small>{t("자세히")}</small>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
      <p className="intro-note">
        {t("체험 수는 시연용 샘플이에요. 내 좋아요·저장·댓글이 바로 반영돼요.")}
      </p>
    </section>
  );
}

export function Library() {
  const { appState, setSaved, persistent, toast, t } = useStore();
  const list = PRODUCTS.filter((p) => appState(p.id).saved);
  return (
    <>
      <PageHeading title="내 앱" desc="저장한 앱을 다시 열어보세요." />
      {list.length ? (
        <div className="library-grid">
          {list.map((app) => (
            <article className="library-card" key={app.id}>
              <div className="app-row">
                <AppIcon app={app} />
                <h2>{app.name}</h2>
              </div>
              <p>{t(app.description)}</p>
              <AppCta app={app} />
              <div className="library-controls">
                <Link className="text-button" href={`/apps/${app.id}`}>
                  {t("앱 정보")}
                </Link>
                <button
                  type="button"
                  className="text-button"
                  onClick={() => {
                    setSaved(app.id, false);
                    toast(
                      app.hasSample
                        ? t("내 앱에서 제거했어요. 샘플 기록은 유지돼요.")
                        : t("내 앱에서 제거했어요"),
                    );
                  }}
                >
                  {t("저장 해제")}
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty">
          <h2>{t("아직 저장한 앱이 없어요")}</h2>
          <Link className="primary" href="/explore">
            {t("앱 둘러보기")}
          </Link>
        </div>
      )}
      <p className="intro-note">
        {persistent
          ? t("내 앱과 Cal AI 샘플 기록은 이 브라우저에 보관됩니다.")
          : t("이 창을 열어둔 동안 내 앱과 기록이 유지됩니다.")}
      </p>
    </>
  );
}

export function MyPage() {
  const { t } = useStore();
  return (
    <>
      <PageHeading
        title="반가워요, 새로운 발견자님."
        desc="내가 좋아하는 앱과, 내가 만든 앱을 한곳에서."
      />
      <section className="my-profile">
        <div className="app-row">
          <span className="profile">{t("나")}</span>
          <h2>{t("나의 공간")}</h2>
        </div>
        <p>{t("마음에 드는 앱을 모아두고, 직접 만든 앱도 소개해보세요.")}</p>
        <Link className="primary" href="/library">
          {t("내 앱 열기")} <Icon name="arrow" />
        </Link>
        <Link className="outline" style={{ width: "100%", marginTop: 12 }} href="/register">
          {t("메이커로 앱 소개하기")}
        </Link>
        <small style={{ display: "block", marginTop: 20 }}>
          {t("계정 없이 사용하는 로컬 프로토타입입니다.")}
        </small>
      </section>
    </>
  );
}

function DetailPanel({ app }: { app: Product }) {
  const { t } = useStore();
  return (
    <aside className="detail">
      <div className="detail-header">
        <span>{t("앱 정보")}</span>
        <span className="pill">{app.hasSample ? t("샘플 체험") : t("공식 서비스")}</span>
      </div>
      <div className="app-row">
        <AppIcon app={app} />
        <div>
          <h2>{app.name}</h2>
          <small>{app.categories.map((c) => t(c)).join(" · ")}</small>
        </div>
      </div>
      <p className="detail-tagline">{t(app.description)}</p>
      <div className="tags">
        {app.categories.map((c) => (
          <span key={c}>{t(c)}</span>
        ))}
      </div>
      <AppCta app={app} />
      <p className="hint">
        {app.hasSample
          ? t("무료 샘플 · 실제 Cal AI와 연동되지 않아요")
          : t("공식 서비스에서 설치·가입 및 이용 조건을 확인하세요")}
      </p>
      <section className="detail-section">
        <h3>{t("시작하기 전에")}</h3>
        <dl className="conditions">
          <div>
            <dt>{t("이용 방법")}</dt>
            <dd>{t(app.access)}</dd>
          </div>
          <div>
            <dt>{t("가격·이용 조건")}</dt>
            <dd>{t("공식 페이지에서 확인")}</dd>
          </div>
        </dl>
        <a className="official" href={app.url} target="_blank" rel="noopener noreferrer">
          {t("공식 페이지 보기 ↗")}
        </a>
      </section>
      <p className="developer">
        {app.owner}
        <br />
        {t(app.label)}
      </p>
    </aside>
  );
}

export function ProductDetail({ id }: { id: string }) {
  const router = useRouter();
  const { appState, toggleSaved, openModal, toast, t } = useStore();
  const app = getProduct(id)!;
  const saved = appState(app.id).saved;
  return (
    <>
      <div className="product-breadcrumb">
        <button
          type="button"
          className="text-button"
          onClick={() => (window.history.length > 1 ? router.back() : router.push("/"))}
        >
          <Icon name="back" /> {t("돌아가기")}
        </button>
        <span>{app.name}</span>
      </div>
      <div className="product-layout">
        <section className="product-media">
          <div className="product-heading">
            <h1>{app.name}</h1>
            <p>{t(app.description)}</p>
          </div>
          <div className="product-gallery">
            {app.images.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={t("{name} 이미지 {n} 확대", { name: app.name, n: i + 1 })}
                onClick={() =>
                  openModal(t("{name} 미리보기", { name: app.name }), <PreviewModal appId={app.id} index={i} />)
                }
              >
                <AppImage app={app} index={i} />
              </button>
            ))}
          </div>
          <section className="product-about">
            <p>{t(app.label)}</p>
            <button
              type="button"
              className="outline"
              aria-pressed={saved}
              onClick={() =>
                toast(toggleSaved(app.id) ? t("내 앱에 추가했어요") : t("내 앱에서 제거했어요"))
              }
            >
              <Icon name="save" />
              <span>{saved ? t("내 앱에서 제거") : t("내 앱에 추가")}</span>
            </button>
          </section>
        </section>
        <DetailPanel app={app} />
      </div>
    </>
  );
}
