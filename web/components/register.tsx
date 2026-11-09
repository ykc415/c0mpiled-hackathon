"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { CATEGORIES, type Category } from "@/lib/products";
import { useStore, type RegistrationDraft } from "@/lib/store";
import {
  DEMO_VIDEO_TYPES,
  isAcceptedVideoFile,
  MAX_DEMO_VIDEO_SECONDS,
  validateDraft,
  type Errors,
  type FieldId,
} from "@/lib/validation";
import { Icon } from "./icon";

function FieldError({ id, errors }: { id: FieldId; errors: Errors }) {
  const { t } = useStore();
  return (
    <span className="error" id={`${id}-error`} hidden={!errors[id]}>
      {errors[id] && t(errors[id])}
    </span>
  );
}

function AiDemoModal({ onReady }: { onReady: () => void }) {
  const { t } = useStore();
  const [count, setCount] = useState(0);
  return (
    <>
      <p>{t("이미지를 선택해 생성 흐름을 체험합니다. 실제 AI 영상 파일은 만들지 않습니다.")}</p>
      <div className="field">
        <label htmlFor="ai-files">{t("스크린샷 선택")}</label>
        <input
          id="ai-files"
          type="file"
          accept="image/*"
          multiple
          onChange={(e) =>
            setCount([...(e.target.files ?? [])].filter((f) => f.type.startsWith("image/")).length)
          }
        />
        <small>{count ? t("{n}장 선택됨", { n: count }) : t("이미지를 선택해주세요.")}</small>
      </div>
      <button type="button" className="primary" disabled={!count} onClick={onReady}>
        {t("시연용 데모 준비하기")}
      </button>
    </>
  );
}

function LaunchDoneModal({ draft }: { draft: RegistrationDraft }) {
  const { closeModal, t } = useStore();
  return (
    <>
      <p>{t("등록 내용을 이 창에 보관했어요. 실제 연결이나 공개 출시는 진행되지 않습니다.")}</p>
      <div className="result-summary">
        <h3>{draft.intro}</h3>
        <p>{draft.url}</p>
        <small>{t("체험 링크")}</small>
        <p>{draft.trial}</p>
        <small>{t("이용 조건")}</small>
        <p>{draft.terms}</p>
        <small>{draft.cats.map((c) => t(c)).join(" · ")}</small>
      </div>
      <button type="button" className="primary" style={{ marginTop: 20 }} onClick={closeModal}>
        {t("완료")}
      </button>
    </>
  );
}

