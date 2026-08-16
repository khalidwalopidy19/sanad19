(() => {
  const root = document.getElementById("sanad-public-works");
  if (!root) return;

  const escapeHtml = (value) =>
    String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const formatDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? ""
      : new Intl.DateTimeFormat("ar-SA", { year: "numeric", month: "long", day: "numeric" }).format(date);
  };

  const renderWorks = (works) => {
    if (!works.length) {
      root.innerHTML = '<p class="sanad-works-empty">تُضاف نماذج أعمال جديدة قريباً.</p>';
      return;
    }

    root.innerHTML = works
      .map((work) => {
        const image = work.coverImageUrl
          ? `<img class="sanad-work-image" src="${escapeHtml(work.coverImageUrl)}" alt="${escapeHtml(work.title)}" loading="lazy">`
          : '<div class="sanad-work-image sanad-work-placeholder" aria-hidden="true">⌁</div>';

        return `<article class="sanad-work-card">
          ${image}
          <div class="sanad-work-content">
            <span class="sanad-work-category">${escapeHtml(work.category)}</span>
            <h3>${escapeHtml(work.title)}</h3>
            <p>${escapeHtml(work.description)}</p>
            ${formatDate(work.publishedAt) ? `<time>${formatDate(work.publishedAt)}</time>` : ""}
          </div>
        </article>`;
      })
      .join("");
  };

  fetch("/api/works", { headers: { Accept: "application/json" } })
    .then((response) => (response.ok ? response.json() : { works: [] }))
    .then((payload) => renderWorks(Array.isArray(payload.works) ? payload.works : []))
    .catch(() => renderWorks([]));
})();

