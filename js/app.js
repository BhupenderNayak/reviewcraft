(function () {
  "use strict";

  const data = window.REVIEWCRAFT_DATA;
  if (!data) {
    throw new Error("ReviewCraft configuration is unavailable.");
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function createWhatsAppUrl(message) {
    return (
      "https://wa.me/" +
      data.whatsappNumber +
      "?text=" +
      encodeURIComponent(message)
    );
  }

  const analyticsConfig = data.analytics || {};
  const analyticsStorageKey =
    analyticsConfig.storageKey || "reviewcraft_analytics_events";
  const sessionStorageKey = "reviewcraft_analytics_session";

  function getAnalyticsSessionId() {
    let sessionId = sessionStorage.getItem(sessionStorageKey);
    if (!sessionId) {
      sessionId =
        "session-" +
        Date.now() +
        "-" +
        Math.random().toString(36).slice(2, 10);
      sessionStorage.setItem(sessionStorageKey, sessionId);
    }
    return sessionId;
  }

  function trackAnalyticsEvent(eventName, details) {
    const event = {
      eventName: eventName,
      category: details && details.category ? details.category : "General",
      value: details && details.value ? details.value : "",
      timestamp: new Date().toISOString(),
      path: window.location.pathname,
      sessionId: getAnalyticsSessionId(),
    };
    let events = [];
    try {
      events = JSON.parse(localStorage.getItem(analyticsStorageKey) || "[]");
      if (!Array.isArray(events)) {
        events = [];
      }
      events.push(event);
      localStorage.setItem(
        analyticsStorageKey,
        JSON.stringify(events.slice(-2000))
      );
    } catch (error) {
      console.warn("ReviewCraft analytics could not save this event.", error);
    }

    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, {
        event_category: event.category,
        event_label: event.value,
      });
    } else if (typeof window.goatcounter === "object" && window.goatcounter.count) {
      window.goatcounter.count({
        path: eventName + "/" + event.category,
        title: event.value || eventName,
      });
    }
  }

  function configureExternalAnalytics() {
    const provider = analyticsConfig.provider;
    if (
      provider === "google" &&
      analyticsConfig.googleMeasurementId &&
      analyticsConfig.googleMeasurementId !== "G-XXXXXXXXXX"
    ) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () {
        window.dataLayer.push(arguments);
      };
      window.gtag("js", new Date());
      window.gtag("config", analyticsConfig.googleMeasurementId);
      const script = document.createElement("script");
      script.async = true;
      script.src =
        "https://www.googletagmanager.com/gtag/js?id=" +
        encodeURIComponent(analyticsConfig.googleMeasurementId);
      document.head.appendChild(script);
    } else if (
      provider === "goatcounter" &&
      analyticsConfig.goatCounterUrl &&
      analyticsConfig.goatCounterScriptUrl
    ) {
      const script = document.createElement("script");
      script.async = true;
      script.src = analyticsConfig.goatCounterScriptUrl;
      script.dataset.goatcounter = analyticsConfig.goatCounterUrl;
      document.head.appendChild(script);
    }
  }

  configureExternalAnalytics();
  trackAnalyticsEvent("pageview", { category: "Pageview" });
  if (!sessionStorage.getItem(sessionStorageKey + "_started")) {
    sessionStorage.setItem(sessionStorageKey + "_started", "true");
    trackAnalyticsEvent("session_start", { category: "Session" });
  }

  function renderPricingPlans() {
    const grid = document.getElementById("pricing-grid");
    if (!grid) {
      return;
    }

    grid.innerHTML = data.pricingPlans
      .map(function (plan) {
        const popularBadge = plan.mostPopular
          ? '<span class="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500 px-4 py-1 text-xs font-extrabold uppercase tracking-wider text-brand-navy shadow">Most Popular</span>'
          : "";
        const cardClass = plan.mostPopular
          ? "relative rounded-3xl border-2 border-emerald-500 bg-brand-navy p-8 text-white shadow-xl"
          : "rounded-3xl border border-slate-200 bg-white p-8 shadow-sm";
        const textClass = plan.mostPopular ? "text-slate-200" : "text-slate-700";
        const mutedClass = plan.mostPopular ? "text-slate-400" : "text-slate-500";
        const featureIconClass = plan.mostPopular
          ? "text-emerald-400"
          : "text-emerald-600";
        const features = plan.features
          .map(function (feature) {
            return (
              '<li class="flex items-start gap-3">' +
              '<i class="fa-solid fa-circle-check mt-0.5 ' +
              featureIconClass +
              '"></i><span>' +
              escapeHtml(feature) +
              "</span></li>"
            );
          })
          .join("");

        return (
          '<article class="' +
          cardClass +
          '">' +
          popularBadge +
          '<div class="flex h-full flex-col justify-between">' +
          '<div><p class="text-xs font-bold uppercase tracking-wider ' +
          (plan.mostPopular ? "text-emerald-400" : "text-amber-600") +
          '">' +
          (plan.mostPopular ? "Local Domination" : plan.name + " Plan") +
          "</p>" +
          '<h3 class="mt-1 font-display text-2xl font-extrabold">' +
          escapeHtml(plan.name) +
          " Package</h3>" +
          '<div class="my-6 border-b pb-6 ' +
          (plan.mostPopular ? "border-slate-800" : "border-slate-100") +
          '">' +
          '<div class="flex items-baseline gap-1"><span class="font-display text-4xl font-extrabold">₹' +
          plan.pricePerReview +
          '</span><span class="' +
          mutedClass +
          ' text-sm font-medium">/ per review</span></div>' +
          '<p id="' +
          plan.id +
          '-total" class="mt-2 text-xs font-semibold ' +
          (plan.mostPopular ? "text-emerald-400" : "text-emerald-700") +
          '"></p></div>' +
          '<ul class="space-y-3.5 text-sm ' +
          textClass +
          '">' +
          features +
          "</ul></div>" +
          '<a id="' +
          plan.id +
          '-wa-btn" target="_blank" rel="noopener noreferrer" class="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 font-semibold transition ' +
          (plan.mostPopular
            ? "bg-emerald-500 text-brand-navy hover:bg-emerald-400"
            : "border-2 border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white") +
          '"><i class="fa-brands fa-whatsapp text-lg"></i><span>Order ' +
          escapeHtml(plan.name) +
          " on WhatsApp</span></a></div></article>"
        );
      })
      .join("");
  }

  function renderPromotions() {
    const gallery = document.getElementById("promotions-gallery");
    if (!gallery) {
      return;
    }

    gallery.innerHTML = data.promotions
      .map(function (promotion) {
        return (
          '<article class="poster-card group shadow-sm">' +
          '<img src="' +
          escapeHtml(promotion.imagePath) +
          '" alt="' +
          escapeHtml(promotion.title) +
          '" loading="lazy">' +
          '<div class="poster-footer">' +
          '<a class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-3 py-2.5 text-xs font-bold text-brand-navy transition hover:bg-emerald-400" target="_blank" rel="noopener noreferrer" href="' +
          createWhatsAppUrl(promotion.whatsappInquiryText) +
          '"><i class="fa-brands fa-whatsapp"></i> Claim Offer / Inquire on WhatsApp</a></div></article>'
        );
      })
      .join("");
  }

  function renderTestimonials() {
    const grid = document.getElementById("testimonials-grid");
    if (!grid) {
      return;
    }

    grid.innerHTML = data.testimonials
      .map(function (testimonial) {
        const stars = Array.from({ length: 5 }, function (_, index) {
          const filled = index < Number(testimonial.rating);
          return (
            '<i class="fa-' +
            (filled ? "solid" : "regular") +
            ' fa-star' +
            (filled ? "" : " text-slate-300") +
            '"></i>'
          );
        }).join("");
        const details = testimonial.serviceDetails || {};
        return (
          '<article class="testimonial-card flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">' +
          '<div class="mb-3 flex gap-1 text-amber-400" aria-label="' +
          escapeHtml(testimonial.rating) +
          ' out of 5 stars">' +
          stars +
          "</div>" +
          '<p class="mb-6 text-sm leading-relaxed text-slate-700">“' +
          escapeHtml(testimonial.testimonyText) +
          '”</p><div class="mt-auto flex items-center gap-3">' +
          '<div class="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">' +
          escapeHtml(testimonial.clientName)
            .split(" ")
            .map(function (part) {
              return part[0];
            })
            .join("")
            .slice(0, 2) +
          "</div><div><h3 class=\"text-sm font-bold text-brand-navy\">" +
          escapeHtml(testimonial.clientName) +
          '</h3><p class="text-xs font-semibold text-brand-navy">' +
          escapeHtml(testimonial.businessName) +
          '</p><span class="mt-1 inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">' +
          '<i class="fa-solid fa-location-dot mr-1 mt-0.5"></i>' +
          escapeHtml(testimonial.addressLocation) +
          '</span><p class="mt-1 text-xs font-semibold text-emerald-700">' +
          escapeHtml(testimonial.reviewCountAdded) +
          " reviews added</p></div></div>" +
          '<details class="testimonial-details mt-5 pt-4">' +
          '<summary class="flex cursor-pointer items-center justify-between text-xs font-bold text-brand-navy">' +
          '<span>Read More / Details</span><i class="fa-solid fa-chevron-down text-emerald-600 transition-transform" aria-hidden="true"></i></summary>' +
          '<dl class="mt-3 space-y-2 text-xs text-slate-600">' +
          '<div class="flex justify-between gap-4"><dt>Package Used</dt><dd class="text-right font-semibold text-slate-800">' +
          escapeHtml(details.packageUsed || "Verified campaign") +
          "</dd></div>" +
          '<div class="flex justify-between gap-4"><dt>Location Targeted</dt><dd class="text-right font-semibold text-slate-800">' +
          escapeHtml(details.locationTargeted || testimonial.addressLocation) +
          "</dd></div>" +
          '<div class="flex justify-between gap-4"><dt>Review Retention Rate</dt><dd class="text-right font-semibold text-emerald-700">' +
          escapeHtml(details.reviewRetentionRate || "Verified") +
          "</dd></div></dl></details></article>"
        );
      })
      .join("");
  }

  function setupTestimonialsCarousel() {
    const viewport = document.getElementById("testimonials-viewport");
    const track = document.getElementById("testimonials-grid");
    const previousButton = document.getElementById("testimonials-prev");
    const nextButton = document.getElementById("testimonials-next");
    const pagination = document.getElementById("testimonials-pagination");
    if (!viewport || !track || !previousButton || !nextButton || !pagination) {
      return;
    }

    let currentPage = 0;
    let startX = 0;
    let isDragging = false;

    function getVisibleCount() {
      if (window.matchMedia("(min-width: 1024px)").matches) {
        return 3;
      }
      if (window.matchMedia("(min-width: 640px)").matches) {
        return 2;
      }
      return 1;
    }

    function getPageCount() {
      return Math.max(1, Math.ceil(data.testimonials.length / getVisibleCount()));
    }

    function renderPagination() {
      pagination.innerHTML = Array.from({ length: getPageCount() }, function (_, index) {
        return (
          '<button type="button" class="testimonial-dot' +
          (index === currentPage ? " is-active" : "") +
          '" aria-label="Go to testimonial page ' +
          (index + 1) +
          '" aria-current="' +
          (index === currentPage ? "true" : "false") +
          '"></button>'
        );
      }).join("");
      pagination.querySelectorAll(".testimonial-dot").forEach(function (dot, index) {
        dot.addEventListener("click", function () {
          goToPage(index);
        });
      });
    }

    function updateCarousel() {
      const pageCount = getPageCount();
      currentPage = Math.min(currentPage, pageCount - 1);
      track.style.transform =
        "translateX(-" + currentPage * viewport.clientWidth + "px)";
      previousButton.disabled = currentPage === 0;
      nextButton.disabled = currentPage === pageCount - 1;
      renderPagination();
    }

    function goToPage(page) {
      currentPage = Math.max(0, Math.min(page, getPageCount() - 1));
      updateCarousel();
    }

    previousButton.addEventListener("click", function () {
      goToPage(currentPage - 1);
    });
    nextButton.addEventListener("click", function () {
      goToPage(currentPage + 1);
    });
    track.addEventListener("touchstart", function (event) {
      startX = event.touches[0].clientX;
      isDragging = true;
    }, { passive: true });
    track.addEventListener("touchend", function (event) {
      if (!isDragging) {
        return;
      }
      const distance = event.changedTouches[0].clientX - startX;
      isDragging = false;
      if (Math.abs(distance) > 40) {
        goToPage(currentPage + (distance < 0 ? 1 : -1));
      }
    }, { passive: true });
    window.addEventListener("resize", updateCarousel);
    updateCarousel();
  }

  renderPricingPlans();
  renderPromotions();
  renderTestimonials();
  setupTestimonialsCarousel();

  const menuButton = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", function () {
      const isHidden = mobileMenu.classList.toggle("hidden");
      menuButton.setAttribute("aria-expanded", String(!isHidden));
    });
  }

  const slider = document.getElementById("review-slider");
  const countDisplay = document.getElementById("slider-count-display");
  function updateWhatsAppLinks() {
    document.querySelectorAll(".js-whatsapp-link").forEach(function (link) {
      link.href = "https://wa.me/" + data.whatsappNumber;
    });
  }

  function updateInstagramLinks() {
    document.querySelectorAll(".js-instagram-link").forEach(function (link) {
      link.href = data.instagramUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    });
  }

  document.addEventListener("input", function (event) {
    if (event.target && event.target.id === "review-slider") {
      trackAnalyticsEvent("review_slider_use", {
        category: "Review Slider",
        value: event.target.value,
      });
    }
  });

  document.addEventListener("click", function (event) {
    const link = event.target.closest("a");
    if (!link) {
      return;
    }
    if (link.classList.contains("js-instagram-link")) {
      trackAnalyticsEvent("instagram_click", { category: "Instagram" });
      return;
    }
    if (link.href.indexOf("https://wa.me/") === 0) {
      let category = "General Audit";
      if (link.id === "starter-wa-btn") {
        category = "Starter";
      } else if (link.id === "growth-wa-btn") {
        category = "Growth";
      } else if (link.id === "premium-wa-btn") {
        category = "Premium";
      }
      trackAnalyticsEvent("whatsapp_click", { category: category });
    }
  });

  function updatePricing() {
    const quantity = Number.parseInt(slider.value, 10);
    countDisplay.textContent = quantity + " Reviews";

    data.pricingPlans.forEach(function (plan) {
      const total = (quantity * plan.pricePerReview).toLocaleString("en-IN");
      const totalElement = document.getElementById(plan.id + "-total");
      const button = document.getElementById(plan.id + "-wa-btn");
      if (!totalElement || !button) {
        return;
      }

      const bonusText = plan.id === "premium" ? " (+ 5-10 Free)" : "";
      totalElement.textContent =
        "Estimated for " + quantity + " reviews: ₹" + total + bonusText;
      const message =
        "Hi ReviewCraft, I want to order the " +
        plan.name.toUpperCase() +
        " PACKAGE (₹" +
        plan.pricePerReview +
        "/review) for " +
        quantity +
        " reviews (Est. ₹" +
        total +
        ").";
      button.href =
        createWhatsAppUrl(message);
    });
  }

  if (slider && countDisplay) {
    slider.addEventListener("input", updatePricing);
    updatePricing();
  }
  updateWhatsAppLinks();
  updateInstagramLinks();
})();
