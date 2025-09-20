export function exportToPDF(data, previewElement) {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        throw new Error('Failed to open print window. Please check if pop-ups are blocked.');
    }
    try {
        const htmlContent = generatePDFHTML(data, previewElement.innerHTML);
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    }
    catch (error) {
        printWindow.close();
        throw error;
    }
}
function generatePDFHTML(data, previewHTML) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Resume - ${data.fullName || 'Untitled'}</title>
      <style>
        ${getPDFStyles()}
      </style>
    </head>
    <body>
      <div class="pdf-container">
        ${previewHTML}
      </div>
    </body>
    </html>
  `;
}
function getPDFStyles() {
    return `
    /* Reset and base styles */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 12px;
      line-height: 1.4;
      color: #333;
      background: white;
      margin: 0;
      padding: 20px;
    }
    
    .pdf-container {
      max-width: 210mm; /* A4 width */
      margin: 0 auto;
    }
    
    /* Header styles */
    .resume-header {
      text-align: center;
      border-bottom: 2px solid #333;
      padding-bottom: 15px;
      margin-bottom: 20px;
    }
    
    .resume-header h1 {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 8px;
      color: #000;
    }
    
    .resume-header h2 {
      font-size: 16px;
      color: #666;
      margin-bottom: 8px;
      font-weight: normal;
    }
    
    .contact-info {
      font-size: 12px;
      color: #666;
      display: flex;
      justify-content: center;
      gap: 20px;
      flex-wrap: wrap;
    }
    
    .contact-info span {
      white-space: nowrap;
    }
    
    /* Section styles */
    .resume-section {
      margin-bottom: 20px;
      page-break-inside: avoid;
    }
    
    .resume-section h3 {
      font-size: 14px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #000;
      border-bottom: 1px solid #ccc;
      padding-bottom: 3px;
      margin-bottom: 12px;
    }
    
    .resume-section p {
      margin-bottom: 8px;
      text-align: justify;
      color: #444;
    }
    
    /* Work and Education items */
    .work-item,
    .education-item {
      margin-bottom: 15px;
      padding-left: 15px;
      border-left: 3px solid #ddd;
      page-break-inside: avoid;
    }
    
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 6px;
    }
    
    .item-title {
      font-weight: bold;
      font-size: 13px;
      color: #000;
    }
    
    .item-company {
      color: #666;
      font-style: italic;
      font-size: 12px;
      margin-top: 2px;
    }
    
    .item-date {
      color: #666;
      font-size: 11px;
      white-space: nowrap;
      margin-left: 10px;
    }
    
    .item-description {
      margin-top: 6px;
      color: #555;
      text-align: justify;
      font-size: 11px;
      line-height: 1.3;
    }
    
    /* Print-specific styles */
    @media print {
      body {
        margin: 0;
        padding: 15mm;
      }
      
      .pdf-container {
        max-width: none;
      }
      
      .resume-section {
        page-break-inside: avoid;
      }
      
      .work-item,
      .education-item {
        page-break-inside: avoid;
      }
      
      /* Ensure good contrast for printing */
      .resume-header h1 {
        color: #000 !important;
      }
      
      .resume-section h3 {
        color: #000 !important;
      }
      
      .item-title {
        color: #000 !important;
      }
    }
    
    /* Hide elements that shouldn't appear in PDF */
    .empty-state {
      display: none;
    }
    
    /* Responsive adjustments for smaller viewports */
    @media (max-width: 600px) {
      .contact-info {
        flex-direction: column;
        gap: 5px;
      }
      
      .item-header {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .item-date {
        margin-left: 0;
        margin-top: 2px;
      }
    }
  `;
}
export function generatePDFFilename(fullName) {
    const date = new Date().toISOString().split('T')[0];
    const sanitizedName = fullName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    return `${sanitizedName || 'resume'}-${date}.pdf`;
}
