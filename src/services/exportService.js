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
  if (!order) return;

  const printWindow = window.open("", "_blank");
  const invoiceHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Tax Invoice - ${order.id}</title>
        <style>
          body { font-family: 'Plus Jakarta Sans', Arial, sans-serif; color: #1e293b; padding: 40px; margin: 0; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #16a34a; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: 800; color: #16a34a; }
          .invoice-title { font-size: 20px; font-weight: 700; color: #0f172a; text-align: right; }
          .grid { display: flex; justify-content: space-between; margin-bottom: 30px; font-size: 14px; line-height: 1.6; }
          .card { width: 46%; background: #f8fafc; padding: 18px; border-radius: 8px; border: 1px solid #e2e8f0; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th { background: #16a34a; color: white; padding: 12px; text-align: left; font-size: 13px; }
          td { padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
          .totals { width: 320px; margin-left: auto; font-size: 14px; line-height: 1.8; }
          .totals-row { display: flex; justify-content: space-between; margin-bottom: 6px; }
          .grand-total { font-size: 18px; font-weight: 800; color: #16a34a; border-top: 2px solid #cbd5e1; padding-top: 10px; }
          .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">🌾 AgriWaste Marketplace</div>
            <p style="font-size:12px; color:#64748b; margin-top:4px;">National Bio-Exchange & Circular Agriculture Hub</p>
          </div>
          <div class="invoice-title">
            TAX INVOICE<br>
            <span style="font-size:14px; color:#64748b; font-weight:normal;">Invoice #: INV-${order.id}</span><br>
            <span style="font-size:12px; color:#64748b; font-weight:normal;">Date: ${order.createdAt}</span>
          </div>
        </div>

        <div class="grid">
          <div class="card">
            <strong>SELLER / PRODUCER:</strong><br>
            ${order.seller.name}<br>
            ${order.seller.farmName}<br>
            ${order.seller.pickupAddress}<br>
            Phone: ${order.seller.phone}
          </div>
          <div class="card">
            <strong>BUYER / RECYCLER:</strong><br>
            ${order.buyer.name}<br>
            ${order.buyer.company}<br>
            ${order.buyer.deliveryAddress}<br>
            Phone: ${order.buyer.phone}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantity</th>
              <th>Unit Rate</th>
              <th style="text-align:right;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>${order.listingTitle}</strong><br><span style="font-size:11px; color:#64748b;">Category: ${order.category}</span></td>
              <td>${order.quantity} ${order.unit}</td>
              <td>₹${order.unitPrice.toLocaleString("en-IN")} / ${order.unit.slice(0, -1)}</td>
              <td style="text-align:right;">₹${order.subtotal.toLocaleString("en-IN")}</td>
            </tr>
          </tbody>
        </table>

        <div class="totals">
          <div class="totals-row"><span>Crop Biomass Subtotal:</span> <strong>₹${order.subtotal.toLocaleString("en-IN")}</strong></div>
          <div class="totals-row"><span>Logistics & Freight:</span> <strong>₹${order.transportationFee.toLocaleString("en-IN")}</strong></div>
          <div class="totals-row"><span>Platform Fee (2%):</span> <strong>₹${order.platformFee.toLocaleString("en-IN")}</strong></div>
          <div class="totals-row"><span>GST Tax (5%):</span> <strong>₹${order.taxGst.toLocaleString("en-IN")}</strong></div>
          <div class="totals-row grand-total"><span>Total Paid:</span> <strong>₹${order.totalAmount.toLocaleString("en-IN")}</strong></div>
        </div>

        <div class="footer">
          <p>Payment Secured via Escrow (${order.paymentMethod} • Txn: ${order.transactionId})</p>
          <p>This is a computer-generated tax invoice issued under the National Circular Bioeconomy Exchange Guidelines.</p>
        </div>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(invoiceHtml);
  printWindow.document.close();
}
