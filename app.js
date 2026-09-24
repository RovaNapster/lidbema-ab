(() => {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("huvudmeny");
  navToggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Stäng menyn" : "Öppna menyn");
  });

  const root = document.querySelector(".modal-root");
  const dialog = root?.querySelector(".modal");
  const main = document.getElementById("innehall");
  const header = document.querySelector(".site-header");
  const footer = document.querySelector(".site-footer");
  const openers = [...document.querySelectorAll("[data-open-modal]")];
  const closers = [...document.querySelectorAll("[data-close-modal]")];
  let lastTrigger = null;

  const focusableSelector =
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

  function getFocusable() {
    return [...dialog.querySelectorAll(focusableSelector)].filter(
      (el) => !el.hasAttribute("disabled") && el.offsetParent !== null
    );
  }

  function setInert(on) {
    [main, header, footer].forEach((node) => {
      if (!node) return;
      node.inert = on;
      node.setAttribute("aria-hidden", String(on));
    });
  }

  function openModal(trigger) {
    lastTrigger = trigger || document.activeElement;
    root.hidden = false;
    document.body.classList.add("modal-open");
    setInert(true);
    window.requestAnimationFrame(() => dialog.focus());
  }

  function closeModal() {
    root.hidden = true;
    document.body.classList.remove("modal-open");
    setInert(false);
    lastTrigger?.focus();
  }

  openers.forEach((btn) => btn.addEventListener("click", () => openModal(btn)));
  closers.forEach((btn) => btn.addEventListener("click", closeModal));

  document.addEventListener("keydown", (event) => {
    if (root.hidden) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeModal();
      return;
    }
    if (event.key !== "Tab") return;
    const nodes = getFocusable();
    if (!nodes.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  document.getElementById("forfragan")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const namn = String(data.get("namn") || "").trim();
    const telefon = String(data.get("telefon") || "").trim();
    const epost = String(data.get("epost") || "").trim();
    const meddelande = String(data.get("meddelande") || "").trim();
    if (!namn || !telefon || !meddelande) return;

    const subject = encodeURIComponent("Förfrågan till Lidbema AB");
    const body = encodeURIComponent(
      `Namn: ${namn}\nTelefon: ${telefon}\nE-post: ${epost || "—"}\n\n${meddelande}`
    );
    window.location.href = `mailto:lidbema@gmail.com?subject=${subject}&body=${body}`;
  });
})();
