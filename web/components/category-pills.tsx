"use client";

import { CATEGORIES, CATEGORY_SYMBOLS } from "@/lib/products";
import { useStore } from "@/lib/store";

export function CategoryPills() {
  const { category, setCategory, t } = useStore();
  return (
    <section className="category-section" aria-label={t("앱 카테고리")}>
      <div className="category-cloud">
        {CATEGORIES.slice(1).map((c) => {
          const pressed = category === c;
          return (
            <button
              key={c}
              type="button"
              className="category-pill"
              aria-pressed={pressed}
              // Pressing the active category again clears the filter.
              onClick={() => setCategory(pressed ? "추천" : c)}
            >
              <span aria-hidden="true">{CATEGORY_SYMBOLS[c as Exclude<typeof c, "추천">]}</span>
              <span>{t(c)}</span>
              {pressed && (
                <span className="category-check" aria-hidden="true">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
