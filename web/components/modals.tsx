"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { getProduct } from "@/lib/products";
import { useStore } from "@/lib/store";
import { AppImage } from "./app-media";
import { Icon } from "./icon";

const SAMPLE_APP_ID = "cal";

function AddToLibraryButton({ className = "outline" }: { className?: string }) {
  const { appState, setSaved, closeModal, toast } = useStore();
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
      {saved ? "내 앱으로 이동" : "내 앱에 추가"}
    </button>
  );
}

export function TrialModal() {
  const { records, openModal } = useStore();
  return (
    <>
      <span className="pill">비공식 시연 · 실제 AI 분석 아님</span>
      <div className="trial-total">
        <small>이 체험에서 남긴 식단</small>
        <strong>{records.length}개</strong>
      </div>
      {records.length ? (
        <div className="record-list">
          {records.map((r) => (
            <div className="record" key={r.time}>
              <div>
                <strong>닭가슴살 샐러드</strong>
                <small>{new Date(r.time).toLocaleString("ko-KR")} · 샘플</small>
              </div>
              <span>486 kcal</span>
            </div>
          ))}
        </div>
      ) : (
        <p>샘플 음식으로 분석부터 저장까지 경험해보세요.</p>
      )}
      <button
        type="button"
        className="primary"
        onClick={() => openModal("샘플 분석 결과", <AnalyzeModal />)}
      >
        샘플 음식으로 기록하기 <Icon name="plus" />
      </button>
      <AddToLibraryButton />
      <p className="hint">실제 Cal AI 계정에 저장되지 않습니다.</p>
    </>
  );
}

function AnalyzeModal() {
  const { addRecord, openModal } = useStore();
  return (
    <>
      <span className="pill">예시 수치 · 실제 분석 아님</span>
      <p>닭가슴살 샐러드</p>
      <strong className="calories">
        486 <span>kcal</span>
      </strong>
      <div className="macro-grid">
        <div>
          <strong>32g</strong>
          <small>탄수화물</small>
        </div>
        <div>
          <strong>36g</strong>
          <small>단백질</small>
        </div>
        <div>
          <strong>24g</strong>
          <small>지방</small>
        </div>
      </div>
      <button
        type="button"
        className="primary"
        onClick={() => {
          const count = addRecord();
          openModal("한 끼를 기록했어요", <RecordedModal count={count} />);
        }}
      >
        내 식단에 기록하기
      </button>
    </>
  );
}

function RecordedModal({ count }: { count: number }) {
  const { openModal } = useStore();
  return (
    <>
      <p>
        샘플 기록 {count}개가 저장되어 있어요. 다음에 다시 열어도 이어서 볼 수 있습니다.
      </p>
      <AddToLibraryButton className="primary" />
      <button
        type="button"
        className="outline"
        onClick={() => openModal("Cal AI 샘플 체험", <TrialModal />)}
      >
        기록 보러 가기
      </button>
    </>
  );
}

export function CommentsModal({ appId }: { appId: string }) {
  const { appState, addComment } = useStore();
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
        <p>첫 번째 한마디를 남겨보세요.</p>
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
          <label htmlFor="comment-text">내 한마디</label>
          <textarea
            id="comment-text"
            maxLength={200}
            placeholder="써보니 어떤 점이 좋았나요?"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <button type="submit" className="primary">
          댓글 남기기
        </button>
      </form>
    </>
  );
}

export function ShareModal({ appId }: { appId: string }) {
  const { toast } = useStore();
  const [fallback, setFallback] = useState(false);
  const app = getProduct(appId)!;
  const text = `${app.name} — ${app.description} ${app.url}`;
  return (
    <>
      <p>{app.description}</p>
      {fallback ? (
        <textarea
          readOnly
          aria-label="공유 문구"
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
          소개 문구 복사
        </button>
      )}
    </>
  );
}

export function PreviewModal({ appId, index }: { appId: string; index: number }) {
  const app = getProduct(appId)!;
  return <AppImage app={app} index={index} className="screenshot-large" />;
}
