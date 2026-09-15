(function () {
  "use strict";

  var TITLE_EN =
    "Raqm | Raqm - An Integrated Smart Business Ecosystem";
  var TITLE_AR = "رقم | Raqm - منظومة أعمال ذكية متكاملة";

  var STORAGE_KEY = "raqm-lang";

  function applyLanguage(lang) {
    var isEn = lang === "en";

    // 1) Swap all translatable text nodes
    var textNodes = document.querySelectorAll("[data-i18n]");
    textNodes.forEach(function (el) {
      if (isEn) {
        var en = TRANSLATIONS[el.getAttribute("data-i18n")];
        if (en !== undefined) {
          el.textContent = en;
        }
      } else {
        var ar = el.getAttribute("data-ar");
        if (ar !== null) {
          el.textContent = ar;
        }
      }
    });

    // 2) Swap translatable attributes (aria-label, etc.)
    var attrNodes = document.querySelectorAll("[data-i18n-attr]");
    attrNodes.forEach(function (el) {
      var attr = el.getAttribute("data-i18n-attr");
      var value = isEn
        ? el.getAttribute("data-en")
        : el.getAttribute("data-ar");
      if (value !== null) {
        el.setAttribute(attr, value);
      }
    });

    // 3) Meta description
    var metaDesc = document.getElementById("page-description");
    if (metaDesc) {
      var arDesc = metaDesc.getAttribute("data-ar-content");
      var enDesc = metaDesc.getAttribute("data-en");
      if (isEn && enDesc) {
        if (!arDesc) {
          metaDesc.setAttribute(
            "data-ar-content",
            metaDesc.getAttribute("content")
          );
        }
        metaDesc.setAttribute("content", enDesc);
      } else if (!isEn && arDesc) {
        metaDesc.setAttribute("content", arDesc);
      }
    }

    // 4) Page title
    document.title = isEn ? TITLE_EN : TITLE_AR;

    // 5) Root direction / language
    document.documentElement.setAttribute("lang", isEn ? "en" : "ar");
    document.documentElement.setAttribute("dir", isEn ? "ltr" : "rtl");
    document.documentElement.classList.toggle("lang-en", isEn);
    document.body.classList.toggle("lang-en", isEn);

    // 6) Active state on the footer language buttons
    var btnAr = document.getElementById("lang-btn-ar");
    var btnEn = document.getElementById("lang-btn-en");
    if (btnAr) btnAr.classList.toggle("active", !isEn);
    if (btnEn) btnEn.classList.toggle("active", isEn);

    // 7) Remember choice
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      /* localStorage unavailable - ignore */
    }
  }

  function init() {
    var btnAr = document.getElementById("lang-btn-ar");
    var btnEn = document.getElementById("lang-btn-en");

    if (btnEn) {
      btnEn.addEventListener("click", function () {
        applyLanguage("en");
      });
    }
    if (btnAr) {
      btnAr.addEventListener("click", function () {
        applyLanguage("ar");
      });
    }

    var saved = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      /* ignore */
    }
    if (saved === "en" || saved === "ar") {
      applyLanguage(saved);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
