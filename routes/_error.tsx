import { Head } from "fresh/runtime";
import { HttpError, type PageProps } from "fresh";

export default function ErrorPage(props: PageProps) {
  const error = props.error;
  const status = error instanceof HttpError ? error.status : 500;
  const message = error instanceof Error
    ? error.message
    : typeof error === "string"
    ? error
    : "Đã xảy ra lỗi không xác định.";

  console.error("[error page]", error);

  if (status === 404) {
    return (
      <div class="min-h-[60vh] flex items-center justify-center px-4 py-16">
        <Head>
          <title>Không tìm thấy - GreenGear</title>
        </Head>
        <div class="max-w-lg text-center">
          <h1 class="text-3xl font-extrabold text-brand-950">
            404 — Không tìm thấy trang
          </h1>
          <a
            href="/"
            class="inline-block mt-8 rounded-full px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold"
          >
            Về trang chủ
          </a>
        </div>
      </div>
    );
  }

  return (
    <div class="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <Head>
        <title>Lỗi máy chủ - GreenGear</title>
      </Head>
      <div class="max-w-lg text-center">
        <p class="text-brand-600 font-semibold text-sm uppercase tracking-wide">
          Lỗi máy chủ
        </p>
        <h1 class="mt-2 text-3xl font-extrabold text-brand-950">
          Không tải được trang
        </h1>
        <p class="mt-4 text-gray-600 break-words">{message}</p>
        <p class="mt-3 text-sm text-gray-500">
          Kiểm tra Deno KV đã được assign cho app trên Deno Deploy, rồi mở{" "}
          <a href="/api/health" class="text-brand-700 underline">
            /api/health
          </a>.
        </p>
        <a
          href="/"
          class="inline-block mt-8 rounded-full px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold"
        >
          Về trang chủ
        </a>
      </div>
    </div>
  );
}
