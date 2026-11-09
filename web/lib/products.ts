export type AppImage = { src: string; width: number; height: number };

export type Product = {
  id: string;
  name: string;
  description: string;
  categories: Category[];
  url: string;
  owner: string;
  images: AppImage[];
  icon?: AppImage;
  label: string;
  /** How the user gets the app, shown in the detail panel. */
  access: string;
  /** Label for the external CTA button. Ignored when the app has a sample trial. */
  ctaLabel: string;
  /** Apps with an in-app sample experience instead of an external link. */
  hasSample?: boolean;
  /** Sample trial count for the trending ranking (demo data, not real usage). */
  trend: number;
};

export const CATEGORIES = [
  "추천",
  "AI",
  "SaaS",
  "모바일 앱",
  "개발 도구",
  "생산성",
  "디자인",
  "마케팅",
  "금융",
  "건강",
  "교육",
  "게임",
  "메타버스",
  "Web3",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_SYMBOLS: Record<Exclude<Category, "추천">, string> = {
  AI: "🤖",
  SaaS: "☁️",
  "모바일 앱": "📱",
  "개발 도구": "🛠️",
  생산성: "⚡",
  디자인: "🎨",
  마케팅: "📣",
  금융: "💰",
  건강: "🏥",
  교육: "📚",
  게임: "🎮",
  메타버스: "🪐",
  Web3: "🌐",
};

// Official promotional assets, loaded from their original public URLs
// (see the OpenDesign project's credits.json). Not copied into this repo.
const mz = (path: string) => `https://is1-ssl.mzstatic.com/image/thumb/${path}`;

export const PRODUCTS: Product[] = [
  {
    id: "pickle",
    trend: 58,
    name: "Pickle",
    description: "전화·주문·예약을 대신 해주는 나만의 AI 에이전트",
    categories: ["AI", "모바일 앱", "생산성"],
    url: "https://apps.apple.com/kr/app/id6795790129",
    owner: "Pickle, Inc.",
    images: [
      { src: mz("PurpleSource221/v4/56/59/a6/5659a6f5-0e6c-8cb0-9b89-122323af4e90/1.png/320x480bb.jpg"), width: 221, height: 480 },
      { src: mz("PurpleSource211/v4/4c/03/21/4c0321b0-3a82-966d-9aaf-605e2f1116e0/2.png/320x480bb.jpg"), width: 221, height: 480 },
      { src: mz("PurpleSource211/v4/b2/08/87/b20887c1-1af9-ef4b-4521-6a1ed3a0def1/3.png/320x480bb.jpg"), width: 221, height: 480 },
    ],
    icon: { src: mz("Purple211/v4/2c/82/72/2c827240-6a5f-bfdb-169b-858949c74db6/AppIcon-0-0-1x_U007ephone-0-1-0-sRGB-85-220.png/512x512bb.jpg"), width: 512, height: 512 },
    label: "공식 스크린샷",
    access: "모바일 앱 설치",
    ctaLabel: "앱 스토어에서 보기",
  },
  {
    id: "aside",
    trend: 41,
    name: "Aside",
    description: "웹사이트와 계정을 넘나들며 일을 대신 처리하는 AI 브라우저",
    categories: ["AI", "생산성"],
    url: "https://aside.com/",
    owner: "Aside Computer Inc.",
    images: [{ src: "https://aside.com/opengraph-image.png", width: 1200, height: 630 }],
    icon: { src: "https://aside.com/icon.png", width: 512, height: 512 },
    label: "공식 소개 이미지",
    access: "데스크톱 앱 설치",
    ctaLabel: "공식 사이트 보기",
  },
  {
    id: "cal",
    trend: 128,
    name: "Cal AI",
    description: "음식 사진으로 간편하게 식단 기록",
    categories: ["AI", "모바일 앱", "건강"],
    url: "https://apps.apple.com/us/app/cal-ai-calorie-tracker/id6480417616",
    owner: "Viral Development LLC",
    images: [
      { src: mz("PurpleSource211/v4/66/dd/5c/66dd5cab-7622-7caf-84c1-5fc5c16f5b39/28f8bc10-b990-4c88-be57-5003ba5d6483_SS1Small__U00281_U0029.png/392x696bb.png"), width: 392, height: 696 },
      { src: mz("PurpleSource221/v4/33/52/fd/3352fd96-00a2-d63b-9362-f1fdaa21fe31/e93b538a-fce8-4568-94db-b2b5f69644e2_SS2Small__U00282_U0029.png/392x696bb.png"), width: 392, height: 696 },
      { src: mz("PurpleSource211/v4/9f/b6/cd/9fb6cdca-5494-1a6e-f352-f7ed45756b38/06c53f71-a783-49ef-aeb8-2716c4a2e083_SS3Small__U00281_U0029.png/392x696bb.png"), width: 392, height: 696 },
    ],
    icon: { src: mz("Purple221/v4/69/a5/15/69a51522-48cb-023c-0fdb-962fd1588fad/AppIcon-0-0-1x_U007ephone-0-1-85-220.png/512x512bb.jpg"), width: 512, height: 512 },
    label: "공식 스크린샷",
    access: "모바일 앱 설치",
    ctaLabel: "앱 스토어에서 보기",
    hasSample: true,
  },
  {
    id: "sledding",
    trend: 96,
    name: "Sledding Game",
    description: "친구들과 눈밭을 누비는 멀티플레이 썰매 게임",
    categories: ["게임"],
    url: "https://store.steampowered.com/app/3438850/Sledding_Game/",
    owner: "The Sledding Corporation",
    images: [
      { src: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3438850/d125d21c8c8e4ba7b50be7eb5c59cc7cb525d36a/ss_d125d21c8c8e4ba7b50be7eb5c59cc7cb525d36a.600x338.jpg", width: 600, height: 337 },
      { src: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3438850/3f78962cec25d65727608bb01341cdf4b2eb6197/ss_3f78962cec25d65727608bb01341cdf4b2eb6197.600x338.jpg", width: 600, height: 337 },
      { src: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3438850/1898b56bf9a3d596e4cdb50b36ce711243fee3b6/ss_1898b56bf9a3d596e4cdb50b36ce711243fee3b6.600x338.jpg", width: 600, height: 337 },
    ],
    label: "공식 스크린샷",
    access: "Steam에서 설치",
    ctaLabel: "Steam에서 보기",
  },
  {
    id: "upscrolled",
    trend: 61,
    name: "UpScrolled",
    description: "사진·영상·이야기를 나누는 소셜 피드",
    categories: ["모바일 앱"],
    url: "https://apps.apple.com/us/app/upscrolled/id6746533451",
    owner: "UpScrolled B.V.",
    images: [
      { src: mz("PurpleSource221/v4/1d/82/1f/1d821f49-d671-56e0-1af3-1280de8fd718/01.png/320x480bb.jpg"), width: 221, height: 480 },
      { src: mz("PurpleSource221/v4/6c/74/ad/6c74adcd-0905-d27b-0d99-46dbb4a06fe9/02.png/320x480bb.jpg"), width: 221, height: 480 },
      { src: mz("PurpleSource211/v4/8b/8d/4a/8b8d4a77-c5be-800a-08ac-ed3189627a22/03.png/320x480bb.jpg"), width: 221, height: 480 },
    ],
    icon: { src: mz("Purple211/v4/3f/71/f1/3f71f122-8d64-8e37-f87e-4d3a79018a42/AppIconProd-0-0-1x_U007epad-0-1-85-220.png/512x512bb.jpg"), width: 512, height: 512 },
    label: "공식 스크린샷",
    access: "모바일 앱 설치",
    ctaLabel: "앱 스토어에서 보기",
  },
  {
    id: "photo",
    trend: 52,
    name: "Photo AI",
    description: "내 사진으로 만드는 AI 프로필과 인물 사진",
    categories: ["AI", "SaaS", "디자인"],
    url: "https://photoai.com/",
    owner: "Photo AI · Pieter Levels",
    images: [
      { src: "https://r2-us-west.photoai.com/public/1764406222-d9a069a0dd49e73fc90c1e80b97ca8d1-1.png", width: 896, height: 1200 },
    ],
    icon: { src: "https://photoai.com/assets/apple-touch-icon.png", width: 180, height: 180 },
    label: "공식 생성 예시 · 앱 화면 아님",
    access: "웹사이트",
    ctaLabel: "공식 사이트 보기",
  },
  {
    id: "tapotron",
    trend: 74,
    name: "Tapotron",
    description: "손끝으로 즐기는 피젯·미니게임·비트",
    categories: ["모바일 앱", "게임"],
    url: "https://apps.apple.com/us/app/tapotron-tap-games-beats/id6738282470",
    owner: "Great Scott AB",
    images: [
      { src: mz("PurpleSource211/v4/13/73/3b/13733b0d-3da2-7e81-4e59-3f561ab6a901/01.jpg/320x480bb.jpg"), width: 221, height: 480 },
      { src: mz("PurpleSource221/v4/d5/e1/a6/d5e1a6f3-32a1-6524-f3f9-053c7627507a/02.jpg/320x480bb.jpg"), width: 221, height: 480 },
      { src: mz("PurpleSource211/v4/10/37/c5/1037c586-a52c-1168-ea64-4e0236f6db5b/03.jpg/320x480bb.jpg"), width: 221, height: 480 },
    ],
    icon: { src: mz("Purple211/v4/51/62/15/51621557-f38c-01d1-cf71-1f9492802a03/AppIcon-0-0-1x_U007epad-0-1-0-85-220.jpeg/512x512bb.jpg"), width: 512, height: 512 },
    label: "공식 스크린샷",
    access: "모바일 앱 설치",
    ctaLabel: "앱 스토어에서 보기",
  },
  {
    id: "onlyflights",
    trend: 37,
    name: "OnlyFlights",
    description: "항공편 상태와 여행 일정을 한눈에",
    categories: ["모바일 앱", "생산성"],
    url: "https://apps.apple.com/us/app/onlyflights-live-flight-status/id6742445816",
    owner: "Aliaksandr Huryn",
    images: [
      { src: mz("PurpleSource221/v4/b3/5e/30/b35e30bc-6ce4-7706-1688-feb5b82adda1/116.png/320x480bb.jpg"), width: 222, height: 480 },
      { src: mz("PurpleSource221/v4/9e/b8/9b/9eb89bc7-e83c-9493-ff9a-b93842244e96/117.png/320x480bb.jpg"), width: 222, height: 480 },
      { src: mz("PurpleSource211/v4/5c/aa/ac/5caaac61-8d3e-ed3b-9286-2a67455c2e94/118.png/320x480bb.jpg"), width: 222, height: 480 },
    ],
    icon: { src: mz("Purple221/v4/3a/0d/f0/3a0df0aa-5e17-4cc4-68ba-f7c816ead083/AppIcon-0-0-1x_U007epad-0-1-0-0-85-220.png/512x512bb.jpg"), width: 512, height: 512 },
    label: "공식 스크린샷",
    access: "모바일 앱 설치",
    ctaLabel: "앱 스토어에서 보기",
  },
  {
    id: "rad",
    trend: 29,
    name: "RAD Weather",
    description: "레트로 화면으로 만나는 일기예보",
    categories: ["모바일 앱"],
    url: "https://apps.apple.com/us/app/rad-weather-honest-forecast/id6758575355",
    owner: "Samuel Rozzi",
    images: [
      { src: mz("PurpleSource211/v4/ee/b6/b8/eeb6b87b-01db-737e-10f0-02ef0a362244/image1.png/320x480bb.jpg"), width: 221, height: 480 },
      { src: mz("PurpleSource211/v4/fb/25/ba/fb25baac-8b8f-d6cb-da6b-abf9e0f94355/image2.png/320x480bb.jpg"), width: 221, height: 480 },
      { src: mz("PurpleSource221/v4/10/75/32/10753227-9790-ff03-b673-13c452d69c76/image3.png/320x480bb.jpg"), width: 221, height: 480 },
    ],
    icon: { src: mz("Purple211/v4/2d/b2/4b/2db24b59-ff7f-2734-30c0-6bfbd41777ad/AppIcon-0-0-1x_U007epad-0-1-0-85-220.png/512x512bb.jpg"), width: 512, height: 512 },
    label: "공식 스크린샷",
    access: "모바일 앱 설치",
    ctaLabel: "앱 스토어에서 보기",
  },
  {
    id: "sansa",
    trend: 45,
    name: "산사",
    description: "말없이 함께 앉아 쉬어가는 3D 온라인 절",
    categories: ["메타버스"],
    url: "https://sansatemple.com/",
    owner: "sansatemple.com",
    images: [
      { src: "https://sansatemple.com/og/sansa-rest-20261101-v11.png", width: 1200, height: 630 },
    ],
    icon: { src: "https://sansatemple.com/icon-512.png", width: 512, height: 512 },
    label: "공식 소개 이미지",
    access: "웹사이트",
    ctaLabel: "공식 사이트 보기",
  },
];

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

/**
 * Apps shown for a category and search query, in feed order.
 * `t` adds the translated text so a query in either language matches.
 */
export function filterProducts(
  products: Product[],
  category: Category,
  query: string,
  t: (ko: string) => string = (s) => s,
): Product[] {
  const q = query.toLowerCase().trim();
  return products.filter(
    (p) =>
      (category === "추천" || p.categories.includes(category)) &&
      (!q ||
        [p.name, p.description, ...p.categories]
          .flatMap((s) => [s, t(s)])
          .join(" ")
          .toLowerCase()
          .includes(q)),
  );
}
