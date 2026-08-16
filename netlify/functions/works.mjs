const TRPC_PUBLIC_WORKS_PATH = "/api/trpc/works.publicList?input=%7B%22json%22%3Anull%7D";

const json = (body, init = {}) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=60, s-maxage=60",
      ...(init.headers ?? {}),
    },
  });

export default async function handler() {
  const apiBaseUrl = process.env.SANAD_API_BASE_URL?.replace(/\/+$/, "");

  if (!apiBaseUrl) {
    return json(
      { works: [], configured: false, message: "واجهة بيانات سند لم تُربط بعد." },
      { status: 503 },
    );
  }

  try {
    const response = await fetch(`${apiBaseUrl}${TRPC_PUBLIC_WORKS_PATH}`, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      return json({ works: [], configured: true, message: "تعذر تحميل الأعمال حالياً." }, { status: 502 });
    }

    const payload = await response.json();
    const works = payload?.result?.data?.json;

    if (!Array.isArray(works)) {
      return json({ works: [], configured: true, message: "صيغة بيانات الأعمال غير متوقعة." }, { status: 502 });
    }

    const normalisedWorks = works.map((work) => ({
      id: work.id,
      title: work.title,
      category: work.category,
      description: work.description,
      publishedAt: work.publishedAt,
      coverImageUrl:
        typeof work.coverImageUrl === "string" && work.coverImageUrl.startsWith("/")
          ? `${apiBaseUrl}${work.coverImageUrl}`
          : work.coverImageUrl ?? null,
    }));

    return json({ works: normalisedWorks, configured: true });
  } catch {
    return json({ works: [], configured: true, message: "تعذر الاتصال بواجهة بيانات سند." }, { status: 502 });
  }
}

export const config = { path: "/api/works" };

