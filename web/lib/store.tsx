"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { PRODUCTS, type Category } from "./products";

type ProductState = { saved: boolean; liked: boolean; comments: string[] };
type SampleRecord = { time: string };

export type RegistrationDraft = {
  url: string;
  trial: string;
  terms: string;
  intro: string;
  story: string;
  cats: Category[];
  video: string;
  ai: boolean;
};

const EMPTY_DRAFT: RegistrationDraft = {
  url: "",
  trial: "",
  terms: "",
  intro: "",
  story: "",
  cats: [],
  video: "",
  ai: false,
};

const PRODUCTS_KEY = "indie-shorts-products-v1";
const LIBRARY_KEY = "indie-shorts-library-v1";

export type ModalState = { title: string; body: ReactNode } | null;

type Store = {
  /** False when localStorage is unavailable; data then lives for this tab only. */
  persistent: boolean;
  appState: (id: string) => ProductState;
  savedCount: number;
  toggleSaved: (id: string) => boolean;
  setSaved: (id: string, saved: boolean) => void;
  toggleLiked: (id: string) => boolean;
  addComment: (id: string, text: string) => void;

  tried: boolean;
  records: SampleRecord[];
  startTrial: () => void;
  addRecord: () => number;

  category: Category;
  setCategory: (c: Category) => void;
  query: string;
  setQuery: (q: string) => void;

  feedAppId: string;
  setFeedAppId: (id: string) => void;
  shot: number;
  setShot: (n: number) => void;

  draft: RegistrationDraft;
  updateDraft: (patch: Partial<RegistrationDraft>) => void;

  modal: ModalState;
  openModal: (title: string, body: ReactNode) => void;
  closeModal: () => void;
  toastMessage: string | null;
  toast: (message: string) => void;
};

const StoreContext = createContext<Store | null>(null);

function emptyProductState(): ProductState {
  return { saved: false, liked: false, comments: [] };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [persistent, setPersistent] = useState(true);
  const [products, setProducts] = useState<Record<string, ProductState>>({});
  const [tried, setTried] = useState(false);
  const [records, setRecords] = useState<SampleRecord[]>([]);
  const [lastOpened, setLastOpened] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  const [category, setCategory] = useState<Category>("추천");
  const [query, setQuery] = useState("");
  const [feedAppId, setFeedAppId] = useState(PRODUCTS[0].id);
  const [shot, setShot] = useState(1);
  const [draft, setDraft] = useState<RegistrationDraft>(EMPTY_DRAFT);

  const [modal, setModal] = useState<ModalState>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Read saved data after mount so server and client render the same markup.
  useEffect(() => {
    try {
      const old = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || "{}");
      const next: Record<string, ProductState> = {};
      for (const app of PRODUCTS) {
        const s = old?.[app.id];
        if (s)
          next[app.id] = {
            saved: s.saved === true,
            liked: s.liked === true,
            comments: Array.isArray(s.comments)
              ? s.comments.filter((x: unknown) => typeof x === "string")
              : [],
          };
      }
      const lib = JSON.parse(localStorage.getItem(LIBRARY_KEY) || "null");
      /* eslint-disable react-hooks/set-state-in-effect -- one-time hydration from localStorage */
      setProducts(next);
      if (lib && typeof lib === "object") {
        setTried(lib.tried === true);
        setRecords(
          Array.isArray(lib.records)
            ? lib.records
                .filter((r: SampleRecord) => r && typeof r.time === "string")
                .slice(0, 50)
            : [],
        );
        setLastOpened(typeof lib.lastOpened === "string" ? lib.lastOpened : null);
      }
    } catch {
      setPersistent(false);
    }
    setLoaded(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
      localStorage.setItem(
        LIBRARY_KEY,
        JSON.stringify({ tried, records, lastOpened }),
      );
    } catch {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- storage failure is only known here
      setPersistent(false);
    }
  }, [loaded, products, tried, records, lastOpened]);

  const appState = useCallback(
    (id: string) => products[id] ?? emptyProductState(),
    [products],
  );

  const patchApp = useCallback(
    (id: string, fn: (s: ProductState) => ProductState) =>
      setProducts((prev) => ({ ...prev, [id]: fn(prev[id] ?? emptyProductState()) })),
    [],
  );

  const toggleSaved = useCallback(
    (id: string) => {
      const next = !(products[id]?.saved ?? false);
      patchApp(id, (s) => ({ ...s, saved: next }));
      return next;
    },
    [products, patchApp],
  );

  const setSaved = useCallback(
    (id: string, saved: boolean) => patchApp(id, (s) => ({ ...s, saved })),
    [patchApp],
  );

  const toggleLiked = useCallback(
    (id: string) => {
      const next = !(products[id]?.liked ?? false);
      patchApp(id, (s) => ({ ...s, liked: next }));
      return next;
    },
    [products, patchApp],
  );

  const addComment = useCallback(
    (id: string, text: string) =>
      patchApp(id, (s) => ({ ...s, comments: [...s.comments, text] })),
    [patchApp],
  );

  const startTrial = useCallback(() => {
    setTried(true);
    setLastOpened(new Date().toISOString());
  }, []);

  const addRecord = useCallback(() => {
    const next = [{ time: new Date().toISOString() }, ...records].slice(0, 50);
    setRecords(next);
    return next.length;
  }, [records]);

  const updateDraft = useCallback(
    (patch: Partial<RegistrationDraft>) => setDraft((d) => ({ ...d, ...patch })),
    [],
  );

  const openModal = useCallback(
    (title: string, body: ReactNode) => setModal({ title, body }),
    [],
  );
  const closeModal = useCallback(() => setModal(null), []);

  const toast = useCallback((message: string) => {
    setToastMessage(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMessage(null), 3200);
  }, []);

  const savedCount = useMemo(
    () => PRODUCTS.filter((p) => products[p.id]?.saved).length,
    [products],
  );

  const value: Store = {
    persistent,
    appState,
    savedCount,
    toggleSaved,
    setSaved,
    toggleLiked,
    addComment,
    tried,
    records,
    startTrial,
    addRecord,
    category,
    setCategory,
    query,
    setQuery,
    feedAppId,
    setFeedAppId,
    shot,
    setShot,
    draft,
    updateDraft,
    modal,
    openModal,
    closeModal,
    toastMessage,
    toast,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const store = useContext(StoreContext);
  if (!store) throw new Error("useStore must be used inside <StoreProvider>");
  return store;
}
