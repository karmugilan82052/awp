/**
 * OrderTimeline Component for 9-Stage Visual Fulfillment Tracking
 */

export function renderOrderTimeline(order) {
  if (!order || !order.timeline) return "";

  return `
    <div class="order-timeline-card" style="background:#ffffff; border:1px solid #e2ece2; border-radius:16px; padding:24px; box-shadow:0 2px 10px rgba(15,61,33,0.04); margin-bottom:24px;">
      
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; padding-bottom:12px; border-bottom:1px solid #f0f6f0;">
        <div>
          <h3 style="font-family:'Outfit', sans-serif; font-size:18px; font-weight:700; color:#0f172a;">
            Fulfillment & Live Logistics Timeline
          </h3>
          <p style="font-size:12px; color:#64748b;">Order Tracking ID: <strong>${order.id}</strong> • Status: <span style="color:#16a34a; font-weight:700;">${order.status}</span></p>
        </div>
        <div style="text-align:right;">
          <span style="font-size:11px; color:#64748b; display:block;">Est. Delivery Date</span>
          <span style="font-size:13px; font-weight:700; color:#0f172a;">${order.estimatedDelivery || "In Progress"}</span>
        </div>
      </div>

      <!-- Horizontal Stepper for Desktop -->
      <div class="timeline-horizontal" style="display:flex; justify-content:space-between; position:relative; margin-bottom:24px;">
        
        <!-- Connecting Background Line -->
        <div style="position:absolute; top:18px; left:20px; right:20px; height:3px; background:#e2e8f0; z-index:1;"></div>

        ${order.timeline
          .map((step, idx) => {
            const isCompleted = step.completed;
            const isActive = step.active;

            return `
            <div style="position:relative; z-index:2; display:flex; flex-direction:column; align-items:center; text-align:center; max-width:90px;">
              <div style="width:36px; height:36px; border-radius:50%; background:${
                isCompleted ? "#16a34a" : isActive ? "#0284c7" : "#ffffff"
              }; border:3px solid ${isCompleted ? "#16a34a" : isActive ? "#0284c7" : "#cbd5e1"}; color:${
              isCompleted || isActive ? "#ffffff" : "#64748b"
            }; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:12px; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
                ${isCompleted ? "✓" : idx + 1}
              </div>
              <span style="font-size:11px; font-weight:700; color:${
                isActive ? "#0284c7" : isCompleted ? "#0f172a" : "#64748b"
              }; margin-top:8px; line-height:1.2;">${step.step}</span>
              <span style="font-size:10px; color:#94a3b8; margin-top:2px;">${step.time || ""}</span>
            </div>
          `;
          })
          .join("")}

      </div>

      <!-- Live Logistics Status Card -->
      ${
        order.logistics
          ? `
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
          <div>
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
              <span style="font-size:16px;">🚚</span>
              <strong style="font-size:13px; color:#0f172a;">${order.logistics.carrier}</strong>
              <span style="background:#dbeafe; color:#1d4ed8; font-size:10px; font-weight:700; padding:2px 6px; border-radius:4px;">${order.logistics.vehicleNumber}</span>
            </div>
            <p style="font-size:12px; color:#475569;">
              Driver: <strong>${order.logistics.driverName}</strong> (${order.logistics.driverPhone})
            </p>
          </div>
          <div style="text-align:right;">
            <span style="font-size:11px; color:#64748b; display:block;">Current Transit Checkpoint</span>
            <span style="font-size:13px; font-weight:700; color:#16a34a;">📍 ${order.logistics.currentLocation}</span>
          </div>
        </div>
      `
          : ""
      }

    </div>
  `;
}
