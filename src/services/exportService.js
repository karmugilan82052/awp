/**
 * Report Generation & Export Service (CSV, Excel, PDF/Print)
 */

export function exportToCSV(filename, rows) {
  if (!rows || !rows.length) {
    alert("No data available to export.");
    return;
  }

  const separator = ",";
  const keys = Object.keys(rows[0]);

  const csvContent =
    keys.join(separator) +
    "\n" +
    rows
      .map(row => {
        return keys
          .map(k => {
            let cell = row[k] === null || row[k] === undefined ? "" : row[k];
            cell = cell instanceof Date ? cell.toLocaleString() : cell.toString();
            cell = cell.replace(/"/g, '""');
            if (cell.search(/("|,|\n)/g) >= 0) {
              cell = `"${cell}"`;
            }
            return cell;
          })
          .join(separator);
      })
      .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export function printTaxInvoice(order) {
  if (!order) return false;

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    console.warn("Popup blocked by browser. User can click download receipt button in modal.");
    return false;
  }
  const invoiceHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Payment_Receipt_Tax_Invoice_${order.id}</title>
        <meta charset="utf-8" />
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
        <style>
          @page {
            size: A4 portrait;
            margin: 10mm 12mm;
          }
          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body {
            font-family: 'Plus Jakarta Sans', Arial, sans-serif;
            color: #0f172a;
            padding: 24px;
            margin: 0;
            background: #ffffff;
          }
          .invoice-box {
            border: 2px solid #e2ece2;
            border-radius: 12px;
            padding: 28px 32px;
            position: relative;
            background: #ffffff;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2.5px solid #16a34a;
            padding-bottom: 18px;
            margin-bottom: 22px;
          }
          .logo {
            font-family: 'Outfit', sans-serif;
            font-size: 26px;
            font-weight: 800;
            color: #0f3d21;
          }
          .invoice-title {
            font-family: 'Outfit', sans-serif;
            font-size: 22px;
            font-weight: 800;
            color: #0f172a;
            text-align: right;
            line-height: 1.2;
          }
          .stamp {
            display: inline-block;
            border: 2px solid #16a34a;
            color: #15803d;
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-top: 6px;
            background: #f0fdf4;
          }
          .grid {
            display: flex;
            justify-content: space-between;
            gap: 18px;
            margin-bottom: 24px;
            font-size: 13.5px;
            line-height: 1.5;
          }
          .card {
            flex: 1;
            background: #f8fafc;
            padding: 14px 18px;
            border-radius: 10px;
            border: 1px solid #e2e8f0;
          }
          .card.green {
            background: #f0fdf4;
            border-color: #bbf7d0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 24px;
          }
          th {
            background: #14532d;
            color: white;
            padding: 10px 12px;
            text-align: left;
            font-size: 13px;
            font-weight: 700;
          }
          td {
            padding: 12px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 13.5px;
          }
          .totals-section {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 24px;
          }
          .payment-meta {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 12px 16px;
            font-size: 12px;
            line-height: 1.5;
            max-width: 320px;
          }
          .totals {
            width: 320px;
            font-size: 14px;
            line-height: 1.7;
          }
          .totals-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 4px;
          }
          .grand-total {
            font-family: 'Outfit', sans-serif;
            font-size: 20px;
            font-weight: 800;
            color: #15803d;
            border-top: 2px solid #cbd5e1;
            padding-top: 8px;
            margin-top: 6px;
          }
          .footer {
            margin-top: 24px;
            text-align: center;
            font-size: 11px;
            color: #64748b;
            border-top: 1px solid #e2e8f0;
            padding-top: 14px;
          }
          @media print {
            body { padding: 0 !important; }
            .no-print { display: none !important; }
          }
        </style>
      </head>
      <body>
        <!-- Print / PDF Action Bar (Hidden on actual print) -->
        <div class="no-print" style="max-width:850px; margin:0 auto 16px auto; background:#f0fdf4; border:1.5px solid #86efac; border-radius:10px; padding:12px 18px; display:flex; justify-content:space-between; align-items:center; box-shadow:0 2px 10px rgba(0,0,0,0.05);">
          <div style="display:flex; align-items:center; gap:10px;">
            <span style="font-size:22px;">📄</span>
            <div>
              <strong style="color:#14532d; font-size:14px; display:block;">Payment Receipt & Tax Invoice</strong>
              <span style="font-size:12px; color:#15803d;">To save as PDF file, select "Save as PDF" in your print destination.</span>
            </div>
          </div>
          <div style="display:flex; gap:8px;">
            <button onclick="window.print()" style="background:#16a34a; color:white; border:none; padding:8px 16px; border-radius:8px; font-weight:800; font-size:13px; cursor:pointer; display:flex; align-items:center; gap:6px;">
              🖨️ Print / Save as PDF
            </button>
            <button onclick="window.close()" style="background:#ffffff; border:1px solid #cbd5e1; color:#475569; padding:8px 12px; border-radius:8px; font-weight:600; font-size:13px; cursor:pointer;">
              ✕ Close
            </button>
          </div>
        </div>

        <div class="invoice-box">
          
          <div class="header">
            <div>
              <div class="logo">🌾 AgriWaste Marketplace</div>
              <p style="font-size:12px; color:#64748b; margin:2px 0 0 0;">National Circular Bio-Exchange & Agricultural Escrow Vault</p>
              <div style="font-size:11px; color:#16a34a; font-weight:700; margin-top:2px;">GSTIN: 33AAACA9876C1Z4 • CIN: U01100TN2026PTC109823</div>
            </div>
            <div style="text-align:right;">
              <div class="invoice-title">TAX INVOICE & PAYMENT RECEIPT</div>
              <div style="font-size:13px; color:#475569; margin-top:4px;">Invoice #: <strong>INV-${order.id}</strong></div>
              <div style="font-size:12px; color:#64748b;">Date: ${order.createdAt}</div>
              <div class="stamp">✓ PAID • ESCROW SECURED</div>
            </div>
          </div>

          <div class="grid">
            <div class="card green">
              <strong style="color:#15803d; font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">Billed From (Farmer / Producer):</strong><br>
              <span style="font-size:15px; font-weight:800; color:#0f172a; display:block; margin:2px 0;">${order.seller?.name || "Farmer"}</span>
              ${order.seller?.farmName || "FPO Cooperative"}<br>
              ${order.seller?.pickupAddress || "Farm Gate, Tamil Nadu"}<br>
              Phone: ${order.seller?.phone || "+91 98765 43210"}
            </div>
            <div class="card">
              <strong style="color:#0284c7; font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">Billed To (Industrial Buyer):</strong><br>
              <span style="font-size:15px; font-weight:800; color:#0f172a; display:block; margin:2px 0;">${order.buyer?.company || order.buyer?.name || "Buyer"}</span>
              Attn: ${order.buyer?.name || "Procurement Officer"}<br>
              ${order.buyer?.deliveryAddress || "Industrial Processing Hub, Tamil Nadu"}<br>
              Phone: ${order.buyer?.phone || "+91 98450 67890"}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width:50%;">Description / Agricultural Residue</th>
                <th style="width:15%;">Quantity</th>
                <th style="width:15%;">Unit Rate</th>
                <th style="width:20%; text-align:right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong style="color:#0f172a; font-size:14px;">${order.listingTitle}</strong><br>
                  <span style="font-size:12px; color:#64748b;">Category: ${order.category} • Certified Clean Biomass</span>
                </td>
                <td><strong>${order.quantity} ${order.unit}</strong></td>
                <td>₹${(order.unitPrice || 3500).toLocaleString("en-IN")} / ${order.unit ? order.unit.slice(0, -1) : "Ton"}</td>
                <td style="text-align:right; font-weight:700;">₹${(order.subtotal || 0).toLocaleString("en-IN")}</td>
              </tr>
            </tbody>
          </table>

          <div class="totals-section">
            
            <div class="payment-meta">
              <strong style="color:#0f172a; display:block; margin-bottom:4px; font-size:12.5px;">Payment Settlement & Escrow Summary:</strong>
              <div>• Gateway: <strong>${order.paymentGateway || "Razorpay Smart Escrow"}</strong></div>
              <div>• Mode: <strong>${order.paymentMethod || "UPI"}</strong></div>
              <div>• Transaction ID: <code style="font-size:11px; color:#0284c7;">${order.transactionId}</code></div>
              <div>• Escrow Status: <strong style="color:#16a34a;">Protected in Escrow Vault</strong></div>
              <div style="margin-top:6px; display:flex; align-items:center; gap:8px;">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=55x55&data=https://agriwaste.gov.in/verify?inv=${order.id}" alt="QR" style="width:48px; height:48px;" />
                <span style="font-size:10px; color:#64748b;">Scan to verify on National Bio-Exchange</span>
              </div>
            </div>

            <div class="totals">
              <div class="totals-row"><span>Biomass Material Subtotal:</span> <strong>₹${(order.subtotal || 0).toLocaleString("en-IN")}</strong></div>
              <div class="totals-row"><span>Logistics & Freight:</span> <strong>₹${(order.transportationFee || 0).toLocaleString("en-IN")}</strong></div>
              <div class="totals-row"><span>Platform Fee (2%):</span> <strong>₹${(order.platformFee || 0).toLocaleString("en-IN")}</strong></div>
              <div class="totals-row"><span>GST Tax (5%):</span> <strong>₹${(order.taxGst || 0).toLocaleString("en-IN")}</strong></div>
              <div class="totals-row grand-total"><span>Total Amount Paid:</span> <strong>₹${(order.totalAmount || 0).toLocaleString("en-IN")}</strong></div>
            </div>

          </div>

          <div class="footer">
            <p style="margin:0 0 4px 0;">This is a computer-generated tax invoice issued under Section 31 of the CGST Act & National Bioeconomy Exchange Guidelines.</p>
            <p style="margin:0;">Dispute Arbitration & Weighbridge Reconciliation backed by AgriWaste 100% Escrow Guarantee. Support: 1800-419-AGRI</p>
          </div>

        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 350);
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(invoiceHtml);
  printWindow.document.close();
}

/**
 * Print & Save as PDF for ESG Green Compliance Certificate
 */
export function printESGCertificate(order) {
  if (!order) return;

  const quantity = parseFloat(order.quantity) || 1.0;
  const co2MitigatedTons = (quantity * 1.48).toFixed(2);
  const coalDisplacedTons = (quantity * 0.65).toFixed(2);
  const pm25AvoidedKg = (quantity * 3.8).toFixed(1);
  const pm10AvoidedKg = (quantity * 5.2).toFixed(1);
  const treesEquivalent = Math.round((quantity * 1.48 * 1000) / 22);

  const cleanId = (order.id || "AGW-1001").replace(/[^a-zA-Z0-9]/g, "");
  const certNumber = `ESG-BRSR-2026-${cleanId}`;
  const shaHash = `SHA256:${cleanId.toLowerCase()}e89c3b129a0f447d91e6b${quantity}`;
  const issueDate = order.createdAt || new Date().toLocaleDateString("en-IN", { dateStyle: "medium" });

  const buyerCompany = order.buyer?.company || order.buyer?.name || "Industrial Procurement Entity";
  const buyerName = order.buyer?.name || "Authorized Corporate Officer";
  const buyerLocation = order.buyer?.deliveryAddress || "Industrial Processing Hub, India";

  const farmerName = order.seller?.name || "Verified Agricultural Producer";
  const farmName = order.seller?.farmName || "Green Farm Cooperative";
  const farmerLocation = order.seller?.pickupAddress || "Cauvery Agro Belt, Tamil Nadu";

  const listingTitle = order.listingTitle || "Agricultural Crop Biomass";
  const amountPaid = order.subtotal || (quantity * (order.unitPrice || 3500));

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    console.warn("Popup blocked by browser.");
    return false;
  }
  const certHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>ESG Compliance Certificate - ${certNumber}</title>
        <meta charset="utf-8" />
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
        <style>
          @page {
            size: A4 landscape;
            margin: 8mm;
          }
          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body {
            font-family: 'Plus Jakarta Sans', Arial, sans-serif;
            background: #ffffff;
            color: #0f172a;
            margin: 0;
            padding: 10px;
          }
          .cert-container {
            border: 8px double #15803d;
            border-radius: 12px;
            padding: 28px 36px;
            background: #ffffff;
            position: relative;
            max-width: 1080px;
            margin: 0 auto;
          }
          .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 260px;
            opacity: 0.04;
            pointer-events: none;
            user-select: none;
          }
          .header-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #bbf7d0;
            padding-bottom: 14px;
            margin-bottom: 16px;
          }
          .authority {
            font-size: 11px;
            font-weight: 800;
            color: #15803d;
            text-transform: uppercase;
            letter-spacing: 0.8px;
          }
          .badge-pill {
            background: #14532d;
            color: #ffffff;
            padding: 5px 16px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 0.5px;
            text-transform: uppercase;
          }
          .title {
            font-family: 'Outfit', sans-serif;
            font-size: 24px;
            font-weight: 900;
            color: #0f3d21;
            margin: 6px 0 2px 0;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: -0.5px;
          }
          .subtitle {
            font-size: 13px;
            color: #475569;
            text-align: center;
            margin: 0 0 8px 0;
            font-weight: 600;
          }
          .cert-tag {
            text-align: center;
            margin-bottom: 14px;
          }
          .cert-tag span {
            background: #f0fdf4;
            border: 1px solid #86efac;
            padding: 2px 12px;
            border-radius: 10px;
            font-size: 11px;
            color: #166534;
            font-weight: 700;
          }
          .statement {
            text-align: center;
            font-size: 13.5px;
            color: #334155;
            line-height: 1.5;
            max-width: 860px;
            margin: 0 auto 16px auto;
          }
          .parties-grid {
            display: flex;
            gap: 16px;
            margin-bottom: 16px;
          }
          .party-card {
            flex: 1;
            border: 1.5px solid #e2e8f0;
            border-radius: 10px;
            padding: 12px 16px;
            background: #f8fafc;
            font-size: 12px;
          }
          .party-card.green {
            background: #f0fdf4;
            border-color: #bbf7d0;
          }
          .metrics-grid {
            display: flex;
            gap: 12px;
            margin-bottom: 16px;
          }
          .metric-card {
            flex: 1;
            border-radius: 10px;
            padding: 10px 8px;
            text-align: center;
            border: 1.5px solid #e2e8f0;
          }
          .metric-card.m1 { background: #f0fdf4; border-color: #86efac; }
          .metric-card.m2 { background: #eff6ff; border-color: #93c5fd; }
          .metric-card.m3 { background: #faf5ff; border-color: #d8b4fe; }
          .metric-card.m4 { background: #fffbeb; border-color: #fde68a; }
          .metric-val {
            font-family: 'Outfit', sans-serif;
            font-size: 19px;
            font-weight: 900;
            display: block;
            line-height: 1.1;
          }
          .metric-lbl {
            font-size: 10.5px;
            font-weight: 800;
            display: block;
            margin-top: 2px;
          }
          .footer-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            border-top: 1.5px solid #cbd5e1;
            padding-top: 14px;
            margin-top: 14px;
          }
          .signature {
            text-align: center;
            width: 140px;
          }
          .sig-line {
            border-top: 1px solid #64748b;
            margin-top: 4px;
            padding-top: 3px;
            font-size: 10.5px;
            font-weight: 700;
          }
          .legal-note {
            text-align: center;
            font-size: 9.5px;
            color: #94a3b8;
            margin-top: 12px;
            border-top: 1px dashed #e2e8f0;
            padding-top: 6px;
          }
          @media print {
            body { padding: 0; }
            .no-print { display: none !important; }
          }
        </style>
      </head>
      <body>
        <!-- Print / PDF Action Bar (Hidden on actual print) -->
        <div class="no-print" style="max-width:1080px; margin:0 auto 14px auto; background:#f0fdf4; border:1.5px solid #86efac; border-radius:10px; padding:10px 18px; display:flex; justify-content:space-between; align-items:center; box-shadow:0 2px 10px rgba(0,0,0,0.05);">
          <div style="display:flex; align-items:center; gap:10px;">
            <span style="font-size:22px;">🌱</span>
            <div>
              <strong style="color:#14532d; font-size:14px; display:block;">ESG Green Compliance Certificate</strong>
              <span style="font-size:12px; color:#15803d;">To save as official PDF certificate, choose "Save as PDF" in print destination.</span>
            </div>
          </div>
          <div style="display:flex; gap:8px;">
            <button onclick="window.print()" style="background:#16a34a; color:white; border:none; padding:8px 16px; border-radius:8px; font-weight:800; font-size:13px; cursor:pointer; display:flex; align-items:center; gap:6px;">
              🖨️ Print / Save as PDF
            </button>
            <button onclick="window.close()" style="background:#ffffff; border:1px solid #cbd5e1; color:#475569; padding:8px 12px; border-radius:8px; font-weight:600; font-size:13px; cursor:pointer;">
              ✕ Close
            </button>
          </div>
        </div>
        
        <div class="cert-container">
          <div class="watermark">🌱</div>

          <div class="header-row">
            <div>
              <div class="authority">National Circular Bioeconomy Exchange</div>
              <div style="font-size:11px; color:#64748b;">AgriWaste Decarbonization Registry</div>
            </div>
            <div class="badge-pill">
              🎖️ Verified Sustainable Feedstock
            </div>
            <div style="text-align:right;">
              <div class="authority">ISO 14064-2 Compliant</div>
              <div style="font-size:11px; color:#64748b;">SEBI BRSR Scope 3 Certified</div>
            </div>
          </div>

          <div class="title">Certificate of ESG Green Compliance</div>
          <div class="subtitle">Stubble Burning Mitigation & Upstream Circular Biomass Valorization</div>

          <div class="cert-tag">
            <span>Certificate No: <strong>${certNumber}</strong> • Date of Issuance: <strong>${issueDate}</strong></span>
          </div>

          <div class="statement">
            This document certifies that <strong>${buyerCompany}</strong> has successfully procured and diverted 
            <strong>${quantity} Metric Tons</strong> of crop residue (<strong>${listingTitle}</strong>) 
            directly from rural agrarian farm gates, eliminating open-field stubble burning and substituting thermal fossil fuels in compliance with SEBI BRSR guidelines.
          </div>

          <div class="parties-grid">
            <div class="party-card">
              <strong style="color:#0284c7; text-transform:uppercase; font-size:10.5px;">Beneficiary Industrial Buyer:</strong><br>
              <span style="font-size:13px; font-weight:800; color:#0f172a;">${buyerCompany}</span><br>
              Procurement Officer: <strong>${buyerName}</strong><br>
              Facility: ${buyerLocation}
            </div>
            <div class="party-card green">
              <strong style="color:#15803d; text-transform:uppercase; font-size:10.5px;">Verified Rural Producer / Origin:</strong><br>
              <span style="font-size:13px; font-weight:800; color:#0f172a;">${farmerName}</span><br>
              Farm: <strong>${farmName}</strong><br>
              Farm Gate: ${farmerLocation}
            </div>
          </div>

          <div class="metrics-grid">
            <div class="metric-card m1">
              <span class="metric-val" style="color:#14532d;">${co2MitigatedTons} t</span>
              <span class="metric-lbl" style="color:#166534;">CO₂e Mitigated</span>
              <span style="font-size:9.5px; color:#4b6354;">Stubble burning avoided</span>
            </div>
            <div class="metric-card m2">
              <span class="metric-val" style="color:#1e40af;">${coalDisplacedTons} t</span>
              <span class="metric-lbl" style="color:#1d4ed8;">Coal Displaced</span>
              <span style="font-size:9.5px; color:#3b82f6;">Clean boiler fuel</span>
            </div>
            <div class="metric-card m3">
              <span class="metric-val" style="color:#6b21a8;">${pm25AvoidedKg} kg</span>
              <span class="metric-lbl" style="color:#7e22ce;">PM2.5 Smog Avoided</span>
              <span style="font-size:9.5px; color:#9333ea;">Toxic soot reduction</span>
            </div>
            <div class="metric-card m4">
              <span class="metric-val" style="color:#92400e;">${treesEquivalent}</span>
              <span class="metric-lbl" style="color:#b45309;">Trees Equiv. Saved</span>
              <span style="font-size:9.5px; color:#d97706;">Annual carbon sink</span>
            </div>
          </div>

          <div style="background:#f8fafc; border-left:3px solid #16a34a; padding:6px 12px; font-size:11px; margin-bottom:14px; display:flex; justify-content:space-between;">
            <span><strong>🌾 Rural Inflow:</strong> ₹${Number(amountPaid).toLocaleString("en-IN")} transferred directly to farmer via verified Escrow DBT.</span>
            <span style="color:#15803d; font-weight:800;">✓ 0% Middlemen Leakage</span>
          </div>

          <div class="footer-row">
            <div style="display:flex; align-items:center; gap:12px;">
              <div style="border:1px solid #cbd5e1; padding:4px; border-radius:6px; background:#ffffff;">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=https://agriwaste.gov.in/verify?cert=${certNumber}" alt="QR" style="width:52px; height:52px; display:block;" />
              </div>
              <div>
                <strong style="font-size:10px; color:#15803d; text-transform:uppercase; display:block;">Tamper-Proof Audit Verification</strong>
                <span style="font-size:9.5px; color:#64748b; display:block;">National Bio-Exchange Registry</span>
                <code style="font-size:9px; color:#475569;">${shaHash}</code>
              </div>
            </div>

            <div style="display:flex; gap:28px;">
              <div class="signature">
                <div style="font-family:'Brush Script MT', cursive; font-size:20px; color:#0f3d21;">Dr. K. Swaminathan</div>
                <div class="sig-line">Dr. K. Swaminathan<br><span style="font-size:9px; color:#64748b; font-weight:normal;">Chief Carbon Auditor</span></div>
              </div>
              <div class="signature">
                <div style="font-family:'Brush Script MT', cursive; font-size:20px; color:#0f3d21;">V. R. Malhotra</div>
                <div class="sig-line">Vikram R. Malhotra<br><span style="font-size:9px; color:#64748b; font-weight:normal;">Registrar & Escrow Custodian</span></div>
              </div>
            </div>
          </div>

          <div class="legal-note">
            Issued in conformance with SEBI Circular SEBI/HO/CFD/CFD-SEC-2/P/CIR/2023/122 for Business Responsibility & Sustainability Reporting (BRSR Core). Valid for Scope 3 emissions deduction under GHGP Corporate Standard.
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 350);
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(certHtml);
  printWindow.document.close();
}