export function RegisterPage() {
  const { draft, updateDraft, openModal, closeModal, toast, t } = useStore();
  const [errors, setErrors] = useState<Errors>({});
  const [videoStatus, setVideoStatus] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const setError = (id: FieldId, msg?: string) =>
    setErrors((e) => ({ ...e, [id]: msg }));

  const toggleCategory = (c: Category) =>
    updateDraft({
      cats: draft.cats.includes(c) ? draft.cats.filter((x) => x !== c) : [...draft.cats, c],
    });

  const onVideo = (file: File | undefined) => {
    updateDraft({ video: "" });
    if (!file) return;
    if (!isAcceptedVideoFile(file)) {
      setError("video", t("30MB 이하 MP4 또는 WebM을 선택해주세요."));
      return;
    }
    const video = document.createElement("video");
    const url = URL.createObjectURL(file);
    setVideoStatus(t("영상 길이를 확인하고 있어요…"));
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      setVideoStatus(null);
      if (!Number.isFinite(video.duration) || video.duration > MAX_DEMO_VIDEO_SECONDS) {
        setError("video", t("15초 이내 영상을 선택해주세요."));
        return;
      }
      updateDraft({ video: file.name, ai: false });
      setError("video");
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      setVideoStatus(null);
      setError("video", t("영상을 읽지 못했어요. 다른 파일을 선택해주세요."));
    };
    video.src = url;
  };

  const launch = () => {
    const next = validateDraft(draft);
    setErrors(next);
    if (Object.keys(next).length) {
      // Wait for the error messages to render, then bring the first into view.
      requestAnimationFrame(() =>
        formRef.current
          ?.querySelector(".error:not([hidden])")
          ?.scrollIntoView({ block: "center" }),
      );
      return;
    }
    openModal(t("런칭 준비 완료"), <LaunchDoneModal draft={draft} />);
  };

  const invalid = (id: FieldId) => (errors[id] ? true : undefined);

  return (
    <>
      <div className="product-breadcrumb">
        <Link className="text-button" href="/">
          <Icon name="back" /> {t("피드로 돌아가기")}
        </Link>
        <span>{t("메이커 / 앱 등록")}</span>
      </div>
      <div className="page-heading">
        <div>
          <div className="eyebrow">{t("새로운 앱을 만나는 곳")}</div>
          <h1>{t("직접 써보면, 더 잘 전해지니까.")}</h1>
          <p>{t("당신의 앱을 발견하고, 경험하고, 다시 찾게 해주세요.")}</p>
        </div>
      </div>
      <div className="registration-layout">
        <section className="registration-form">
          <form
            ref={formRef}
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              launch();
            }}
          >
            <div className="field">
              <label htmlFor="app-url">{t("앱 링크 *")}</label>
              <input
                id="app-url"
                type="url"
                placeholder="https://my-app.com"
                value={draft.url}
                aria-invalid={invalid("app-url")}
                onChange={(e) => updateDraft({ url: e.target.value })}
              />
              <FieldError id="app-url" errors={errors} />
            </div>
            <div className="field">
              <label htmlFor="trial-url">{t("설치 없이 체험할 링크 *")}</label>
              <input
                id="trial-url"
                type="url"
                placeholder="https://my-app.com/try"
                value={draft.trial}
                aria-invalid={invalid("trial-url")}
                onChange={(e) => updateDraft({ trial: e.target.value })}
              />
              <FieldError id="trial-url" errors={errors} />
            </div>
            <div className="field">
              <label htmlFor="terms">{t("체험·이용 조건 *")}</label>
              <textarea
                id="terms"
                maxLength={160}
                placeholder={t("예: 체험 3회 무료 · 가입 없이 사용")}
                value={draft.terms}
                aria-invalid={invalid("terms")}
                onChange={(e) => updateDraft({ terms: e.target.value })}
              />
              <FieldError id="terms" errors={errors} />
            </div>
            <div className="field">
              <label htmlFor="demo-video">{t("15초 데모 영상 *")}</label>
              <div className="upload">
                <input
                  id="demo-video"
                  type="file"
                  accept={DEMO_VIDEO_TYPES.join(",")}
                  aria-invalid={invalid("video")}
                  onChange={(e) => onVideo(e.target.files?.[0])}
                />
                <small>
                  {videoStatus ?? (t(draft.video) || t("MP4·WebM · 15초 이내 · 최대 30MB"))}
                </small>
              </div>
              <button
                type="button"
                className="outline"
                onClick={() =>
                  openModal(
                    t("스크린샷 데모 만들기"),
                    <AiDemoModal
                      onReady={() => {
                        updateDraft({ video: "스크린샷 데모 · 시연용", ai: true });
                        setError("video");
                        closeModal();
                        toast("시연용 데모를 연결했어요");
                      }}
                    />,
                  )
                }
              >
                {t("스크린샷으로 AI 데모 영상 만들기 ✨")}
              </button>
              <FieldError id="video" errors={errors} />
            </div>
            <fieldset>
              <legend>{t("어떤 분야의 앱인가요? *")}</legend>
              <div className="multi">
                {CATEGORIES.slice(1).map((c) => (
                  <button
                    key={c}
                    type="button"
                    className="chip"
                    aria-pressed={draft.cats.includes(c)}
                    onClick={() => toggleCategory(c)}
                  >
                    {t(c)}
                  </button>
                ))}
              </div>
              <FieldError id="category" errors={errors} />
            </fieldset>
            <div className="field">
              <label htmlFor="intro">{t("한 줄 소개 *")}</label>
              <input
                id="intro"
                maxLength={40}
                placeholder={t("어떤 문제를 해결하나요?")}
                value={draft.intro}
                aria-invalid={invalid("intro")}
                onChange={(e) => updateDraft({ intro: e.target.value })}
              />
              <FieldError id="intro" errors={errors} />
            </div>
            <div className="field">
              <label htmlFor="story">
                {t("메이커 스토리")} <small>{t("선택")}</small>
              </label>
              <textarea
                id="story"
                maxLength={300}
                placeholder={t("어떤 마음으로 만들기 시작했나요?")}
                value={draft.story}
                onChange={(e) => updateDraft({ story: e.target.value })}
              />
            </div>
            <button type="submit" className="primary">
              {t("런칭하기 🚀")}
            </button>
            <p className="hint">{t("등록 내용만 이 창에 보관하며 실제 공개 출시는 하지 않습니다.")}</p>
          </form>
        </section>
        <aside className="registration-guide">
          <span className="eyebrow">{t("등록 가이드")}</span>
          <h2>
            {t("좋은 첫 경험을")}
            <br />
            {t("준비해주세요.")}
          </h2>
          <ol>
            <li>
              <strong>{t("바로 열리는 체험")}</strong>
              <p>{t("핵심 기능을 써볼 수 있는 링크를 준비해요.")}</p>
            </li>
            <li>
              <strong>{t("짧고 선명한 소개")}</strong>
              <p>{t("어떤 문제를 해결하는지 영상이나 이미지로 보여줘요.")}</p>
            </li>
            <li>
              <strong>{t("분명한 이용 조건")}</strong>
              <p>{t("무료 범위와 가입·결제 조건을 미리 알려주세요.")}</p>
            </li>
          </ol>
          <small>{t("현재 등록은 시연용이며 실제 공개 출시나 외부 업로드는 진행하지 않습니다.")}</small>
        </aside>
      </div>
    </>
  );
}
