"use client";

import { useEffect, useRef } from "react";
import { useStore } from "@/lib/store";
import { Icon } from "./icon";

/** Single app-wide <dialog>; content comes from the store's openModal(). */
export function ModalHost() {
  const { modal, closeModal } = useStore();
  const ref = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<Element | null>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (modal && !d.open) {
      returnFocus.current = document.activeElement;
      d.showModal();
      d.querySelector<HTMLElement>("input,textarea,button:not([aria-label='닫기'])")?.focus();
    } else if (!modal && d.open) {
      d.close();
      const el = returnFocus.current;
      if (el instanceof HTMLElement && el.isConnected) el.focus();
    }
  }, [modal]);

  return (
    <dialog
      ref={ref}
      className="dialog"
      aria-labelledby="modal-title"
      onCancel={(e) => {
        e.preventDefault();
        closeModal();
      }}
      onClick={(e) => {
        // Clicking the backdrop (the dialog element itself) closes it.
        if (e.target === e.currentTarget) closeModal();
      }}
    >
      {modal && (
        <>
          <div className="dialog-head">
            <h2 id="modal-title">{modal.title}</h2>
            <button
              type="button"
              className="icon-button"
              aria-label="닫기"
              onClick={closeModal}
            >
              <Icon name="close" />
            </button>
          </div>
          {modal.body}
        </>
      )}
    </dialog>
  );
}

export function Toast() {
  const { toastMessage } = useStore();
  return (
    <div className="toast" role="status" hidden={!toastMessage}>
      {toastMessage}
    </div>
  );
}
