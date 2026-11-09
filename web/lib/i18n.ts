export type Lang = "en" | "ko";

export type Vars = Record<string, string | number>;

/** English text keyed by the Korean source string. Missing keys fall back to Korean. */
const EN: Record<string, string> = {
  // Shell
  피드: "Feed",
  탐색: "Explore",
  "내 앱": "My Apps",
  마이: "Profile",
  발견: "Discover",
  "앱 상세": "App details",
  "{name} / 앱 상세": "{name} / App details",
  "메이커 / 앱 등록": "Makers / Submit an app",
  "Appetizer 홈": "Appetizer home",
  "앱 소개 ↗": "Submit app ↗",
  "주요 메뉴": "Main menu",
  "하단 메뉴": "Bottom menu",
  "새로운 앱과의 첫 만남.": "Your first taste of new apps.",
  "써보고, 마음에 들면 내 앱으로.": "Try it, then keep the ones you love.",
  "내 앱 소개하기": "Submit your app",
  "작은 팀의 큰 아이디어를 만나요.": "Big ideas from small teams.",
  "© Appetizer · 인터랙티브 데모": "© Appetizer · Interactive demo",
  "앱 검색": "Search apps",
  "어떤 앱을 찾고 있나요?": "What are you looking for?",
  "내 프로필": "My profile",
  나: "Me",
  "언어 바꾸기": "Change language",
  트렌딩: "Trending",

  // Trending
  "{n}위": "Rank {n}",
  "체험 {n}회": "{n} tries",
  자세히: "Detail",
  "체험 수는 시연용 샘플이에요. 내 좋아요·저장·댓글이 바로 반영돼요.":
    "Try counts are sample data for this demo. Your likes, saves and comments count right away.",

  // Categories
  "앱 카테고리": "App categories",
  추천: "For you",
  "모바일 앱": "Mobile",
  "개발 도구": "Dev tools",
  생산성: "Productivity",
  디자인: "Design",
  마케팅: "Marketing",
  금융: "Finance",
  건강: "Health",
  교육: "Education",
  게임: "Games",
  메타버스: "Metaverse",

  // Feed
  "검색 결과가 없어요": "No results",
  "이 카테고리의 앱은 준비 중이에요": "No apps in this category yet",
  "다른 앱 이름이나 카테고리로 찾아보세요.": "Try another app name or category.",
  "선택한 카테고리를 다시 누르면 필터가 해제됩니다.":
    "Tap the selected category again to clear the filter.",
  "앱 피드": "App feed",
  "{name} 상세 보기": "View {name} details",
  "이전 이미지": "Previous image",
  "다음 이미지": "Next image",
  좋아요: "Like",
  "좋아요 취소": "Unlike",
  "내 앱에 추가했어요": "Added to My Apps",
  "내 앱에서 제거했어요": "Removed from My Apps",
  추가됨: "Saved",
  "함께 나누는 한마디": "Comments",
  댓글: "Comment",
  "{name} 공유하기": "Share {name}",
  공유: "Share",
  "이전 앱": "Previous app",
  "다음 앱": "Next app",

  // Pages
  "새로운 앱을 만나는 곳": "Discover new apps",
  "설치 전, 가볍게 경험하기": "Try before you install",
  "샘플 체험": "Sample trial",
  "공식 생성 예시": "Official sample output",
  "공식 스크린샷": "Official screenshots",
  "“{query}” 검색 결과": "Results for “{query}”",
  "모든 앱": "All apps",
  "{n}개": "{n}",
  "자세히 보기 ↗": "Learn more ↗",
  "필터 초기화": "Reset filters",
  "저장한 앱을 다시 열어보세요.": "Reopen the apps you saved.",
  "앱 정보": "App info",
  "내 앱에서 제거했어요. 샘플 기록은 유지돼요.":
    "Removed from My Apps. Your sample records are kept.",
  "저장 해제": "Unsave",
  "아직 저장한 앱이 없어요": "No saved apps yet",
  "앱 둘러보기": "Browse apps",
  "내 앱과 Cal AI 샘플 기록은 이 브라우저에 보관됩니다.":
    "My Apps and your Cal AI sample records are stored in this browser.",
  "이 창을 열어둔 동안 내 앱과 기록이 유지됩니다.":
    "My Apps and records are kept while this window stays open.",
  "반가워요, 새로운 발견자님.": "Welcome, explorer.",
  "내가 좋아하는 앱과, 내가 만든 앱을 한곳에서.":
    "The apps you love and the apps you made, in one place.",
  "나의 공간": "My space",
  "마음에 드는 앱을 모아두고, 직접 만든 앱도 소개해보세요.":
    "Collect the apps you like, and show off the ones you built.",
  "내 앱 열기": "Open My Apps",
  "메이커로 앱 소개하기": "Submit an app as a maker",
  "계정 없이 사용하는 로컬 프로토타입입니다.": "A local prototype. No account needed.",
  "공식 서비스": "Official service",
  "무료 샘플 · 실제 Cal AI와 연동되지 않아요": "Free sample · not connected to the real Cal AI",
  "공식 서비스에서 설치·가입 및 이용 조건을 확인하세요":
    "Check install, sign-up and terms on the official service",
  "시작하기 전에": "Before you start",
  "이용 방법": "How to get it",
  "가격·이용 조건": "Pricing & terms",
  "공식 페이지에서 확인": "See official page",
  "공식 페이지 보기 ↗": "Official page ↗",
  돌아가기: "Back",
  "{name} 이미지 {n} 확대": "Enlarge {name} image {n}",
  "{name} 미리보기": "{name} preview",
  "내 앱에서 제거": "Remove from My Apps",
  "내 앱에 추가": "Add to My Apps",

  // Modals
  닫기: "Close",
  "내 앱으로 이동": "Go to My Apps",
  "비공식 시연 · 실제 AI 분석 아님": "Unofficial demo · not a real AI analysis",
  "이 체험에서 남긴 식단": "Meals logged in this trial",
  "닭가슴살 샐러드": "Chicken breast salad",
  샘플: "Sample",
  "샘플 음식으로 분석부터 저장까지 경험해보세요.":
    "Try the whole flow, from analysis to saving, with a sample meal.",
  "샘플 분석 결과": "Sample analysis",
  "샘플 음식으로 기록하기": "Log a sample meal",
  "실제 Cal AI 계정에 저장되지 않습니다.": "Nothing is saved to a real Cal AI account.",
  "예시 수치 · 실제 분석 아님": "Example numbers · not a real analysis",
  탄수화물: "Carbs",
  단백질: "Protein",
  지방: "Fat",
  "한 끼를 기록했어요": "Meal logged",
  "내 식단에 기록하기": "Log to my meals",
  "샘플 기록 {n}개가 저장되어 있어요. 다음에 다시 열어도 이어서 볼 수 있습니다.":
    "You have {n} sample records saved. They'll still be here next time.",
  "Cal AI 샘플 체험": "Cal AI sample trial",
  "기록 보러 가기": "View records",
  "첫 번째 한마디를 남겨보세요.": "Be the first to leave a comment.",
  "내 한마디": "Your comment",
  "써보니 어떤 점이 좋았나요?": "What did you like about it?",
  "댓글 남기기": "Post comment",
  "공유 문구": "Share text",
  "소개 문구를 복사했어요": "Copied the share text",
  "소개 문구 복사": "Copy share text",
  "{name} 아이콘": "{name} icon",
  "이어서 체험하기": "Continue trial",
  "샘플 체험하기": "Try the sample",

  // Register
  "이미지를 선택해 생성 흐름을 체험합니다. 실제 AI 영상 파일은 만들지 않습니다.":
    "Pick images to try the generation flow. No real AI video is created.",
  "스크린샷 선택": "Choose screenshots",
  "{n}장 선택됨": "{n} selected",
  "이미지를 선택해주세요.": "Please choose images.",
  "시연용 데모 준비하기": "Prepare demo",
  "등록 내용을 이 창에 보관했어요. 실제 연결이나 공개 출시는 진행되지 않습니다.":
    "Your submission is kept in this window. Nothing is actually connected or published.",
  "체험 링크": "Trial link",
  "이용 조건": "Terms",
  완료: "Done",
  "30MB 이하 MP4 또는 WebM을 선택해주세요.": "Choose an MP4 or WebM under 30MB.",
  "영상 길이를 확인하고 있어요…": "Checking video length…",
  "15초 이내 영상을 선택해주세요.": "Choose a video of 15 seconds or less.",
  "영상을 읽지 못했어요. 다른 파일을 선택해주세요.":
    "Couldn't read the video. Please choose another file.",
  "런칭 준비 완료": "Ready to launch",
  "피드로 돌아가기": "Back to feed",
  "직접 써보면, 더 잘 전해지니까.": "Trying it says more than any pitch.",
  "당신의 앱을 발견하고, 경험하고, 다시 찾게 해주세요.":
    "Help people discover your app, try it, and come back to it.",
  "앱 링크 *": "App link *",
  "설치 없이 체험할 링크 *": "No-install trial link *",
  "체험·이용 조건 *": "Trial & terms *",
  "예: 체험 3회 무료 · 가입 없이 사용": "e.g. 3 free tries · no sign-up",
  "15초 데모 영상 *": "15-second demo video *",
  "MP4·WebM · 15초 이내 · 최대 30MB": "MP4·WebM · up to 15s · max 30MB",
  "스크린샷 데모 만들기": "Make a screenshot demo",
  "스크린샷 데모 · 시연용": "Screenshot demo · for demo only",
  "시연용 데모를 연결했어요": "Demo attached",
  "스크린샷으로 AI 데모 영상 만들기 ✨": "Make an AI demo video from screenshots ✨",
  "어떤 분야의 앱인가요? *": "What kind of app is it? *",
  "한 줄 소개 *": "One-line pitch *",
  "어떤 문제를 해결하나요?": "What problem does it solve?",
  "메이커 스토리": "Maker story",
  선택: "Optional",
  "어떤 마음으로 만들기 시작했나요?": "Why did you start building it?",
  "런칭하기 🚀": "Launch 🚀",
  "등록 내용만 이 창에 보관하며 실제 공개 출시는 하지 않습니다.":
    "Your submission stays in this window. Nothing is actually published.",
  "등록 가이드": "Submission guide",
  "좋은 첫 경험을": "Prepare a great",
  "준비해주세요.": "first experience.",
  "바로 열리는 체험": "A trial that opens instantly",
  "핵심 기능을 써볼 수 있는 링크를 준비해요.":
    "Share a link where people can try the core features.",
  "짧고 선명한 소개": "A short, clear intro",
  "어떤 문제를 해결하는지 영상이나 이미지로 보여줘요.":
    "Show the problem it solves with a video or images.",
  "분명한 이용 조건": "Clear terms",
  "무료 범위와 가입·결제 조건을 미리 알려주세요.":
    "Say up front what's free and what needs sign-up or payment.",
  "현재 등록은 시연용이며 실제 공개 출시나 외부 업로드는 진행하지 않습니다.":
    "Submissions are for demo only. Nothing is published or uploaded.",
  "https://로 시작하는 올바른 앱 주소를 입력해주세요.":
    "Enter a valid app URL starting with https://.",
  "https://로 시작하는 체험 주소를 입력해주세요.": "Enter a trial URL starting with https://.",
  "체험 범위와 가입·결제 조건을 입력해주세요.":
    "Describe what the trial covers and any sign-up or payment terms.",
  "영상을 선택하거나 스크린샷 데모를 준비해주세요.":
    "Choose a video or prepare a screenshot demo.",
  "앱 카테고리를 하나 이상 선택해주세요.": "Choose at least one category.",
  "앱을 설명하는 한 줄 소개를 입력해주세요.": "Enter a one-line pitch for your app.",

  // Product data
  "음식 사진으로 간편하게 식단 기록": "Log meals from a photo of your food",
  "친구들과 눈밭을 누비는 멀티플레이 썰매 게임":
    "A multiplayer sledding game for racing through snow with friends",
  "사진·영상·이야기를 나누는 소셜 피드": "A social feed for photos, videos and stories",
  "내 사진으로 만드는 AI 프로필과 인물 사진": "AI profile pictures and portraits from your photos",
  "손끝으로 즐기는 피젯·미니게임·비트": "Fidgets, mini-games and beats at your fingertips",
  "항공편 상태와 여행 일정을 한눈에": "Flight status and trip plans at a glance",
  "레트로 화면으로 만나는 일기예보": "Weather forecasts on a retro screen",
  "전화·주문·예약을 대신 해주는 나만의 AI 에이전트":
    "Your own AI agent that makes calls, orders and bookings for you",
  "웹사이트와 계정을 넘나들며 일을 대신 처리하는 AI 브라우저":
    "An AI browser that gets real work done across your websites and accounts",
  "데스크톱 앱 설치": "Install the desktop app",
  "말없이 함께 앉아 쉬어가는 3D 온라인 절": "A 3D online temple where you sit and rest together in silence",
  "공식 생성 예시 · 앱 화면 아님": "Official sample output · not the app UI",
  "공식 소개 이미지": "Official promo image",
  "모바일 앱 설치": "Install the mobile app",
  "Steam에서 설치": "Install on Steam",
  웹사이트: "Website",
  "앱 스토어에서 보기": "View on the App Store",
  "Steam에서 보기": "View on Steam",
  "공식 사이트 보기": "Visit official site",
};

export function translate(lang: Lang, ko: string, vars?: Vars): string {
  let s = lang === "en" ? (EN[ko] ?? ko) : ko;
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
  return s;
}
