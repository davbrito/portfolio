interface Props {
  error: unknown;
}

const formatError = (err: unknown) => {
  if (!err) return "";
  if (typeof err === "string") return err;
  if (err instanceof Error) return `${err.message}\n\n${err.stack ?? ""}`;
  try {
    return JSON.stringify(err, undefined, 2);
  } catch {
    return String(err);
  }
};

export function ErrorPage(props: Props) {
  const { error } = props;

  return (
    <div
      className="flex min-h-screen items-center justify-center p-12 text-[#e6eef8]"
      role="main"
      style={{
        background: `
    radial-gradient(1200px 600px at 10% 10%, rgba(124,58,237,0.12), transparent),
    radial-gradient(900px 400px at 90% 90%, rgba(99,102,241,0.06), transparent), #0f1724`,
      }}
    >
      <div className="grid w-full max-w-225 grid-cols-1 items-center gap-7 rounded-[14px] bg-linear-to-b from-[rgba(255,255,255,0.02)] to-transparent p-9 shadow-[0_6px_30px_rgba(2,6,23,0.6)] md:grid-cols-[1fr_360px]">
        <div className="min-w-0 text-left">
          <div className="mb-2 text-[72px] font-extrabold tracking-[-2px] text-[#7c3aed]" aria-hidden="true">
            500
          </div>
          <h1 id="error-heading" className="m-0 mb-3 text-[22px]">
            Something went wrong
          </h1>
          <p className="mb-4 leading-relaxed text-[#9aa4b2]">
            Sorry — an unexpected error occurred on the server. Try refreshing the page, or return home. If the problem
            persists, please contact support.
          </p>

          <div className="flex flex-wrap gap-3" role="group" aria-label="Actions">
            <button
              className="inline-flex transform items-center rounded-[10px] bg-linear-to-r from-[#7c3aed] to-[#4f46e5] px-4 py-2 font-semibold text-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              onclick="location.reload()"
              aria-label="Retry"
            >
              Retry
            </button>
            <a
              className="inline-flex items-center rounded-[10px] border border-[rgba(255,255,255,0.04)] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.03))] px-4 py-2 font-semibold text-white"
              href="/"
              aria-label="Go to homepage"
            >
              Go to home
            </a>
            <a
              className="inline-flex items-center rounded-[10px] border border-[rgba(255,255,255,0.04)] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.03))] px-4 py-2 font-semibold text-white"
              href="mailto:hello@example.com"
              aria-label="Contact support"
            >
              Contact support
            </a>
          </div>

          <p className="mt-4 text-sm text-[#9aa4b2]">Error code: 500 — Internal Server Error</p>
        </div>

        <div
          className="flex flex-col items-center justify-center gap-4 rounded-[10px] border border-[rgba(255,255,255,0.02)] bg-[rgba(255,255,255,0.02)] p-3"
          aria-hidden="true"
        >
          <div className="relative flex h-30 w-40 items-center justify-center rounded-[10px] bg-linear-to-b from-[#0f1724] to-[#0b1220] shadow-inner">
            <div className="absolute top-4 right-3 left-3 h-2.5 rounded-[6px] bg-[linear-gradient(90deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))]"></div>
            <div className="absolute right-3 bottom-4 left-3 h-2.5 rounded-[6px] bg-[linear-gradient(90deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))]"></div>

            <div className="z-10 flex gap-2" role="presentation">
              <div className="animate-blink h-3 w-3 rounded-full bg-[#f97316] shadow-[0_0_10px_rgba(249,115,22,0.6)]"></div>
              <div
                className="animate-blink h-3 w-3 rounded-full bg-[#f97316] shadow-[0_0_10px_rgba(249,115,22,0.6)]"
                style="animation-delay:0.2s"
              ></div>
              <div
                className="animate-blink h-3 w-3 rounded-full bg-[#f97316] shadow-[0_0_10px_rgba(249,115,22,0.6)]"
                style="animation-delay:0.4s"
              ></div>
            </div>
          </div>
          <p className="m-0 text-[13px] text-[#9aa4b2]">We're looking into it — thanks for your patience.</p>
        </div>

        {error ? (
          <div className="mt-4 md:col-span-2">
            <h2 className="sr-only">Error details</h2>
            <pre className="max-h-60 overflow-auto rounded bg-[#071124] p-4 text-sm text-[#ffb4b4]">
              <code>{formatError(error)}</code>
            </pre>
          </div>
        ) : null}
      </div>
    </div>
  );
}
