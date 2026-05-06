export default function Home() {
  return (
    <main className="min-h-dvh px-6 py-8 sm:px-10">
      <section className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-5xl flex-col justify-center gap-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#16745b]">
            Sseudam
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-[#1d211c] sm:text-6xl">
            Next.js PWA client for the Sseudam monorepo.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-[#697064] sm:text-lg">
            Built with Next.js, TypeScript, React Compiler, and Tailwind CSS v4.
          </p>
        </div>
        <div className="grid gap-3 text-sm text-[#30362f] sm:grid-cols-3">
          <div className="rounded-lg border border-[#dfe5d7] bg-white p-4">
            <strong className="block text-[#1d211c]">Web</strong>
            Next.js 16 + React 19
          </div>
          <div className="rounded-lg border border-[#dfe5d7] bg-white p-4">
            <strong className="block text-[#1d211c]">Compiler</strong>
            React Compiler enabled
          </div>
          <div className="rounded-lg border border-[#dfe5d7] bg-white p-4">
            <strong className="block text-[#1d211c]">PWA</strong>
            Manifest + service worker
          </div>
        </div>
      </section>
    </main>
  );
}
