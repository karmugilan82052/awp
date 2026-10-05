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
    <div class="stat-card" style="background:#ffffff; border:1px solid #e2ece2; border-radius:16px; padding:20px; box-shadow:0 2px 8px rgba(15,61,33,0.04); display:flex; justify-content:space-between; align-items:flex-start; position:relative; overflow:hidden; transition:transform 0.2s, box-shadow 0.2s;">
      <div>
        <p style="font-size:13px; font-weight:600; color:#64748b; margin-bottom:6px; text-transform:uppercase; letter-spacing:0.5px;">${title}</p>
        <h3 style="font-family:'Outfit', sans-serif; font-size:28px; font-weight:800; color:#0f172a; line-height:1.1; margin-bottom:6px;">${value}</h3>
        ${subtitle ? `<p style="font-size:12px; color:#64748b;">${subtitle}</p>` : ""}
        ${
          trend
            ? `
          <div style="display:inline-flex; align-items:center; gap:4px; font-size:11px; font-weight:700; color:${trend.isPositive ? "#16a34a" : "#dc2626"}; background:${
                trend.isPositive ? "#dcfce7" : "#fee2e2"
              }; padding:2px 8px; border-radius:12px; margin-top:6px;">
            <span>${trend.isPositive ? "▲" : "▼"}</span>
            <span>${trend.text}</span>
          </div>
        `
            : ""
        }
      </div>
      <div style="background:${c.bg}; color:${c.text}; border:1px solid ${c.border}; width:48px; height:48px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:22px; flex-shrink:0;">
        ${icon}
      </div>
    </div>
  `;
}
