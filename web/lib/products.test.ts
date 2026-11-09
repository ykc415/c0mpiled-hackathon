import { describe, expect, it } from "vitest";
import { filterProducts, getProduct, PRODUCTS } from "./products";

describe("filterProducts", () => {
  it("returns every app for 추천 with no query", () => {
    expect(filterProducts(PRODUCTS, "추천", "")).toHaveLength(PRODUCTS.length);
  });

  it("filters by category", () => {
    const ids = filterProducts(PRODUCTS, "게임", "").map((p) => p.id);
    expect(ids).toEqual(["sledding", "tapotron"]);
  });

  it("matches the query against name, description and categories", () => {
    expect(filterProducts(PRODUCTS, "추천", "cal ai").map((p) => p.id)).toEqual(["cal"]);
    expect(filterProducts(PRODUCTS, "추천", "항공편").map((p) => p.id)).toEqual(["onlyflights"]);
    expect(filterProducts(PRODUCTS, "추천", "디자인").map((p) => p.id)).toEqual(["photo"]);
  });

  it("combines category and query", () => {
    expect(filterProducts(PRODUCTS, "게임", "cal")).toEqual([]);
  });
});

describe("getProduct", () => {
  it("finds apps by id", () => {
    expect(getProduct("rad")?.name).toBe("RAD Weather");
    expect(getProduct("nope")).toBeUndefined();
  });

  it("gives every app at least one image", () => {
    for (const p of PRODUCTS) expect(p.images.length).toBeGreaterThan(0);
  });
});
