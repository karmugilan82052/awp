/**
 * Reusable StatCard Component
 */

export function renderStatCard({ title, value, subtitle = "", icon = "📊", trend = null, color = "green" }) {
  const colorMap = {
    green: { bg: "#f0fdf4", text: "#16a34a", border: "#bbf7d0" },
    blue: { bg: "#f0f9ff", text: "#0284c7", border: "#bae6fd" },
    amber: { bg: "#fffbeb", text: "#d97706", border: "#fde68a" },
    purple: { bg: "#faf5ff", text: "#9333ea", border: "#e9d5ff" },
    red: { bg: "#fef2f2", text: "#dc2626", border: "#fecaca" }
  };

  const c = colorMap[color] || colorMap.green;

  return `
    <div class="stat-card" style="background:#ffffff; border:1px solid #e2ece2; border-radius:16px; padding:22px 24px; box-shadow:0 2px 8px rgba(15,61,33,0.04); display:flex; justify-content:space-between; align-items:flex-start; position:relative; overflow:hidden; transition:transform 0.2s, box-shadow 0.2s;">
      <div>
        <p style="font-size:15px; font-weight:700; color:#475569; margin-bottom:8px; text-transform:uppercase; letter-spacing:0.5px;">${title}</p>
        <h3 style="font-family:'Outfit', sans-serif; font-size:34px; font-weight:800; color:#0f172a; line-height:1.1; margin-bottom:8px;">${value}</h3>
        ${subtitle ? `<p style="font-size:14px; color:#64748b; font-weight:500;">${subtitle}</p>` : ""}
        ${
          trend
            ? `
          <div style="display:inline-flex; align-items:center; gap:6px; font-size:13px; font-weight:800; color:${trend.isPositive ? "#16a34a" : "#dc2626"}; background:${
                trend.isPositive ? "#dcfce7" : "#fee2e2"
              }; padding:4px 10px; border-radius:12px; margin-top:8px;">
            <span>${trend.isPositive ? "▲" : "▼"}</span>
            <span>${trend.text}</span>
          </div>
        `
            : ""
        }
      </div>
      <div style="background:${c.bg}; color:${c.text}; border:1px solid ${c.border}; width:54px; height:54px; border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:26px; flex-shrink:0;">
        ${icon}
      </div>
    </div>
  `;
}
