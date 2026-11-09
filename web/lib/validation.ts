import type { RegistrationDraft } from "./store";

/** True for an https URL with a dotted hostname, e.g. https://my-app.com */
export function isValidHttpsUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.includes(".");
  } catch {
    return false;
  }
}

export const MAX_DEMO_VIDEO_BYTES = 30 * 1024 * 1024;
export const MAX_DEMO_VIDEO_SECONDS = 15.5;
export const DEMO_VIDEO_TYPES = ["video/mp4", "video/webm"];

export function isAcceptedVideoFile(file: { type: string; size: number }) {
  return DEMO_VIDEO_TYPES.includes(file.type) && file.size <= MAX_DEMO_VIDEO_BYTES;
}

export type FieldId = "app-url" | "trial-url" | "terms" | "video" | "category" | "intro";
export type Errors = Partial<Record<FieldId, string>>;

export function validateDraft(d: RegistrationDraft): Errors {
  const e: Errors = {};
  if (!isValidHttpsUrl(d.url)) e["app-url"] = "https://로 시작하는 올바른 앱 주소를 입력해주세요.";
  if (!isValidHttpsUrl(d.trial)) e["trial-url"] = "https://로 시작하는 체험 주소를 입력해주세요.";
  if (!d.terms.trim()) e.terms = "체험 범위와 가입·결제 조건을 입력해주세요.";
  if (!d.video) e.video = "영상을 선택하거나 스크린샷 데모를 준비해주세요.";
  if (!d.cats.length) e.category = "앱 카테고리를 하나 이상 선택해주세요.";
  if (!d.intro.trim()) e.intro = "앱을 설명하는 한 줄 소개를 입력해주세요.";
  return e;
}

