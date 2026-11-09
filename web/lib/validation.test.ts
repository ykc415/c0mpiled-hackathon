import { describe, expect, it } from "vitest";
import { isAcceptedVideoFile, isValidHttpsUrl, validateDraft } from "./validation";

describe("isValidHttpsUrl", () => {
  it("accepts https URLs with a dotted host", () => {
    expect(isValidHttpsUrl("https://my-app.com")).toBe(true);
    expect(isValidHttpsUrl("https://my-app.com/try?x=1")).toBe(true);
  });

  it("rejects other input", () => {
    expect(isValidHttpsUrl("http://my-app.com")).toBe(false);
    expect(isValidHttpsUrl("https://localhost")).toBe(false);
    expect(isValidHttpsUrl("my-app.com")).toBe(false);
    expect(isValidHttpsUrl("")).toBe(false);
  });
});

describe("isAcceptedVideoFile", () => {
  it("accepts small mp4 and webm files", () => {
    expect(isAcceptedVideoFile({ type: "video/mp4", size: 1024 })).toBe(true);
    expect(isAcceptedVideoFile({ type: "video/webm", size: 1024 })).toBe(true);
  });

  it("rejects other types and large files", () => {
    expect(isAcceptedVideoFile({ type: "video/quicktime", size: 1024 })).toBe(false);
    expect(isAcceptedVideoFile({ type: "video/mp4", size: 31 * 1024 * 1024 })).toBe(false);
  });
});

describe("validateDraft", () => {
  const valid = {
    url: "https://my-app.com",
    trial: "https://my-app.com/try",
    terms: "체험 3회 무료",
    intro: "사진 한 장으로 칼로리 계산",
    story: "",
    cats: ["건강" as const],
    video: "demo.mp4",
    ai: false,
  };

  it("passes a complete draft", () => {
    expect(validateDraft(valid)).toEqual({});
  });

  it("flags every missing required field", () => {
    const errors = validateDraft({
      ...valid,
      url: "",
      trial: "http://x.com",
      terms: " ",
      intro: "",
      cats: [],
      video: "",
    });
    expect(Object.keys(errors).sort()).toEqual(
      ["app-url", "category", "intro", "terms", "trial-url", "video"].sort(),
    );
  });

  it("does not require the maker story", () => {
    expect(validateDraft({ ...valid, story: "" })).toEqual({});
  });
});
