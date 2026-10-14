/* ==========================================================
   NFC Shop Page — app logic
   Reads window.SHOP (config.js) and renders everything.
   ========================================================== */
(() => {
  "use strict";

  const S = window.SHOP;
  const I = window.ICONS;
  const root = document.documentElement;
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const tick = (ms = 8) => { if (navigator.userActivation?.hasBeenActive !== false) navigator.vibrate?.(ms); };
  const CHECK_SM = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7"/></svg>';

  const initials = (name) => name.split(/\s+/).filter((w) => /^[a-z0-9]/i.test(w)).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
  const staggerize = (el) => [...el.children].forEach((c, i) => c.style.setProperty("--i", i));

  /* Action presets — label/icon/colour can be overridden per action in config.js */
  const TYPES = {
    instagram:{ icon: "instagram", full: true,      label: "Follow us on Instagram", href: () => S.socials?.instagram,
                sub: () => {
                  const m = (S.socials?.instagram || "").match(/instagram\.com\/([^/?#]+)/i);
                  return !m ? "" : /^(reel|reels|p|tv|stories)$/i.test(m[1]) ? "" : `@${m[1]}`;
                } },
    rewards:  { icon: "heart",    color: "#ff2d55", label: "Start earning rewards", run: () => openRewards() },
    review:   { icon: "google",   color: "#8e8e93", label: "Leave a Google Review", run: () => openReview() },
    menu:     { icon: "menu",     color: "#ff9500", label: "View Menu",             run: () => openMenu() },
    wifi:     { icon: "wifi",     color: "#34c759", label: "Connect to Wi‑Fi",      run: () => openWifi() },
    feedback: { icon: "feedback", color: "#007aff", label: "Leave Anonymous Feedback", run: () => openFeedback() },
    game:     { icon: "game",     color: "#5856d6", label: "Play Zero‑Kaata",       run: () => openGame() },
    link:     { icon: "link",     color: "#00c7be", label: "Open link",             href: (a) => a.url }
  };
  const LINK_COLORS = { map: "#ff3b30", phone: "#34c759", whatsapp: "#25d366", calendar: "#ff9500", bag: "#af52de", link: "#00c7be" };

  /* ==========================================================
     Render page
     ========================================================== */
  function render() {
    document.title = S.name;
    root.dataset.theme = S.theme?.mode || "auto";
    if (S.theme?.accent) {
      root.style.setProperty("--accent", S.theme.accent);
      root.style.setProperty("--accent-ink", isLight(S.theme.accent) ? "#000" : "#fff");
    }
    if (S.theme?.accent2) root.style.setProperty("--accent2", S.theme.accent2);

    const cover = $("#cover");
    if (S.cover) { cover.style.backgroundImage = `url("${S.cover}")`; $(".hero").classList.add("photo"); }
    else cover.classList.add("gradient");
    if (S.coverLogo) {                                  // brand lockup centred on the hero
      const img = Object.assign(new Image(), { className: "cover-logo", src: S.coverLogo, alt: S.name });
      cover.after(img);
    }

    $("#logo").innerHTML = S.logo ? `<img src="${esc(S.logo)}" alt="${esc(S.name)} logo">` : esc(initials(S.name));
    $("#shop-name").textContent = S.name;
    $("#shop-tagline").textContent = S.tagline || "";

    // "Created by" links to the sign-up form (it tells the form which shop page sent the visitor).
    // Falls back to a WhatsApp chat if no form link is set.
    const C = S.creator || {};
    const formLink = C.link ? `${C.link}${C.link.includes("?") ? "&" : "?"}ref=${encodeURIComponent(S.name)}` : "";
    const creatorLink = formLink || (C.phone ? `https://wa.me/${C.phone}?text=${encodeURIComponent((C.message || "").replace("{shop}", S.name))}` : "");
    const pill = $("#platform");
    if (C.name && C.showPill !== false) {
      pill.href = creatorLink || "#";
      pill.innerHTML = `<span class="pp-mark">${formLink ? I.tap : I.whatsapp}</span>
        <span><small>Created by</small><strong>${esc(C.name)}</strong><span class="pp-sub">${esc(C.tagline || "")}</span></span>
        <span class="pp-chat">${formLink ? "Get yours" : "Chat"}</span>`;
    } else pill.remove();

    let i = 0;
    $$(".identity-text > *").forEach((el) => { el.classList.add("reveal"); el.style.setProperty("--i", i++); });

    const list = $("#actions");
    list.innerHTML = "";
    (S.actions || []).forEach((a) => {
      const t = TYPES[a.type];
      if (!t || (t.href && !t.href(a))) return;
      const iconKey = a.icon || t.icon;
      const color = a.color || (a.type === "link" ? LINK_COLORS[iconKey] : null) || t.color;
      const href = t.href?.(a);
      const sub = a.sub || t.sub?.() || "";
      const inner = `<span class="ico${t.full ? " full" : ""}" style="--c:${esc(color)}">${I[iconKey] || I.link}</span>
        <span class="lbl">${esc(a.label || t.label)}${sub ? `<small>${esc(sub)}</small>` : ""}</span><span class="chev">${I.chevron}</span>`;
      const li = document.createElement("li");
      li.className = "reveal";
      li.style.setProperty("--i", i++);
      li.innerHTML = href
        ? `<a class="row" href="${esc(href)}" rel="noopener">${inner}</a>`
        : `<button class="row" type="button">${inner}</button>`;
      const row = li.firstElementChild;
      row.addEventListener("click", () => { tick(); t.run?.(a); });
      list.append(li);
    });

    const soc = $("#socials");
    const SOC = { instagram: "instagram", youtube: "youtube", facebook: "facebook", x: "x", whatsapp: "whatsappSocial" };
    soc.innerHTML = Object.entries(S.socials || {})
      .filter(([k, v]) => v && SOC[k])
      .map(([k, v]) => `<a href="${esc(v)}" rel="noopener" aria-label="${k}">${I[SOC[k]]}</a>`).join("");
    soc.classList.add("reveal");
    soc.style.setProperty("--i", i++);

    const pw = $("#powered");
    if (C.name) {
      pw.innerHTML = `<span class="made">Created by <b>${esc(C.name)}</b></span>
        ${creatorLink ? `<a class="wa-btn" href="${esc(creatorLink)}" rel="noopener">${formLink ? I.tap : I.whatsapp}<span>${esc(C.cta || "Get a page like this")}</span></a>` : ""}`;
      pw.classList.add("reveal");
      pw.style.setProperty("--i", i++);
    }
  }

  function isLight(hex) {
    const m = hex.replace("#", "").match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
    if (!m) return false;
    const [r, g, b] = m.slice(1).map((x) => parseInt(x, 16) / 255);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.62;
  }

  /* Parallax cover + hide creator pill on scroll.
     Transforms are written straight onto the two layers (no CSS variables), and only while the hero is visible. */
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let raf = 0, pillHidden = false;
  function onScroll() {
    raf = 0;
    const y = scrollY;
    if (!reduceMotion && y < 700) {
      const coverEl = $("#cover"), logoEl = $(".cover-logo");
      coverEl.style.transform = y >= 0
        ? `translate3d(0, ${(y * 0.35).toFixed(1)}px, 0)`
        : `translate3d(0, ${y.toFixed(1)}px, 0) scale(${(1 - y * 0.002).toFixed(4)})`;   // iOS pull-down stretch
      if (logoEl) {
        logoEl.style.transform = `translate3d(-50%, calc(-50% + ${(Math.max(0, y) * 0.18).toFixed(1)}px), 0)`;
        logoEl.style.opacity = Math.max(0, 1 - Math.max(0, y) / 240).toFixed(3);
      }
    }
    const hide = y > 30;
    if (hide !== pillHidden) { pillHidden = hide; $("#platform")?.classList.toggle("hide", hide); }
  }
  addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(onScroll); }, { passive: true });

  /* ==========================================================
     Modal system — sheets, pages and alerts share one stack.
     Each open modal pushes a history entry, so the phone's
     Back button / gesture closes it instead of leaving the page.
     ========================================================== */
  const modals = [];
  const scrim = $("#scrim");

  function chrome() {
    const sheet = !!$(".sheet.open"), page = !!$(".page.open"), alert = !!$(".alert.open");
    const app = $("#app");
    if (sheet) app.style.transformOrigin = `50% ${scrollY + innerHeight / 2}px`;
    document.body.classList.toggle("behind-sheet", sheet);
    document.body.classList.toggle("behind-page", page && !sheet);
    document.body.classList.toggle("locked", sheet || page || alert);
    scrim.classList.toggle("show", sheet || alert);
  }

  function present(el, { onClose } = {}) {
    const opener = document.activeElement;
    document.body.append(el);
    el.tabIndex = -1;
    el.getBoundingClientRect();                     // commit start position so the transition runs
    el.classList.add("open");
    chrome();
    el.focus({ preventScroll: true });

    let closed = false;
    const close = () => {
      if (closed) return;
      closed = true;
      el.classList.remove("open");
      chrome();
      onClose?.();
      opener?.focus?.({ preventScroll: true });
      setTimeout(() => el.remove(), 600);
    };
    modals.push(close);
    history.pushState({ modal: modals.length }, "");
    el.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) dismiss(); });
    return close;
  }

  function dismiss() { if (modals.length) history.back(); }
  // If the page was reloaded while a sheet's history entry was current, step back to the base entry
  if (history.state?.modal) history.go(-history.state.modal);
  // Restored from the back/forward cache: re-sync page chrome with whatever is open
  addEventListener("pageshow", (e) => { if (e.persisted) chrome(); });
  addEventListener("popstate", () => modals.pop()?.());
  scrim.addEventListener("click", dismiss);
  addEventListener("keydown", (e) => { if (e.key === "Escape") dismiss(); });

  /* Drag-to-dismiss (sheets: drag down by the grabber/header; pages: swipe from left edge) */
  function draggable(el, handles, axis) {
    handles.forEach((h) => h.addEventListener("pointerdown", (e) => {
      if (e.button || e.target.closest("button, a, input")) return;
      const start = axis === "y" ? e.clientY : e.clientX;
      let d = 0, lastP = start, lastT = performance.now(), v = 0;
      h.setPointerCapture(e.pointerId);
      el.classList.add("dragging");
      const move = (ev) => {
        const p = axis === "y" ? ev.clientY : ev.clientX;
        const now = performance.now();
        v = (p - lastP) / Math.max(1, now - lastT);
        lastP = p; lastT = now;
        d = p - start;
        if (d < 0) d = -Math.sqrt(-d) * 2;                 // rubber-band resistance
        el.style.setProperty("--drag", `${d}px`);
      };
      const up = () => {
        h.removeEventListener("pointermove", move);
        h.removeEventListener("pointerup", up);
        h.removeEventListener("pointercancel", up);
        el.classList.remove("dragging");
        const size = axis === "y" ? el.offsetHeight : el.offsetWidth;
        if (d > size * 0.28 || v > 0.55) dismiss();
        else el.style.setProperty("--drag", "0px");
      };
      h.addEventListener("pointermove", move);
      h.addEventListener("pointerup", up);
      h.addEventListener("pointercancel", up);
    }));
  }

  function sheet({ title, sub, html, auto = false, onClose }) {
    const el = document.createElement("section");
    el.className = `sheet${auto ? " auto" : ""}`;
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.setAttribute("aria-label", title || "Dialog");
    el.innerHTML = `<div class="grabber"></div>
      <div class="sheet-head"><div><h2>${esc(title)}</h2>${sub ? `<p class="sub">${esc(sub)}</p>` : ""}</div>
      <button class="link-btn" type="button" data-close>Done</button></div>${html}`;
    present(el, { onClose });
    draggable(el, [$(".grabber", el), $(".sheet-head", el)], "y");
    return el;
  }

  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.innerHTML = `${CHECK_SM}<span>${esc(msg)}</span>`;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
  }

  async function copy(text) {
    try { await navigator.clipboard.writeText(text); return true; }
    catch {
      const ta = Object.assign(document.createElement("textarea"), { value: text });
      ta.style.cssText = "position:fixed;opacity:0";
      document.body.append(ta); ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    }
  }

  /* ==========================================================
     Google review helper
     Google doesn't let other websites type into its review box,
     so we help the guest write one, copy it, then open Google.
     Every rating gets the same Google button (no review gating;
     Google's rules forbid sending only happy guests to Google).
     ========================================================== */
  function openReview() {
    const Rv = S.review || {};
    const link = S.links?.googleReview || "#";
    const LABELS = ["", "Not good", "Could be better", "It was okay", "Really good", "Loved it!"];
    const STAR = '<svg viewBox="0 0 24 24"><path d="M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9z"/></svg>';
    const dishes = Rv.dishes?.length ? Rv.dishes
      : (S.menu?.categories || []).flatMap((c) => c.sections.flatMap((s) => s.items.map((it) => it.name)));
    let stars = 0, lang = Rv.language === "hi" ? "hi" : "en";

    const el = sheet({
      title: `Rate ${S.name}`,
      sub: "Your review helps a local business grow",
      auto: true,
      html: `<div class="sheet-body"><div class="stagger">
          <div class="rv-stars" role="radiogroup" aria-label="Star rating">
            ${[1, 2, 3, 4, 5].map((n) => `<button type="button" role="radio" aria-checked="false" aria-label="${n} star${n > 1 ? "s" : ""}" data-n="${n}">${STAR}</button>`).join("")}
          </div>
          <p class="rv-label" id="rv-label">Tap a star to rate</p>
        </div>
        <div class="rv-more" id="rv-more" hidden>
          <div class="rv-bar">
            <span>Suggestions</span>
            <div class="seg rv-lang" role="tablist">
              <button type="button" role="tab" data-lang="en">English</button>
              <button type="button" role="tab" data-lang="hi">Hinglish</button>
              <span class="seg-thumb" style="width:calc((100% - 4px)/2)"></span>
            </div>
            <button class="icon-btn" type="button" id="rv-shuffle" aria-label="More suggestions">${I.restart}</button>
          </div>
          <div class="rv-sugg" id="rv-sugg"></div>
          <textarea class="field" id="rv-text" placeholder="Or write your own…" maxlength="1500" style="min-height:110px"></textarea>
          <a class="btn accent" id="rv-go" href="${esc(link)}" rel="noopener">${I.google}<span>Copy &amp; post on Google</span></a>
          <p class="footnote">We copy your review for you. On Google, tap the stars, then press and hold the text box and choose <b>Paste</b>.</p>
        </div></div>`
    });

    const more = $("#rv-more", el), label = $("#rv-label", el), text = $("#rv-text", el), list = $("#rv-sugg", el);
    staggerize($(".stagger", el));

    const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
    function suggest() {
      const tier = stars >= 5 ? 5 : stars === 4 ? 4 : stars === 3 ? 3 : 1;
      const pool = [...(window.REVIEWS?.[lang]?.[tier] || []), ...(Rv.extra?.[lang]?.[tier] || [])]
        .filter((t) => Rv.area || !t.includes("{area}"));
      const picks = shuffle(pool.slice()).slice(0, 3);
      const items = shuffle(dishes.slice());
      list.innerHTML = picks.map((t, k) => {
        const line = t.replaceAll("{shop}", S.name).replaceAll("{area}", Rv.area || "").replaceAll("{item}", items[k % Math.max(1, items.length)] || "food");
        return `<button type="button" class="sugg" style="--i:${k}">${esc(line)}</button>`;
      }).join("");
    }

    function setLang(l) {
      lang = l;
      $$(".rv-lang button", el).forEach((b, k) => {
        b.setAttribute("aria-selected", b.dataset.lang === l);
        if (b.dataset.lang === l) $(".rv-lang .seg-thumb", el).style.transform = `translateX(${k * 100}%)`;
      });
    }
    setLang(lang);

    $$(".rv-stars button", el).forEach((b) => b.addEventListener("click", () => {
      stars = +b.dataset.n;
      tick(10);
      $$(".rv-stars button", el).forEach((x, k) => {
        x.setAttribute("aria-checked", k + 1 === stars);
        x.classList.toggle("on", k < stars);
        x.style.setProperty("--d", `${k * 45}ms`);
        if (k < stars) { x.classList.remove("pop"); void x.offsetWidth; x.classList.add("pop"); }
      });
      label.textContent = LABELS[stars];
      const first = more.hidden;
      more.hidden = false;
      if (first) staggerize(more);
      suggest();
    }));

    $$(".rv-lang button", el).forEach((b) => b.addEventListener("click", () => { tick(); setLang(b.dataset.lang); suggest(); }));
    $("#rv-shuffle", el).addEventListener("click", () => { tick(); suggest(); });
    list.addEventListener("click", (e) => {
      const b = e.target.closest(".sugg");
      if (!b) return;
      tick();
      $$(".sugg", list).forEach((x) => x.classList.toggle("picked", x === b));
      text.value = b.textContent;
    });
    // Copy, then open Google in this tab — the phone's Back button brings the guest straight back here
    $("#rv-go", el).addEventListener("click", (e) => {
      const t = text.value.trim();
      if (!t) return;
      e.preventDefault();
      copy(t);
      toast("Review copied — paste it on Google");
      setTimeout(() => { location.href = link; }, 650);
    });
  }

  /* ==========================================================
     Wi-Fi  (web pages can't join networks directly, so we copy
     the password and tell the guest which network to pick)
     ========================================================== */
  function openWifi() {
    const W = S.wifi || {};
    const el = document.createElement("div");
    el.className = "alert";
    el.setAttribute("role", "alertdialog");
    el.innerHTML = `<div class="alert-body">
        <h3>Join “${esc(W.ssid)}”?</h3>
        <p>Copy the password, then choose <b>${esc(W.ssid)}</b> in your phone’s Wi‑Fi settings.</p>
        ${W.password ? `<div class="pw">${I.wifi}<span>${esc(W.password)}</span></div>` : ""}
      </div>
      <div class="alert-actions">
        <button type="button" data-close>Cancel</button>
        <button type="button" data-copy>${W.password ? "Copy Password" : "OK"}</button>
      </div>`;
    present(el);
    $("[data-copy]", el).addEventListener("click", async () => {
      if (W.password && await copy(W.password)) { tick(12); toast("Password copied"); }
      dismiss();
    });
  }

  /* ==========================================================
     Menu
     ========================================================== */
  function openMenu() {
    const M = S.menu || { categories: [] };
    const cats = M.categories || [];
    let cat = 0;

    const fmt = (p) => p == null || p === "" ? "" : typeof p === "number"
      ? `${esc(M.currency || "")}${p % 1 ? p.toFixed(2) : p}` : esc(p);
    const hl = (s, q) => {
      const e = esc(s);
      if (!q) return e;
      const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig");
      return e.replace(re, "<mark style=\"background:color-mix(in srgb,var(--accent) 25%,transparent);color:inherit;border-radius:3px\">$1</mark>");
    };
    const item = (it, q) => `<div class="item"><div class="i-main">
        <div class="i-name">${hl(it.name, q)}</div>
        ${it.desc ? `<div class="i-desc">${hl(it.desc, q)}</div>` : ""}
        ${it.tags?.length ? `<div class="i-tags">${it.tags.map(esc).join(" · ")}</div>` : ""}
        ${it.badge ? `<span class="i-badge">${esc(it.badge)}</span>` : ""}
      </div>${Array.isArray(it.prices)
        ? `<div class="i-prices">${it.prices.map((p) => `<span>${p == null ? "—" : fmt(p)}</span>`).join("")}</div>`
        : `<div class="i-price">${fmt(it.price)}</div>`}</div>`;
    // Sizes, two ways:
    //  - one price per size for the whole section: sizes: ["Small","Medium","Large"], prices: [110, 230, 370]
    //  - a price per size on every item:           sizes: ["Half · 5 pcs","Full · 10 pcs"], items: [{ name, prices: [40, 70] }]
    const sizes = (sec) => {
      if (sec.prices?.length)
        return `<div class="sizes">${sec.prices.map((p, k) => `<div><small>${esc(sec.sizes?.[k] || "")}</small><b>${fmt(p)}</b></div>`).join("")}</div>`;
      if (sec.sizes?.length && sec.items?.some((it) => Array.isArray(it.prices)))
        return `<div class="size-head"><div class="i-prices">${sec.sizes.map((z) => {
          const [main, note] = String(z).split(" · ");
          return `<span>${esc(main)}${note ? `<small>${esc(note)}</small>` : ""}</span>`;
        }).join("")}</div></div>`;
      return "";
    };
    const sectionHTML = (sec, items, attrs, title, q) => `<section class="menu-section"${attrs}>
        <h3>${title}</h3><div class="menu-group">${sizes(sec)}${items.map((it) => item(it, q)).join("")}</div></section>`;

    const el = sheet({
      title: M.title || "Menu",
      html: `${cats.length > 1 ? `<div class="seg" role="tablist">${cats.map((c, i) =>
                `<button type="button" role="tab" aria-selected="${i === 0}" data-cat="${i}">${esc(c.name)}</button>`).join("")}
              <span class="seg-thumb"></span></div>` : ""}
        <div class="chips" id="m-chips"></div>
        <div class="sheet-body menu-body" id="m-body" style="position:relative"></div>
        <div class="searchbar"><label>${I.search}<input type="search" id="m-q" placeholder="Search menu" enterkeyhint="search" autocomplete="off"></label></div>`
    });

    el.classList.add("plain");
    const body = $("#m-body", el), chips = $("#m-chips", el), thumb = $(".seg-thumb", el), q = $("#m-q", el);
    chips.style.position = "relative";
    if (thumb) thumb.style.width = `calc((100% - 4px) / ${cats.length})`;

    function showCat(n, dir = 0) {
      cat = n;
      if (thumb) thumb.style.transform = `translateX(${n * 100}%)`;
      $$(".seg button", el).forEach((b, i) => b.setAttribute("aria-selected", i === n));
      const c = cats[n];
      chips.hidden = false;
      chips.innerHTML = c.sections.map((s, i) => `<button type="button" class="chip${i ? "" : " active"}" data-sec="${i}">${esc(s.name)}</button>`).join("");
      body.innerHTML = `<div class="menu-pane${dir < 0 ? " from-left" : ""}">
          ${c.note ? `<p class="menu-note">${esc(c.note)}</p>` : ""}
          ${c.sections.map((s, i) => sectionHTML(s, s.items, ` data-sec="${i}"`, esc(s.name))).join("")}
        </div>`;
      body.scrollTop = 0;
    }

    function search(term) {
      const t = term.trim().toLowerCase();
      if (!t) return showCat(cat);
      chips.hidden = true;
      const groups = [];
      cats.forEach((c) => c.sections.forEach((s) => {
        const hits = s.items.filter((it) => [it.name, it.desc, s.name, ...(it.tags || [])].join(" ").toLowerCase().includes(t));
        if (hits.length) groups.push(sectionHTML(s, hits, "", `${esc(c.name)} · ${esc(s.name)}`, term.trim()));
      }));
      body.innerHTML = groups.length
        ? `<div class="menu-pane" style="padding-top:8px">${groups.join("")}</div>`
        : `<p class="menu-empty">No results for “${esc(term)}”</p>`;
      body.scrollTop = 0;
    }

    $$(".seg button", el).forEach((b) => b.addEventListener("click", () => {
      const n = +b.dataset.cat;
      if (n === cat && !q.value) return;
      tick();
      q.value = "";
      showCat(n, n - cat);
    }));

    chips.addEventListener("click", (e) => {
      const c = e.target.closest(".chip");
      if (!c) return;
      const sec = $(`.menu-section[data-sec="${c.dataset.sec}"]`, body);
      body.scrollTo({ top: sec.offsetTop - 6, behavior: "smooth" });
    });

    // Scroll-spy: highlight the chip of the section you're reading
    body.addEventListener("scroll", () => {
      if (chips.hidden) return;
      const secs = $$(".menu-section", body);
      let active = 0;
      secs.forEach((s, i) => { if (s.offsetTop - body.scrollTop <= 60) active = i; });
      if (body.scrollTop + body.clientHeight >= body.scrollHeight - 4) active = secs.length - 1;
      const cur = $(".chip.active", chips);
      const next = $(`.chip[data-sec="${active}"]`, chips);
      if (next && cur !== next) {
        cur?.classList.remove("active");
        next.classList.add("active");
        chips.scrollTo({ left: next.offsetLeft - chips.clientWidth / 2 + next.offsetWidth / 2, behavior: "smooth" });
      }
    }, { passive: true });

    q.addEventListener("input", () => search(q.value));
    q.addEventListener("keydown", (e) => { if (e.key === "Enter") q.blur(); });

    showCat(0);
  }

  /* ==========================================================
     Rewards — digital stamp card saved on the guest's phone.
     MVP: stamps are added by staff with a PIN (see README).
     ========================================================== */
  const RKEY = `tap-rewards:${S.slug}`;
  const loadCard = () => { try { return JSON.parse(localStorage.getItem(RKEY)); } catch { return null; } };
  const saveCard = (c) => localStorage.setItem(RKEY, JSON.stringify(c));

  function openRewards() {
    const R = Object.assign({ goal: 9, reward: "a free coffee", staffPin: "" }, S.rewards);
    const el = sheet({
      title: "Earn Rewards",
      sub: `Collect ${R.goal} stamps to earn ${R.reward}`,
      auto: true,
      html: `<div class="sheet-body" id="r-body"></div>`
    });
    const body = $("#r-body", el);
    const mini = S.logo ? `<img src="${esc(S.logo)}" alt="">` : esc(initials(S.name));

    function joinView() {
      body.innerHTML = `<div class="stagger">
          <div class="stamp-preview">${Array.from({ length: R.goal }, () => "<span></span>").join("")}</div>
          <div class="stack">
            <input class="field" id="r-name" placeholder="Your name" autocomplete="given-name" maxlength="40">
            <input class="field" id="r-email" type="email" placeholder="Email address (optional)" autocomplete="email" maxlength="80">
          </div>
          <button class="btn accent" id="r-join" type="button" style="margin-top:16px" disabled>Get your loyalty card</button>
          <p class="footnote">Your card is saved on this phone. Show it at the counter each visit to collect a stamp.</p>
        </div>`;
      staggerize($(".stagger", body));
      const name = $("#r-name", body), join = $("#r-join", body);
      name.addEventListener("input", () => { join.disabled = !name.value.trim(); });
      join.addEventListener("click", () => {
        const id = `${initials(S.name) || "TL"}-${String(Math.floor(1000 + Math.random() * 9000))}`;
        saveCard({ name: name.value.trim(), email: $("#r-email", body).value.trim(), stamps: 0, id, since: Date.now(), redeemed: 0 });
        tick(15);
        cardView();
      });
    }

    function cardView(justStamped = -1) {
      const c = loadCard();
      const n = Math.min(c.stamps, R.goal);
      const full = n >= R.goal;
      const cols = Math.max(5, Math.ceil(R.goal / 2));
      body.innerHTML = `<div class="stagger">
        <div class="lcard-wrap"><div class="lcard${justStamped >= 0 ? " static" : ""}" id="r-card">
          <div class="lcard-top"><div class="mini-logo">${mini}</div><b>${esc(S.name)}</b><small>${esc(c.id)}</small></div>
          <div class="stamps" style="grid-template-columns:repeat(${cols},1fr);max-width:${cols * 52}px">
            ${Array.from({ length: R.goal }, (_, i) => `<span class="stamp${i < n ? " on" : ""}${i === justStamped ? " just" : ""}">${I.heart}</span>`).join("")}
          </div>
          <div class="lcard-bottom">
            <div><div style="opacity:.75">Member</div><div class="holder">${esc(c.name)}</div></div>
            <div class="count">${n}<small>/${R.goal}</small></div>
          </div>
        </div></div>
        ${full ? `<div class="reward-banner">Reward unlocked — enjoy ${esc(R.reward)}!</div>`
               : `<p class="footnote" style="margin-top:0">${R.goal - n} more stamp${R.goal - n === 1 ? "" : "s"} to ${esc(R.reward)}. Show this card when you order.</p>`}
        <div>
          <button class="btn plain" id="r-staff" type="button" style="margin-top:14px">${full ? "Staff: redeem reward" : "Staff: add a stamp"}</button>
          <div class="pin-row" id="r-pinrow">
            <input class="field" id="r-pin" type="password" inputmode="numeric" maxlength="8" placeholder="Staff PIN" autocomplete="off">
            <button class="btn accent" id="r-ok" type="button">OK</button>
          </div>
        </div>
      </div>`;
      if (justStamped < 0) staggerize($(".stagger", body));
      else $$(".stagger > *", body).forEach((x) => { x.style.animation = "none"; });

      // Wallet-style tilt
      const card = $("#r-card", body);
      card.addEventListener("animationend", (e) => { if (e.animationName === "cardIn") card.style.animation = "none"; });
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transition = "transform .1s";
        card.style.transform = `rotateX(${y * -10}deg) rotateY(${x * 12}deg)`;
      });
      card.addEventListener("pointerleave", () => { card.style.transition = ""; card.style.transform = ""; });

      const row = $("#r-pinrow", body), pin = $("#r-pin", body);
      $("#r-staff", body).addEventListener("click", () => { row.classList.add("show"); pin.focus(); });
      const submit = () => {
        if (!R.staffPin || pin.value !== String(R.staffPin)) {
          row.classList.remove("shake"); void row.offsetWidth; row.classList.add("shake");
          tick(40); pin.value = "";
          return;
        }
        const cur = loadCard();
        if (cur.stamps >= R.goal) {
          cur.stamps = 0; cur.redeemed = (cur.redeemed || 0) + 1;
          saveCard(cur); toast("Reward redeemed"); cardView();
        } else {
          cur.stamps += 1; saveCard(cur); tick(20); toast("Stamp added"); cardView(cur.stamps - 1);
        }
      };
      $("#r-ok", body).addEventListener("click", submit);
      pin.addEventListener("keydown", (e) => { if (e.key === "Enter") submit(); });
    }

    loadCard() ? cardView() : joinView();
  }

  /* ==========================================================
     Anonymous feedback
     ========================================================== */
  function openFeedback() {
    const F = Object.assign({ title: "Honest Feedback", subtitle: "Speak freely — your feedback is completely anonymous." }, S.feedback);
    const note = F.endpoint ? "We never ask for your name or number."
      : F.whatsapp ? "This opens WhatsApp to send — the shop will see your number."
      : "Demo mode — set feedback.endpoint in config.js to receive messages.";
    const el = sheet({
      title: F.title, sub: F.subtitle, auto: true,
      html: `<div class="sheet-body" id="f-body"><div class="stagger">
          <textarea class="field" id="f-text" placeholder="Tell us what you loved, or what we could do better." maxlength="2000"></textarea>
          <div>
            <label class="attach">${I.camera}<span>Attach photo</span><input type="file" id="f-file" accept="image/*" hidden></label>
            <div class="attach-preview" id="f-prev"><img alt="Attached photo"><button type="button" aria-label="Remove photo">✕</button></div>
          </div>
          <button class="btn" id="f-send" type="button" disabled>Send Feedback</button>
          <p class="footnote">${esc(note)}</p>
        </div></div>`
    });
    const body = $("#f-body", el), text = $("#f-text", el), send = $("#f-send", el), file = $("#f-file", el), prev = $("#f-prev", el);
    staggerize($(".stagger", body));
    let photo = null;

    text.addEventListener("input", () => { send.disabled = text.value.trim().length < 3; });
    file.addEventListener("change", () => {
      photo = file.files[0] || null;
      if (!photo) return;
      $("img", prev).src = URL.createObjectURL(photo);
      prev.classList.add("show");
    });
    $("button", prev).addEventListener("click", () => { photo = null; file.value = ""; prev.classList.remove("show"); });

    send.addEventListener("click", async () => {
      const msg = text.value.trim();
      send.disabled = true;
      send.textContent = "Sending…";
      try {
        if (F.endpoint) {
          const fd = new FormData();
          fd.append("shop", S.name);
          fd.append("message", msg);
          if (photo) fd.append("photo", photo);
          const res = await fetch(F.endpoint, { method: "POST", body: fd, headers: { Accept: "application/json" } });
          if (!res.ok) throw new Error(res.status);
        } else if (F.whatsapp) {
          setTimeout(() => { location.href = `https://wa.me/${encodeURIComponent(F.whatsapp)}?text=${encodeURIComponent(`Feedback for ${S.name}:\n\n${msg}`)}`; }, 600);
        } else {
          console.warn("[feedback] No endpoint configured — message not sent:", msg);
        }
        tick(15);
        body.innerHTML = `<div class="success"><div class="check">${I.check}</div>
            <h3>Thank you</h3><p>Your feedback helps ${esc(S.name)} get better.</p></div>
          <button class="btn plain" type="button" data-close style="margin-top:18px">Done</button>`;
      } catch {
        send.disabled = false;
        send.textContent = "Send Feedback";
        toast("Couldn’t send — please try again");
      }
    });
  }

  /* ==========================================================
     Zero‑Kaata (Tic‑Tac‑Toe) — vs Phone or 2 players on one phone
     ========================================================== */
  function openGame() {
    const LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    const MARK = {
      X: '<svg viewBox="0 0 100 100" class="mx" fill="none" stroke="currentColor" stroke-width="12" stroke-linecap="round"><path pathLength="100" d="M24 24L76 76"/><path pathLength="100" d="M76 24L24 76"/></svg>',
      O: '<svg viewBox="0 0 100 100" class="mo" fill="none" stroke="currentColor" stroke-width="12" stroke-linecap="round"><circle pathLength="100" cx="50" cy="50" r="28" transform="rotate(-90 50 50)"/></svg>'
    };
    const el = document.createElement("section");
    el.className = "page";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-label", "Zero Kaata game");
    el.innerHTML = `
      <div class="page-head">
        <button class="back" type="button" data-close>${I.back}<span style="max-width:40vw;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(S.name)}</span></button>
        <span class="timer">Zero‑Kaata</span>
        <button class="icon-btn" id="g-reset" type="button" aria-label="Reset scores">${I.restart}</button>
      </div>
      <div class="ttt">
        <div class="seg" role="tablist">
          <button type="button" role="tab" aria-selected="true" data-mode="phone">vs Phone</button>
          <button type="button" role="tab" aria-selected="false" data-mode="friend">2 Players</button>
          <span class="seg-thumb" style="width:calc((100% - 4px)/2)"></span>
        </div>
        <div class="score">
          <div class="x" id="g-sx"><b>0</b><small></small></div>
          <div id="g-sd"><b>0</b><small>Draw</small></div>
          <div class="o" id="g-so"><b>0</b><small></small></div>
        </div>
        <div class="status" id="g-status" aria-live="polite"></div>
        <div class="grid3" id="g-board">${Array.from({ length: 9 }, (_, i) => `<button class="sq" type="button" data-i="${i}" aria-label="Square ${i + 1}"></button>`).join("")}</div>
        <button class="btn accent ttt-again" id="g-again" type="button" hidden>Play again</button>
      </div>
      <div class="edge" style="position:absolute;left:0;top:0;bottom:0;width:18px;touch-action:none;z-index:4"></div>`;

    let mode = "phone", board, turn, starter = "O", over = false, aiTimer = 0;
    const score = { X: 0, O: 0, draw: 0 };
    const sqs = $$(".sq", el), status = $("#g-status", el), again = $("#g-again", el), grid = $("#g-board", el);
    const name = (p) => mode === "phone" ? (p === "X" ? "You" : "Phone") : `Player ${p}`;

    present(el, { onClose: () => clearTimeout(aiTimer) });
    draggable(el, [$(".edge", el)], "x");

    const result = (b) => {
      for (const l of LINES) if (b[l[0]] && b[l[0]] === b[l[1]] && b[l[0]] === b[l[2]]) return { p: b[l[0]], line: l };
      return b.every(Boolean) ? { p: "draw" } : null;
    };

    // The phone plays well but slips up sometimes, so customers can actually win.
    function aiMove() {
      const empty = board.map((v, i) => (v ? -1 : i)).filter((i) => i >= 0);
      if (Math.random() < 0.28) return empty[(Math.random() * empty.length) | 0];
      const minimax = (b, t, depth) => {
        const r = result(b);
        if (r) return r.p === "O" ? 10 - depth : r.p === "X" ? depth - 10 : 0;
        let best = t === "O" ? -99 : 99;
        b.forEach((v, i) => {
          if (v) return;
          b[i] = t;
          const s = minimax(b, t === "O" ? "X" : "O", depth + 1);
          b[i] = null;
          best = t === "O" ? Math.max(best, s) : Math.min(best, s);
        });
        return best;
      };
      let bestScore = -99, moves = [];
      empty.forEach((i) => {
        board[i] = "O";
        const s = minimax(board, "X", 1);
        board[i] = null;
        if (s > bestScore) { bestScore = s; moves = [i]; } else if (s === bestScore) moves.push(i);
      });
      return moves[(Math.random() * moves.length) | 0];
    }

    function paintScore(bump) {
      $("#g-sx b", el).textContent = score.X;
      $("#g-so b", el).textContent = score.O;
      $("#g-sd b", el).textContent = score.draw;
      $("#g-sx small", el).textContent = name("X");
      $("#g-so small", el).textContent = name("O");
      $("#g-sx", el).classList.toggle("active", !over && turn === "X");
      $("#g-so", el).classList.toggle("active", !over && turn === "O");
      if (bump) { const t = $(bump, el); t.classList.remove("bump"); void t.offsetWidth; t.classList.add("bump"); }
    }

    function setStatus(text) {
      status.textContent = text;
      status.classList.remove("pop"); void status.offsetWidth; status.classList.add("pop");
    }

    function newRound() {
      clearTimeout(aiTimer);
      board = Array(9).fill(null);
      over = false;
      starter = starter === "X" ? "O" : "X";      // players take turns starting
      turn = starter;
      sqs.forEach((s) => { s.innerHTML = ""; s.className = "sq"; s.disabled = false; });
      grid.classList.remove("over");
      again.hidden = true;
      paintScore();
      if (mode === "phone" && turn === "O") { setStatus("Phone starts…"); aiTimer = setTimeout(() => play(aiMove()), 650); }
      else setStatus(mode === "phone" ? "Your turn" : `${name(turn)}’s turn`);
    }

    function play(i) {
      if (over || board[i]) return;
      tick();
      board[i] = turn;
      sqs[i].innerHTML = MARK[turn];
      sqs[i].disabled = true;
      const r = result(board);
      if (r) return finish(r);
      turn = turn === "X" ? "O" : "X";
      paintScore();
      if (mode === "phone" && turn === "O") {
        setStatus("Phone is thinking…");
        aiTimer = setTimeout(() => play(aiMove()), 450 + Math.random() * 350);
      } else setStatus(mode === "phone" ? "Your turn" : `${name(turn)}’s turn`);
    }

    function finish(r) {
      over = true;
      grid.classList.add("over");
      sqs.forEach((s) => (s.disabled = true));
      if (r.p === "draw") {
        score.draw++;
        setStatus("It’s a draw!");
        paintScore("#g-sd");
      } else {
        score[r.p]++;
        r.line.forEach((i, k) => setTimeout(() => sqs[i].classList.add("win-sq"), 120 + k * 90));
        setStatus(mode === "phone" ? (r.p === "X" ? "You win! Well played." : "Phone wins this one.") : `${name(r.p)} wins!`);
        paintScore(r.p === "X" ? "#g-sx" : "#g-so");
        tick(r.p === "X" || mode === "friend" ? 30 : 12);
      }
      setTimeout(() => { if (over) again.hidden = false; }, 450);
    }

    grid.addEventListener("click", (e) => {
      const s = e.target.closest(".sq");
      if (!s || (mode === "phone" && turn === "O")) return;
      play(+s.dataset.i);
    });
    again.addEventListener("click", newRound);
    $("#g-reset", el).addEventListener("click", () => { score.X = score.O = score.draw = 0; starter = "O"; newRound(); });
    $$(".seg button", el).forEach((b, k) => b.addEventListener("click", () => {
      if (b.dataset.mode === mode) return;
      tick();
      mode = b.dataset.mode;
      $(".seg-thumb", el).style.transform = `translateX(${k * 100}%)`;
      $$(".seg button", el).forEach((x) => x.setAttribute("aria-selected", x === b));
      score.X = score.O = score.draw = 0;
      starter = "O";
      newRound();
    }));

    newRound();
  }

  render();
})();
