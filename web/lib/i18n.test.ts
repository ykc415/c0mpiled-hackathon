import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { translate } from "./i18n";
import { CATEGORIES, PRODUCTS } from "./products";
import { validateDraft } from "./validation";

const hasHangul = (s: string) => /[가-힣]/.test(s);

describe("translate", () => {
  it("keeps Korean and fills in variables", () => {
    expect(translate("ko", "{n}장 선택됨", { n: 3 })).toBe("3장 선택됨");
    expect(translate("en", "{n}장 선택됨", { n: 3 })).toBe("3 selected");
  });

  it("falls back to the source text for user input", () => {
    expect(translate("en", "내가 쓴 소개")).toBe("내가 쓴 소개");
  });

  it("has English for every UI string, category and product text", () => {
    const dir = join(__dirname, "../components");
    const keys = readdirSync(dir).flatMap((f) =>
      [...readFileSync(join(dir, f), "utf8").matchAll(/\bt\("([^"]+)"/g)].map((m) => m[1]),
    );
    const errors = Object.values(
      validateDraft({ url: "", trial: "", terms: "", intro: "", story: "", cats: [], video: "", ai: false }),
    );
    const data = PRODUCTS.flatMap((p) => [p.description, p.label, p.access, p.ctaLabel]);
    const missing = [...keys, ...errors, ...data, ...CATEGORIES]
      .filter(hasHangul)
      .filter((k) => hasHangul(translate("en", k)));
    expect(missing).toEqual([]);
  });
});
