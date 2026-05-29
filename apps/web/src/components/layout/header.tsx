export function AppHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-neutral-200 bg-neutral-50/95 px-4 pt-[env(safe-area-inset-top)] backdrop-blur supports-backdrop-filter:bg-neutral-50/80">
      {/* 로고 이미지 자리 */}
      <span className="head-5 text-green-500">쓰담</span>
      {/* 위치 정보 자리 */}
      <span className="body-4 text-neutral-500">서울 마포구</span>
    </header>
  );
}
