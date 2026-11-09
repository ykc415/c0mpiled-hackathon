# c0mpiled-hackathon

## 구조

- `web/` — Next.js (App Router, TypeScript, Tailwind CSS)
- 새 영역은 최상위 폴더로 추가한다 (예: `server/`, `db/`, `vm/`). 폴더 이름이 커밋 범위가 된다.

## 명령어 (web)

```bash
cd web
npm run dev     # 개발 서버
npm run build   # 프로덕션 빌드
npm test        # 테스트 (Vitest)
npm run lint    # 린트
```

`web/AGENTS.md`의 Next.js 안내도 함께 따른다.

## 커밋 규칙

- 기능 하나를 끝낼 때마다 바로 커밋한다. 여러 기능을 한 커밋에 섞지 않는다.
- 형식: `타입(범위): 한국어 설명`
  - 타입: `feat`, `fix`, `docs`, `chore`, `ci`, `infra`, `refactor`
  - 범위: `web`, `server`, `db`, `vm` 같은 폴더 이름
  - 예: `feat(web): 홈 피드 세로 스와이프 추가`
- 커밋 전에 빌드와 테스트를 돌리고, 통과했을 때만 커밋한다.
- 커밋한 다음 바로 `main`에 push한다.
- `.env` 같은 비밀값은 절대 커밋하지 않는다.
