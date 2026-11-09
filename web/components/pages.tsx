"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { filterProducts, getProduct, PRODUCTS, type Product } from "@/lib/products";
import { useStore } from "@/lib/store";
import { AppCta, AppIcon, AppImage } from "./app-media";
import { CategoryPills } from "./category-pills";
import { Icon } from "./icon";
import { PreviewModal } from "./modals";

function PageHeading({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="page-heading">
      <div>
        <div className="eyebrow">새로운 앱을 만나는 곳</div>
        <h1>{title}</h1>
        <p>{desc}</p>
      </div>
      <span className="pill">설치 전, 가볍게 경험하기</span>
    </div>
  );
}

function sourcePill(app: Product) {
  if (app.hasSample) return "샘플 체험";
  return app.id === "photo" ? "공식 생성 예시" : "공식 스크린샷";
}

export function Explore() {
  const { category, query, setQuery, setCategory } = useStore();
  const list = filterProducts(PRODUCTS, category, query);
  return (
    <>
      <CategoryPills />
      <div className="explore-meta">
        <span>{query ? `“${query}” 검색 결과` : "모든 앱"}</span>
        <span>{list.length}개</span>
      </div>
      {list.length ? (
        <div className="explore-grid">
          {list.map((app) => (
            <article className="explore-card" key={app.id}>
              <Link
                className="explore-media"
                href={`/apps/${app.id}`}
                aria-label={`${app.name} 상세 보기`}
              >
                <AppImage app={app} />
              </Link>
              <div className="explore-info">
                <Link className="app-row" href={`/apps/${app.id}`}>
                  <AppIcon app={app} />
                  <span>
                    <strong>{app.name}</strong>
                    <small>{app.categories.join(" · ")}</small>
                  </span>
                </Link>
                <p>{app.description}</p>
                <div className="explore-card-footer">
                  <span className="pill">{sourcePill(app)}</span>
                  <Link className="text-button" href={`/apps/${app.id}`}>
                    자세히 보기 ↗
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty">
          <h2>검색 결과가 없어요</h2>
          <p>다른 앱 이름이나 카테고리로 찾아보세요.</p>
          <button
            type="button"
            className="primary"
            onClick={() => {
              setQuery("");
              setCategory("추천");
            }}
          >
            필터 초기화
          </button>
        </div>
      )}
    </>
  );
}

export function Library() {
  const { appState, setSaved, persistent, toast } = useStore();
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
              <p>{app.description}</p>
              <AppCta app={app} />
              <div className="library-controls">
                <Link className="text-button" href={`/apps/${app.id}`}>
                  앱 정보
                </Link>
                <button
                  type="button"
                  className="text-button"
                  onClick={() => {
                    setSaved(app.id, false);
                    toast(
                      app.hasSample
                        ? "내 앱에서 제거했어요. 샘플 기록은 유지돼요."
                        : "내 앱에서 제거했어요",
                    );
                  }}
                >
                  저장 해제
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty">
          <h2>아직 저장한 앱이 없어요</h2>
          <Link className="primary" href="/explore">
            앱 둘러보기
          </Link>
        </div>
      )}
      <p className="intro-note">
        {persistent
          ? "내 앱과 Cal AI 샘플 기록은 이 브라우저에 보관됩니다."
          : "이 창을 열어둔 동안 내 앱과 기록이 유지됩니다."}
      </p>
    </>
  );
}

export function MyPage() {
  return (
    <>
      <PageHeading
        title="반가워요, 새로운 발견자님."
        desc="내가 좋아하는 앱과, 내가 만든 앱을 한곳에서."
      />
      <section className="my-profile">
        <div className="app-row">
          <span className="profile">나</span>
          <h2>나의 공간</h2>
        </div>
        <p>마음에 드는 앱을 모아두고, 직접 만든 앱도 소개해보세요.</p>
        <Link className="primary" href="/library">
          내 앱 열기 <Icon name="arrow" />
        </Link>
        <Link className="outline" style={{ width: "100%", marginTop: 12 }} href="/register">
          메이커로 앱 소개하기
        </Link>
        <small style={{ display: "block", marginTop: 20 }}>
          계정 없이 사용하는 로컬 프로토타입입니다.
        </small>
      </section>
    </>
  );
}

function DetailPanel({ app }: { app: Product }) {
  return (
    <aside className="detail">
      <div className="detail-header">
        <span>앱 정보</span>
        <span className="pill">{app.hasSample ? "샘플 체험" : "공식 서비스"}</span>
      </div>
      <div className="app-row">
        <AppIcon app={app} />
        <div>
          <h2>{app.name}</h2>
          <small>{app.categories.join(" · ")}</small>
        </div>
      </div>
      <p className="detail-tagline">{app.description}</p>
      <div className="tags">
        {app.categories.map((c) => (
          <span key={c}>{c}</span>
        ))}
      </div>
      <AppCta app={app} />
      <p className="hint">
        {app.hasSample
          ? "무료 샘플 · 실제 Cal AI와 연동되지 않아요"
          : "공식 서비스에서 설치·가입 및 이용 조건을 확인하세요"}
      </p>
      <section className="detail-section">
        <h3>시작하기 전에</h3>
        <dl className="conditions">
          <div>
            <dt>이용 방법</dt>
            <dd>{app.access}</dd>
          </div>
          <div>
            <dt>가격·이용 조건</dt>
            <dd>공식 페이지에서 확인</dd>
          </div>
        </dl>
        <a className="official" href={app.url} target="_blank" rel="noopener noreferrer">
          공식 페이지 보기 ↗
        </a>
      </section>
      <p className="developer">
        {app.owner}
        <br />
        {app.label}
      </p>
    </aside>
  );
}

export function ProductDetail({ id }: { id: string }) {
  const router = useRouter();
  const { appState, toggleSaved, openModal, toast } = useStore();
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
          <Icon name="back" /> 돌아가기
        </button>
        <span>{app.name}</span>
      </div>
      <div className="product-layout">
        <section className="product-media">
          <div className="product-heading">
            <h1>{app.name}</h1>
            <p>{app.description}</p>
          </div>
          <div className="product-gallery">
            {app.images.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`${app.name} 이미지 ${i + 1} 확대`}
                onClick={() =>
                  openModal(`${app.name} 미리보기`, <PreviewModal appId={app.id} index={i} />)
                }
              >
                <AppImage app={app} index={i} />
              </button>
            ))}
          </div>
          <section className="product-about">
            <p>{app.label}</p>
            <button
              type="button"
              className="outline"
              aria-pressed={saved}
              onClick={() =>
                toast(toggleSaved(app.id) ? "내 앱에 추가했어요" : "내 앱에서 제거했어요")
              }
            >
              <Icon name="save" />
              <span>{saved ? "내 앱에서 제거" : "내 앱에 추가"}</span>
            </button>
          </section>
        </section>
        <DetailPanel app={app} />
      </div>
    </>
  );
}
