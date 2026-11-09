"use client";

import Link from "next/link";
import {
  addTransitionType,
  startTransition,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  ViewTransition,
} from "react";
import { filterProducts, PRODUCTS } from "@/lib/products";
import { useStore } from "@/lib/store";
import { AppCta, AppIcon, AppImage } from "./app-media";
import { CategoryPills } from "./category-pills";
import { Icon } from "./icon";
import { CommentsModal, ShareModal } from "./modals";

// Only feed paging slides; category changes and route navigations swap instantly.
const FEED_SLIDE = { "feed-next": "feed-next", "feed-prev": "feed-prev", default: "none" };

export function Feed() {
  const store = useStore();
  const { category, query, feedAppId, setFeedAppId, shot, setShot, t } = store;
  const list = filterProducts(PRODUCTS, category, query, t);
  const index = Math.max(0, list.findIndex((p) => p.id === feedAppId));
  const app = list[index];
  const hasApp = Boolean(app);

  // Wheel/trackpad gestures move one app at a time, like the arrow buttons.
  const layoutRef = useRef<HTMLElement>(null);
  const moveApp = (dir: number) => {
    const next = list[index + dir];
    if (!next) return;
    startTransition(() => {
      addTransitionType(dir > 0 ? "feed-next" : "feed-prev");
      setFeedAppId(next.id);
      setShot(1);
    });
  };
  // Scrolling down first folds the categories away so the whole reel fits on screen;
  // scrolling up on the first app brings them back.
  const [pillsHidden, setPillsHidden] = useState(false);
  const scrollFeed = (dir: number) => {
    if (dir > 0 && !pillsHidden) return setPillsHidden(true);
    if (dir < 0 && index === 0) return setPillsHidden(false);
    if (dir > 0) setPillsHidden(true);
    moveApp(dir);
  };
  const onWheelMove = useEffectEvent(scrollFeed);

  useEffect(() => {
    const el = layoutRef.current;
    if (!el) return;
    const g = { last: 0, total: 0, direction: 0, consumed: false, lockedUntil: 0 };
    const onWheel = (e: WheelEvent) => {
      if (document.querySelector("dialog[open]") || e.ctrlKey || e.metaKey) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || !e.deltaY) return;
      const now = performance.now();
      const direction = Math.sign(e.deltaY);
      if (now - g.last > 200 || direction !== g.direction) {
        g.total = 0;
        g.consumed = false;
      }
      g.last = now;
      g.direction = direction;
      // Swallow the rest of one gesture, including trackpad momentum.
      if (g.consumed || now < g.lockedUntil) {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
      g.total += Math.abs(e.deltaY) * unit;
      if (g.total < 48) return;
      g.total = 0;
      g.consumed = true;
      g.lockedUntil = now + 450;
      onWheelMove(direction);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [hasApp]);

  if (!app)
    return (
      <>
        <CategoryPills />
        <div className="empty">
          <h2>{query ? t("검색 결과가 없어요") : t("이 카테고리의 앱은 준비 중이에요")}</h2>
          <p>
            {query
              ? t("다른 앱 이름이나 카테고리로 찾아보세요.")
              : t("선택한 카테고리를 다시 누르면 필터가 해제됩니다.")}
          </p>
        </div>
      </>
    );

  const shotIndex = Math.min(shot, app.images.length) - 1;
  const image = app.images[shotIndex];
  const { liked, saved, comments } = store.appState(app.id);
  const multiShot = app.images.length > 1;

  return (
    <>
      <div className={`feed-pills${pillsHidden ? " is-hidden" : ""}`} inert={pillsHidden}>
        <CategoryPills />
      </div>
      <section
        ref={layoutRef}
        className={`reel-layout${image.width > image.height ? " wide-reel" : ""}`}
        aria-label={t("앱 피드")}
      >
        <ViewTransition key={app.id} enter={FEED_SLIDE} exit={FEED_SLIDE} default="none">
          <div className="reel-column">
            <div className="reel-player">
              <Link
                className="reel-image-button"
                href={`/apps/${app.id}`}
                aria-label={t("{name} 상세 보기", { name: app.name })}
              >
                <AppImage app={app} index={shotIndex} className="reel-image" priority />
              </Link>
            </div>
            <div className="feed-app-info">
              <Link className="reel-app" href={`/apps/${app.id}`}>
                <AppIcon app={app} />
                <span>
                  <strong>{app.name}</strong>
                  <small>{app.categories.map((c) => t(c)).join(" · ")}</small>
                </span>
                <Icon name="arrow" />
              </Link>
              <p>{t(app.description)}</p>
            </div>
            <div className="image-controls">
              <button
                type="button"
                className="text-button"
                aria-label={t("이전 이미지")}
                disabled={!multiShot}
                onClick={() => setShot(shotIndex === 0 ? app.images.length : shotIndex)}
              >
                ←
              </button>
              <small>
                {t(app.label)} · {shotIndex + 1}/{app.images.length}
              </small>
              <button
                type="button"
                className="text-button"
                aria-label={t("다음 이미지")}
                disabled={!multiShot}
                onClick={() => setShot(shotIndex + 1 === app.images.length ? 1 : shotIndex + 2)}
              >
                →
              </button>
            </div>
            <div className="reel-try">
              <AppCta app={app} />
            </div>
          </div>
        </ViewTransition>
        <div className="reel-side">
          <div className="reel-actions">
            <button
              type="button"
              aria-label={t("좋아요")}
              aria-pressed={liked}
              onClick={() => store.toggleLiked(app.id)}
            >
              <Icon name="heart" />
              <span>{liked ? t("좋아요 취소") : t("좋아요")}</span>
            </button>
            <button
              type="button"
              aria-pressed={saved}
              onClick={() =>
                store.toast(
                  store.toggleSaved(app.id) ? t("내 앱에 추가했어요") : t("내 앱에서 제거했어요"),
                )
              }
            >
              <Icon name="save" />
              <span>{saved ? t("추가됨") : t("내 앱")}</span>
            </button>
            <button
              type="button"
              onClick={() =>
                store.openModal(t("함께 나누는 한마디"), <CommentsModal appId={app.id} />)
              }
            >
              <Icon name="comment" />
              <span>{comments.length || t("댓글")}</span>
            </button>
            <button
              type="button"
              onClick={() =>
                store.openModal(t("{name} 공유하기", { name: app.name }), <ShareModal appId={app.id} />)
              }
            >
              <Icon name="share" />
              <span>{t("공유")}</span>
            </button>
          </div>
          <div className="reel-pager">
            <button
              type="button"
              className="icon-button"
              aria-label={t("이전 앱")}
              disabled={index === 0}
              onClick={() => moveApp(-1)}
            >
              ↑
            </button>
            <span>
              {index + 1} / {list.length}
            </span>
            <button
              type="button"
              className="icon-button"
              aria-label={t("다음 앱")}
              disabled={index === list.length - 1}
              onClick={() => {
                setPillsHidden(true);
                moveApp(1);
              }}
            >
              ↓
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
