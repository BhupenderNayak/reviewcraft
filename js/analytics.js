(function () {
  "use strict";

  const data = window.REVIEWCRAFT_DATA;
  if (!data) {
    throw new Error("ReviewCraft configuration is unavailable.");
  }

  const config = data.analytics || {};
  const storageKey = config.storageKey || "reviewcraft_analytics_events";
  const lock = document.getElementById("pin-lock");
  const dashboard = document.getElementById("dashboard");
  const form = document.getElementById("pin-form");
  const pinInput = document.getElementById("admin-pin");
  const pinError = document.getElementById("pin-error");
  let trafficChart;
  let packageChart;

  function readEvents() {
    try {
      const events = JSON.parse(localStorage.getItem(storageKey) || "[]");
      return Array.isArray(events) ? events : [];
    } catch (error) {
      console.warn("ReviewCraft analytics logs could not be read.", error);
      return [];
    }
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function getDayKey(date) {
    return date.toISOString().slice(0, 10);
  }

  function getEventsForDays(events, days) {
    const cutoff = new Date();
    cutoff.setHours(0, 0, 0, 0);
    cutoff.setDate(cutoff.getDate() - days + 1);
    return events.filter(function (event) {
      return new Date(event.timestamp) >= cutoff;
    });
  }

  function setKpis(events) {
    const pageviews = events.filter((event) => event.eventName === "pageview").length;
    const whatsapp = events.filter((event) => event.eventName === "whatsapp_click");
    const packageClicks = whatsapp.filter((event) =>
      ["Starter", "Growth", "Premium"].includes(event.category)
    );
    const counts = { Starter: 0, Growth: 0, Premium: 0 };
    packageClicks.forEach((event) => { counts[event.category] += 1; });
    const popular = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
    document.getElementById("kpi-visits").textContent = pageviews.toLocaleString("en-IN");
    document.getElementById("kpi-whatsapp").textContent = whatsapp.length.toLocaleString("en-IN");
    document.getElementById("kpi-conversion").textContent =
      (pageviews ? ((whatsapp.length / pageviews) * 100).toFixed(1) : "0") + "%";
    document.getElementById("kpi-package").textContent =
      packageClicks.length ? popular : "—";
    return counts;
  }

  function drawTrafficChart(events, days) {
    const daily = {};
    for (let index = days - 1; index >= 0; index -= 1) {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - index);
      daily[getDayKey(date)] = { visits: 0, whatsapp: 0 };
    }
    getEventsForDays(events, days).forEach(function (event) {
      const key = getDayKey(new Date(event.timestamp));
      if (!daily[key]) return;
      if (event.eventName === "pageview") daily[key].visits += 1;
      if (event.eventName === "whatsapp_click") daily[key].whatsapp += 1;
    });
    if (trafficChart) trafficChart.destroy();
    trafficChart = new Chart(document.getElementById("traffic-chart"), {
      type: "line",
      data: {
        labels: Object.keys(daily).map((key) => key.slice(5)),
        datasets: [
          { label: "Site visits", data: Object.values(daily).map((day) => day.visits), borderColor: "#10B981", backgroundColor: "rgba(16,185,129,.12)", fill: true, tension: 0.35 },
          { label: "WhatsApp inquiries", data: Object.values(daily).map((day) => day.whatsapp), borderColor: "#F59E0B", backgroundColor: "transparent", tension: 0.35 },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom" } }, scales: { y: { beginAtZero: true, ticks: { precision: 0 } } } },
    });
  }

  function drawPackageChart(counts) {
    if (packageChart) packageChart.destroy();
    packageChart = new Chart(document.getElementById("package-chart"), {
      type: "doughnut",
      data: { labels: ["Starter ₹25", "Growth ₹27", "Premium ₹30"], datasets: [{ data: [counts.Starter, counts.Growth, counts.Premium], backgroundColor: ["#94A3B8", "#10B981", "#F59E0B"], borderWidth: 0 }] },
      options: { responsive: true, maintainAspectRatio: false, cutout: "68%", plugins: { legend: { position: "bottom" } } },
    });
  }

  function renderActivity(events) {
    const rows = events.slice().reverse().slice(0, 50).map(function (event) {
      const time = new Date(event.timestamp).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" });
      return "<tr class=\"border-b border-slate-100\"><td class=\"px-3 py-3 text-slate-500\">" + escapeHtml(time) + "</td><td class=\"px-3 py-3 font-semibold text-brand-navy\">" + escapeHtml(event.eventName) + "</td><td class=\"px-3 py-3\">" + escapeHtml(event.category) + "</td><td class=\"px-3 py-3 text-slate-500\">" + escapeHtml(event.value || "—") + "</td><td class=\"px-3 py-3 font-mono text-xs text-slate-400\">" + escapeHtml(event.sessionId.slice(-12)) + "</td></tr>";
    });
    document.getElementById("activity-log").innerHTML = rows.join("") || '<tr><td colspan="5" class="px-3 py-8 text-center text-slate-500">No local activity has been recorded yet.</td></tr>';
    document.getElementById("activity-count").textContent = events.length + " events stored locally";
  }

  function renderDashboard(days) {
    const events = readEvents();
    const counts = setKpis(events);
    drawTrafficChart(events, days);
    drawPackageChart(counts);
    renderActivity(events);
  }

  function exportCsv() {
    const rows = [["Timestamp", "Event", "Category", "Value", "Path", "Session ID"]].concat(
      readEvents().map((event) => [event.timestamp, event.eventName, event.category, event.value, event.path, event.sessionId])
    );
    const csv = rows.map((row) => row.map((value) => '"' + String(value).replace(/"/g, '""') + '"').join(",")).join("\r\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    link.download = "reviewcraft-analytics.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function unlock() {
    lock.classList.add("hidden");
    dashboard.classList.remove("hidden");
    renderDashboard(7);
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (pinInput.value === String(config.adminPin || "2026")) {
      sessionStorage.setItem("reviewcraft_analytics_unlocked", "true");
      pinError.classList.add("hidden");
      unlock();
    } else {
      pinError.classList.remove("hidden");
      pinInput.select();
    }
  });
  document.getElementById("lock-dashboard").addEventListener("click", function () {
    sessionStorage.removeItem("reviewcraft_analytics_unlocked");
    window.location.reload();
  });
  document.getElementById("export-csv").addEventListener("click", exportCsv);
  document.querySelectorAll(".range-button").forEach(function (button) {
    button.addEventListener("click", function () {
      document.querySelectorAll(".range-button").forEach((item) => item.className = "range-button rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600");
      button.className = "range-button rounded-lg bg-brand-navy px-3 py-1.5 text-xs font-bold text-white";
      renderDashboard(Number(button.dataset.days));
    });
  });
  if (sessionStorage.getItem("reviewcraft_analytics_unlocked") === "true") {
    unlock();
  }
})();
