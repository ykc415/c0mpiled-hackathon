"use client";

import Image from "next/image";
import type { Product } from "@/lib/products";
import { useStore } from "@/lib/store";
import { Icon } from "./icon";
import { TrialModal } from "./modals";

export function AppIcon({ app }: { app: Product }) {
  if (!app.icon)
    return (
      <span className="app-logo letter-icon" aria-hidden="true">
        {app.name[0]}
      </span>
    );
  return (
    <Image
      className="app-logo"
      src={app.icon.src}
      width={app.icon.width}
      height={app.icon.height}
      alt={`${app.name} 아이콘`}
    />
  );
}

export function AppImage({
  app,
  index = 0,
  className,
  priority,
}: {
  app: Product;
  index?: number;
  className?: string;
  priority?: boolean;
}) {
  const im = app.images[index] ?? app.images[0];
  return (
    <Image
      className={className}
      src={im.src}
      width={im.width}
      height={im.height}
      alt={`${app.name} · ${app.label} ${index + 1}`}
      priority={priority}
    />
  );
}

/** Primary action: in-app sample for apps that have one, otherwise the official store. */
export function AppCta({ app }: { app: Product }) {
  const { tried, startTrial, openModal } = useStore();
  if (app.hasSample)
    return (
      <button
        type="button"
        className="primary"
        onClick={() => {
          startTrial();
          openModal("Cal AI 샘플 체험", <TrialModal />);
        }}
      >
        {tried ? "이어서 체험하기" : "샘플 체험하기"} <Icon name="arrow" />
      </button>
    );
  return (
    <a className="primary" href={app.url} target="_blank" rel="noopener noreferrer">
      {app.ctaLabel} ↗
    </a>
  );
}
