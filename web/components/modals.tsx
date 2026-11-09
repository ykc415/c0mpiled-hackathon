"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { getProduct } from "@/lib/products";
import { useStore } from "@/lib/store";
import { AppImage } from "./app-media";
import { Icon } from "./icon";

const SAMPLE_APP_ID = "cal";

function AddToLibraryButton({ className = "outline" }: { className?: string }) {
  const { appState, setSaved, closeModal, toast, t } = useStore();
  const router = useRouter();
  const saved = appState(SAMPLE_APP_ID).saved;
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        if (saved) {
          closeModal();
          router.push("/library");
        } else {
          setSaved(SAMPLE_APP_ID, true);
          toast("내 앱에 추가했어요");
        }
      }}
    >
      {saved ? t("내 앱으로 이동") : t("내 앱에 추가")}
    </button>
  );
}

export function TrialModal() {
  const { records, openModal, lang, t } = useStore();
  return (
    <>
      <span className="pill">{t("비공식 시연 · 실제 AI 분석 아님")}</span>
      <div className="trial-total">
        <small>{t("이 체험에서 남긴 식단")}</small>
        <strong>{t("{n}개", { n: records.length })}</strong>
      </div>
      {records.length ? (
        <div className="record-list">
          {records.map((r) => (
            <div className="record" key={r.time}>
              <div>
                <strong>{t("닭가슴살 샐러드")}</strong>
                <small>
                  {new Date(r.time).toLocaleString(lang === "ko" ? "ko-KR" : "en-US")} · {t("샘플")}
                </small>
              </div>
              <span>486 kcal</span>
            </div>
          ))}
        </div>
      ) : (
        <p>{t("샘플 음식으로 분석부터 저장까지 경험해보세요.")}</p>
      )}
      <button
        type="button"
        className="primary"
        onClick={() => openModal(t("샘플 분석 결과"), <AnalyzeModal />)}
      >
        {t("샘플 음식으로 기록하기")} <Icon name="plus" />
      </button>
      <AddToLibraryButton />
      <p className="hint">{t("실제 Cal AI 계정에 저장되지 않습니다.")}</p>
    </>
  );
}

function AnalyzeModal() {
  const { addRecord, openModal, t } = useStore();
  return (
    <>
      <span className="pill">{t("예시 수치 · 실제 분석 아님")}</span>
      <p>{t("닭가슴살 샐러드")}</p>
      <strong className="calories">
        486 <span>kcal</span>
      </strong>
      <div className="macro-grid">
        <div>
          <strong>32g</strong>
          <small>{t("탄수화물")}</small>
        </div>
        <div>
          <strong>36g</strong>
          <small>{t("단백질")}</small>
        </div>
        <div>
          <strong>24g</strong>
          <small>{t("지방")}</small>
        </div>
      </div>
      <button
        type="button"
        className="primary"
        onClick={() => {
          const count = addRecord();
          openModal(t("한 끼를 기록했어요"), <RecordedModal count={count} />);
        }}
      >
        {t("내 식단에 기록하기")}
      </button>
    </>
  );
}

function RecordedModal({ count }: { count: number }) {
  const { openModal, t } = useStore();
  return (
    <>
      <p>
        {t("샘플 기록 {n}개가 저장되어 있어요. 다음에 다시 열어도 이어서 볼 수 있습니다.", {
          n: count,
        })}
      </p>
      <AddToLibraryButton className="primary" />
      <button
        type="button"
        className="outline"
        onClick={() => openModal(t("Cal AI 샘플 체험"), <TrialModal />)}
      >
        {t("기록 보러 가기")}
      </button>
    </>
  );
}

export function CommentsModal({ appId }: { appId: string }) {
  const { appState, addComment, t } = useStore();
  const [text, setText] = useState("");
  const comments = appState(appId).comments;
  return (
    <>
      {comments.length ? (
        comments.map((c, i) => (
          <div className="record" key={i}>
            <p>{c}</p>
          </div>
        ))
      ) : (
        <p>{t("첫 번째 한마디를 남겨보세요.")}</p>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const v = text.trim();
          if (!v) return;
          addComment(appId, v);
          setText("");
        }}
      >
        <div className="field">
          <label htmlFor="comment-text">{t("내 한마디")}</label>
          <textarea
            id="comment-text"
            maxLength={200}
            placeholder={t("써보니 어떤 점이 좋았나요?")}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <button type="submit" className="primary">
          {t("댓글 남기기")}
        </button>
      </form>
    </>
  );
}

export function ShareModal({ appId }: { appId: string }) {
  const { toast, t } = useStore();
  const [fallback, setFallback] = useState(false);
  const app = getProduct(appId)!;
  const text = `${app.name} — ${t(app.description)} ${app.url}`;
  return (
    <>
      <p>{t(app.description)}</p>
      {fallback ? (
        <textarea
          readOnly
          aria-label={t("공유 문구")}
          value={text}
          ref={(el) => el?.select()}
        />
      ) : (
        <button
          type="button"
          className="primary"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(text);
              toast("소개 문구를 복사했어요");
            } catch {
              setFallback(true);
            }
          }}
        >
          {t("소개 문구 복사")}
        </button>
      )}
    </>
  );
}

export function PreviewModal({ appId, index }: { appId: string; index: number }) {
  const app = getProduct(appId)!;
  return <AppImage app={app} index={index} className="screenshot-large" />;
}
