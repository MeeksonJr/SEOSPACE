import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const widgetId = searchParams.get("id") || "widget-apex-toasts";
  const origin = new URL(request.url).origin;

  const scriptCode = `
(function() {
  var widgetId = "${widgetId}";
  var apiUrl = "${origin}/api/widget/" + widgetId;

  function loadWidget() {
    fetch(apiUrl)
      .then(function(res) { return res.json(); })
      .then(function(data) {
        if (!data.success || !data.reviews || data.reviews.length === 0) return;
        renderWidget(data.widget, data.reviews, data.workspace);
      })
      .catch(function(err) {
        console.warn("[TrustPulse] Failed to load widget:", err);
      });
  }

  function renderWidget(config, reviews, workspace) {
    if (config.type === "toast_notification") {
      renderToastNotification(config, reviews, workspace);
    } else if (config.type === "floating_pill") {
      renderFloatingPill(config, reviews, workspace);
    } else {
      renderWallOfLove(config, reviews, workspace);
    }
  }

  function renderToastNotification(config, reviews, workspace) {
    var container = document.createElement("div");
    container.id = "trustpulse-toast-root";
    var posStyle = config.position === "bottom_right" ? "bottom: 24px; right: 24px;" : "bottom: 24px; left: 24px;";
    container.style.cssText = "position: fixed; " + posStyle + " z-index: 999999; font-family: system-ui, -apple-system, sans-serif; pointer-events: none; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);";
    document.body.appendChild(container);

    var currentIndex = 0;

    function showToast() {
      var review = reviews[currentIndex];
      var toast = document.createElement("div");
      toast.style.cssText = "background: rgba(18, 18, 20, 0.95); backdrop-filter: blur(12px); color: #f4f4f5; border: 1px solid rgba(255,255,255,0.12); border-radius: 14px; padding: 14px 18px; box-shadow: 0 20px 40px rgba(0,0,0,0.35); max-width: 340px; pointer-events: auto; opacity: 0; transform: translateY(16px); transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1); display: flex; gap: 12px; align-items: flex-start;";
      
      var stars = "★★★★★".slice(0, review.rating);
      var brandColor = (workspace && workspace.brandColor) || "#10b981";

      toast.innerHTML = 
        '<div style="width: 38px; height: 38px; border-radius: 50%; background: ' + brandColor + '; color: #fff; font-weight: 700; font-size: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">' + 
          review.authorName.charAt(0) + 
        '</div>' +
        '<div style="flex: 1; min-width: 0;">' +
          '<div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2px;">' +
            '<span style="font-weight: 600; font-size: 13px; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">' + review.authorName + '</span>' +
            '<span style="color: #fbbf24; font-size: 11px; letter-spacing: 1px;">' + stars + '</span>' +
          '</div>' +
          '<p style="margin: 0; font-size: 12px; line-height: 1.4; color: #d4d4d8; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">' + 
            review.reviewText + 
          '</p>' +
          '<div style="display: flex; align-items: center; justify-content: space-between; margin-top: 6px; font-size: 10px; color: #a1a1aa;">' +
            '<span>' + (review.platform ? review.platform.toUpperCase() : 'VERIFIED') + ' REVIEW</span>' +
            '<span style="color: #34d399; font-weight: 500;">✓ Verified</span>' +
          '</div>' +
        '</div>';

      container.innerHTML = "";
      container.appendChild(toast);

      setTimeout(function() {
        toast.style.opacity = "1";
        toast.style.transform = "translateY(0)";
      }, 50);

      var displayDuration = Math.max(config.loopIntervalSeconds || 6, 4) * 1000;
      setTimeout(function() {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(16px)";
        setTimeout(function() {
          currentIndex = (currentIndex + 1) % reviews.length;
          showToast();
        }, 1200);
      }, displayDuration);
    }

    showToast();
  }

  function renderFloatingPill(config, reviews, workspace) {
    var pill = document.createElement("a");
    pill.id = "trustpulse-pill-badge";
    var posStyle = config.position === "bottom_right" ? "bottom: 24px; right: 24px;" : "bottom: 24px; left: 24px;";
    pill.style.cssText = "position: fixed; " + posStyle + " z-index: 999999; font-family: system-ui, sans-serif; text-decoration: none; background: #0f172a; color: #fff; padding: 10px 16px; border-radius: 9999px; display: inline-flex; align-items: center; gap: 10px; box-shadow: 0 10px 25px rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.15); transition: transform 0.2s;";
    
    var rating = (workspace && workspace.stats && workspace.stats.averageRating) || "4.9";
    var count = (workspace && workspace.stats && workspace.stats.totalReviews) || reviews.length;
    
    pill.innerHTML = 
      '<span style="color: #fbbf24; font-size: 14px;">★</span>' +
      '<span style="font-weight: 700; font-size: 13px;">' + rating + '</span>' +
      '<span style="color: #94a3b8; font-size: 12px;">(' + count + '+ reviews)</span>' +
      '<span style="width: 6px; height: 6px; border-radius: 50%; background: #10b981;"></span>';

    pill.onmouseover = function() { pill.style.transform = "scale(1.04)"; };
    pill.onmouseout = function() { pill.style.transform = "scale(1)"; };

    document.body.appendChild(pill);
  }

  function renderWallOfLove(config, reviews, workspace) {
    var target = document.getElementById("trustpulse-wall");
    if (!target) return;

    var grid = document.createElement("div");
    grid.style.cssText = "display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; font-family: system-ui, sans-serif;";

    reviews.forEach(function(r) {
      var card = document.createElement("div");
      card.style.cssText = "background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); display: flex; flex-direction: column; justify-content: space-between;";
      
      var stars = "★★★★★".slice(0, r.rating);
      card.innerHTML = 
        '<div>' +
          '<div style="color: #fbbf24; font-size: 14px; margin-bottom: 10px; letter-spacing: 2px;">' + stars + '</div>' +
          '<p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0 0 16px 0;">"' + r.reviewText + '"</p>' +
        '</div>' +
        '<div style="display: flex; align-items: center; gap: 10px; border-top: 1px solid #f1f5f9; padding-top: 14px;">' +
          '<div style="width: 32px; height: 32px; border-radius: 50%; background: #059669; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 13px;">' + r.authorName.charAt(0) + '</div>' +
          '<div>' +
            '<div style="font-weight: 600; font-size: 13px; color: #0f172a;">' + r.authorName + '</div>' +
            '<div style="font-size: 11px; color: #64748b;">' + (r.authorRole || 'Verified Client') + '</div>' +
          '</div>' +
        '</div>';
      grid.appendChild(card);
    });

    target.appendChild(grid);
  }

  if (document.readyState === "complete" || document.readyState === "interactive") {
    loadWidget();
  } else {
    document.addEventListener("DOMContentLoaded", loadWidget);
  }
})();
`;

  return new NextResponse(scriptCode, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
