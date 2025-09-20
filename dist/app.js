"use strict";
class NotificationSystem {
    static show(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 1rem 1.5rem;
      border-radius: 10px;
      color: white;
      font-weight: 600;
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
      background: ${this.COLORS[type]};
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      max-width: 400px;
      word-wrap: break-word;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    `;
        notification.innerHTML = `${this.ICONS[type]} ${message}`;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    static initializeStyles() {
        if (document.getElementById('notification-animations'))
            return;
        const style = document.createElement('style');
        style.id = 'notification-animations';
        style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
        document.head.appendChild(style);
    }
}
NotificationSystem.ICONS = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️'
};
NotificationSystem.COLORS = {
    success: '#48bb78',
    error: '#f56565',
    info: '#4299e1',
    warning: '#ed8936'
};
class FileHandler {
    static saveResumeToFile(data) {
        try {
            const jsonString = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = this.generateFilename(data.fullName);
            downloadLink.style.display = 'none';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(url);
        }
        catch (error) {
            throw new Error(`Failed to save resume: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    static loadResumeFromFile(onSuccess, onError) {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json,application/json';
        fileInput.style.display = 'none';
        fileInput.addEventListener('change', (event) => {
            const target = event.target;
            const file = target.files?.[0];
            if (!file) {
                onError('No file selected');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                onError('File size too large. Please select a file smaller than 5MB');
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const content = e.target?.result;
                    const data = JSON.parse(content);
                    if (!this.isValidResumeData(data)) {
                        onError('Invalid resume file format');
                        return;
                    }
                    onSuccess(data);
                }
                catch (parseError) {
                    onError('Failed to parse resume file. Please check if it\'s a valid JSON file.');
                }
            };
            reader.onerror = () => {
                onError('Failed to read the selected file');
            };
            reader.readAsText(file);
        });
        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
    }
    static generateFilename(fullName) {
        const date = new Date().toISOString().split('T')[0];
        const sanitizedName = fullName
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
        return `resume-${sanitizedName || 'untitled'}-${date}.json`;
    }
    static isValidResumeData(data) {
        if (!data || typeof data !== 'object')
            return false;
        const requiredStringFields = ['fullName', 'title', 'email', 'phone', 'summary'];
        for (const field of requiredStringFields) {
            if (typeof data[field] !== 'string')
                return false;
        }
        if (!Array.isArray(data.work) || !Array.isArray(data.education))
            return false;
        return true;
    }
}
class PDFExporter {
    static exportToPDF(data, previewElement) {
        this.showExportDialog(data, previewElement);
    }
    static showExportDialog(data, previewElement) {
        const modal = document.createElement('div');
        modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
    `;
        const dialog = document.createElement('div');
        dialog.style.cssText = `
      background: white;
      padding: 2rem;
      border-radius: 15px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
      text-align: center;
      max-width: 400px;
      width: 90%;
    `;
        dialog.innerHTML = `
      <h3 style="margin-bottom: 1rem; color: #2d3748;">Export Resume as PDF</h3>
      <p style="margin-bottom: 2rem; color: #4a5568;">Choose how you'd like to export your resume:</p>
      
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <button id="downloadPdfBtn" class="btn btn-primary" style="width: 100%;">
          📄 Download PDF Directly
        </button>
        <button id="printPdfBtn" class="btn btn-secondary" style="width: 100%;">
          🖨️ Print/Save as PDF
        </button>
        <button id="cancelExportBtn" class="btn" style="background: #e2e8f0; color: #4a5568; width: 100%;">
          ❌ Cancel
        </button>
      </div>
    `;
        modal.appendChild(dialog);
        document.body.appendChild(modal);
        const downloadBtn = dialog.querySelector('#downloadPdfBtn');
        const printBtn = dialog.querySelector('#printPdfBtn');
        const cancelBtn = dialog.querySelector('#cancelExportBtn');
        downloadBtn.addEventListener('click', () => {
            modal.remove();
            this.generateAndDownloadPDF(data, previewElement);
        });
        printBtn.addEventListener('click', () => {
            modal.remove();
            this.openPrintDialog(data, previewElement);
        });
        cancelBtn.addEventListener('click', () => {
            modal.remove();
        });
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    static generateAndDownloadPDF(data, previewElement) {
        try {
            const htmlContent = this.generatePDFHTML(data, previewElement.innerHTML);
            const blob = new Blob([htmlContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const filename = this.generatePDFFilename(data.fullName);
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = filename.replace('.pdf', '.html');
            downloadLink.style.display = 'none';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(url);
            NotificationSystem.show('Resume HTML downloaded! Open it and print to PDF from your browser.', 'success');
        }
        catch (error) {
            throw new Error('Failed to generate PDF download');
        }
    }
    static openPrintDialog(data, previewElement) {
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            throw new Error('Failed to open print window. Please check if pop-ups are blocked.');
        }
        try {
            const htmlContent = this.generatePDFHTML(data, previewElement.innerHTML);
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
    static generatePDFHTML(data, previewHTML) {
        return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Resume - ${data.fullName || 'Untitled'}</title>
        <style>
          body { 
            font-family: 'Times New Roman', serif; 
            line-height: 1.4; 
            margin: 20px; 
            color: #333; 
            background: white;
          }
          .resume-header { 
            text-align: center; 
            border-bottom: 2px solid #333; 
            padding-bottom: 15px; 
            margin-bottom: 20px; 
          }
          .resume-header h1 { 
            font-size: 24px; 
            margin-bottom: 8px; 
            color: #000; 
          }
          .resume-header h2 { 
            font-size: 16px; 
            color: #666; 
            margin-bottom: 8px; 
          }
          .contact-info { 
            font-size: 12px; 
            color: #666; 
            display: flex;
            justify-content: center;
            gap: 20px;
            flex-wrap: wrap;
          }
          .resume-section { 
            margin-bottom: 20px; 
            page-break-inside: avoid;
          }
          .resume-section h3 { 
            font-size: 14px; 
            text-transform: uppercase; 
            border-bottom: 1px solid #ccc; 
            margin-bottom: 10px; 
            font-weight: bold;
          }
          .resume-section p {
            margin-bottom: 8px;
            text-align: justify;
          }
          .work-item, .education-item { 
            margin-bottom: 15px; 
            padding-left: 10px; 
            border-left: 2px solid #eee; 
            page-break-inside: avoid;
          }
          .item-header { 
            display: flex; 
            justify-content: space-between; 
            margin-bottom: 5px; 
          }
          .item-title { 
            font-weight: bold; 
          }
          .item-company { 
            color: #666; 
            font-style: italic; 
          }
          .item-date { 
            color: #666; 
            font-size: 12px; 
            white-space: nowrap;
          }
          .item-description { 
            margin-top: 5px; 
            color: #555; 
            text-align: justify;
          }
          .empty-state { 
            display: none; 
          }
          
          /* Print optimizations */
          @media print {
            body { 
              margin: 0; 
              padding: 15mm;
            }
            .resume-section,
            .work-item,
            .education-item {
              page-break-inside: avoid;
            }
          }
          
          /* For smaller screens */
          @media (max-width: 600px) {
            .contact-info {
              flex-direction: column;
              gap: 5px;
            }
            .item-header {
              flex-direction: column;
            }
            .item-date {
              margin-top: 2px;
            }
          }
        </style>
      </head>
      <body>
        ${previewHTML}
      </body>
      </html>
    `;
    }
    static generatePDFFilename(fullName) {
        const date = new Date().toISOString().split('T')[0];
        const sanitizedName = fullName
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
        return `resume-${sanitizedName || 'untitled'}-${date}.pdf`;
    }
}
class FormManager {
    constructor(elements) {
        this.workIndex = 0;
        this.educationIndex = 0;
        this.elements = elements;
        this.setupGlobalHandlers();
    }
    setupGlobalHandlers() {
        window.removeItem = (button) => {
            button.parentElement?.remove();
            document.dispatchEvent(new CustomEvent('formDataChanged'));
        };
    }
    getFormData() {
        const fullName = this.elements.fullName.value.trim();
        const title = this.elements.title.value.trim();
        const email = this.elements.email.value.trim();
        const phone = this.elements.phone.value.trim();
        const summary = this.elements.summary.value.trim();
        const work = this.collectWorkExperience();
        const education = this.collectEducation();
        return { fullName, title, email, phone, summary, work, education };
    }
    collectWorkExperience() {
        const workItems = [];
        const workElements = this.elements.workContainer.querySelectorAll('.dynamic-item');
        workElements.forEach(item => {
            const company = item.querySelector('input[name="workCompany"]')?.value?.trim() || '';
            const role = item.querySelector('input[name="workRole"]')?.value?.trim() || '';
            const start = item.querySelector('input[name="workStart"]')?.value?.trim() || '';
            const end = item.querySelector('input[name="workEnd"]')?.value?.trim() || '';
            const description = item.querySelector('textarea[name="workDescription"]')?.value?.trim() || '';
            if (company || role) {
                workItems.push({ company, role, start, end, description });
            }
        });
        return workItems;
    }
    collectEducation() {
        const educationItems = [];
        const educationElements = this.elements.educationContainer.querySelectorAll('.dynamic-item');
        educationElements.forEach(item => {
            const school = item.querySelector('input[name="educationSchool"]')?.value?.trim() || '';
            const degree = item.querySelector('input[name="educationDegree"]')?.value?.trim() || '';
            const start = item.querySelector('input[name="educationStart"]')?.value?.trim() || '';
            const end = item.querySelector('input[name="educationEnd"]')?.value?.trim() || '';
            if (school || degree) {
                educationItems.push({ school, degree, start, end });
            }
        });
        return educationItems;
    }
    loadFormData(data) {
        this.elements.fullName.value = data.fullName || '';
        this.elements.title.value = data.title || '';
        this.elements.email.value = data.email || '';
        this.elements.phone.value = data.phone || '';
        this.elements.summary.value = data.summary || '';
        this.elements.workContainer.innerHTML = '';
        this.elements.educationContainer.innerHTML = '';
        this.workIndex = 0;
        this.educationIndex = 0;
        if (data.work && Array.isArray(data.work)) {
            data.work.forEach(work => {
                this.addWorkExperience();
                this.populateLastWorkItem(work);
            });
        }
        if (data.education && Array.isArray(data.education)) {
            data.education.forEach(edu => {
                this.addEducation();
                this.populateLastEducationItem(edu);
            });
        }
    }
    addWorkExperience() {
        const workItem = this.createWorkExperienceElement();
        this.elements.workContainer.appendChild(workItem);
        this.workIndex++;
    }
    createWorkExperienceElement() {
        const workItem = document.createElement('div');
        workItem.className = 'dynamic-item';
        workItem.innerHTML = `
      <button type="button" class="remove-btn" onclick="removeItem(this)" aria-label="Remove work experience">×</button>
      <div class="form-group">
        <label>Company *</label>
        <input type="text" name="workCompany" placeholder="Company Name" required />
      </div>
      <div class="form-group">
        <label>Job Title *</label>
        <input type="text" name="workRole" placeholder="Software Engineer" required />
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
        <div class="form-group">
          <label>Start Date</label>
          <input type="text" name="workStart" placeholder="Jan 2020" />
        </div>
        <div class="form-group">
          <label>End Date</label>
          <input type="text" name="workEnd" placeholder="Present" />
        </div>
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea name="workDescription" rows="3" placeholder="Describe your responsibilities and achievements..."></textarea>
      </div>
    `;
        return workItem;
    }
    addEducation() {
        const educationItem = this.createEducationElement();
        this.elements.educationContainer.appendChild(educationItem);
        this.educationIndex++;
    }
    createEducationElement() {
        const educationItem = document.createElement('div');
        educationItem.className = 'dynamic-item';
        educationItem.innerHTML = `
      <button type="button" class="remove-btn" onclick="removeItem(this)" aria-label="Remove education">×</button>
      <div class="form-group">
        <label>School/University *</label>
        <input type="text" name="educationSchool" placeholder="University Name" required />
      </div>
      <div class="form-group">
        <label>Degree *</label>
        <input type="text" name="educationDegree" placeholder="Bachelor of Science in Computer Science" required />
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
        <div class="form-group">
          <label>Start Date</label>
          <input type="text" name="educationStart" placeholder="2016" />
        </div>
        <div class="form-group">
          <label>End Date</label>
          <input type="text" name="educationEnd" placeholder="2020" />
        </div>
      </div>
    `;
        return educationItem;
    }
    populateLastWorkItem(work) {
        const workItems = this.elements.workContainer.querySelectorAll('.dynamic-item');
        const lastItem = workItems[workItems.length - 1];
        if (lastItem) {
            lastItem.querySelector('input[name="workCompany"]').value = work.company || '';
            lastItem.querySelector('input[name="workRole"]').value = work.role || '';
            lastItem.querySelector('input[name="workStart"]').value = work.start || '';
            lastItem.querySelector('input[name="workEnd"]').value = work.end || '';
            lastItem.querySelector('textarea[name="workDescription"]').value = work.description || '';
        }
    }
    populateLastEducationItem(edu) {
        const eduItems = this.elements.educationContainer.querySelectorAll('.dynamic-item');
        const lastItem = eduItems[eduItems.length - 1];
        if (lastItem) {
            lastItem.querySelector('input[name="educationSchool"]').value = edu.school || '';
            lastItem.querySelector('input[name="educationDegree"]').value = edu.degree || '';
            lastItem.querySelector('input[name="educationStart"]').value = edu.start || '';
            lastItem.querySelector('input[name="educationEnd"]').value = edu.end || '';
        }
    }
}
class PreviewRenderer {
    constructor(container) {
        this.container = container;
    }
    render(data) {
        if (!this.container) {
            console.error('Preview container not found');
            return;
        }
        const html = this.generateHTML(data);
        this.container.innerHTML = html;
    }
    generateHTML(data) {
        if (this.isEmpty(data)) {
            return this.renderEmptyState();
        }
        let html = this.renderHeader(data);
        html += this.renderSummary(data.summary);
        html += this.renderWorkExperience(data.work);
        html += this.renderEducation(data.education);
        return html;
    }
    isEmpty(data) {
        return !data.fullName.trim() &&
            !data.title.trim() &&
            !data.email.trim() &&
            !data.phone.trim() &&
            !data.summary.trim() &&
            data.work.length === 0 &&
            data.education.length === 0;
    }
    renderEmptyState() {
        return `
      <div class="empty-state">
        <p>Your resume preview will appear here as you fill out the form</p>
      </div>
    `;
    }
    renderHeader(data) {
        const contactInfo = this.renderContactInfo(data);
        return `
      <div class="resume-header">
        <h1>${this.escapeHtml(data.fullName) || 'Your Name'}</h1>
        ${data.title ? `<h2>${this.escapeHtml(data.title)}</h2>` : ''}
        ${contactInfo ? `<div class="contact-info">${contactInfo}</div>` : ''}
      </div>
    `;
    }
    renderContactInfo(data) {
        const contactItems = [];
        if (data.email.trim()) {
            contactItems.push(`<span>📧 ${this.escapeHtml(data.email)}</span>`);
        }
        if (data.phone.trim()) {
            contactItems.push(`<span>📞 ${this.escapeHtml(data.phone)}</span>`);
        }
        return contactItems.join('');
    }
    renderSummary(summary) {
        if (!summary.trim()) {
            return '';
        }
        return `
      <div class="resume-section">
        <h3>Professional Summary</h3>
        <p>${this.escapeHtml(summary).replace(/\n/g, '<br>')}</p>
      </div>
    `;
    }
    renderWorkExperience(workItems) {
        if (workItems.length === 0) {
            return '';
        }
        let html = `
      <div class="resume-section">
        <h3>Work Experience</h3>
    `;
        workItems.forEach(work => {
            html += this.renderWorkItem(work);
        });
        html += '</div>';
        return html;
    }
    renderWorkItem(work) {
        const dateRange = this.formatDateRange(work.start, work.end);
        return `
      <div class="work-item">
        <div class="item-header">
          <div>
            <div class="item-title">${this.escapeHtml(work.role) || 'Job Title'}</div>
            <div class="item-company">${this.escapeHtml(work.company) || 'Company Name'}</div>
          </div>
          ${dateRange ? `<div class="item-date">${dateRange}</div>` : ''}
        </div>
        ${work.description ? `
          <div class="item-description">
            ${this.escapeHtml(work.description).replace(/\n/g, '<br>')}
          </div>
        ` : ''}
      </div>
    `;
    }
    renderEducation(educationItems) {
        if (educationItems.length === 0) {
            return '';
        }
        let html = `
      <div class="resume-section">
        <h3>Education</h3>
    `;
        educationItems.forEach(edu => {
            html += this.renderEducationItem(edu);
        });
        html += '</div>';
        return html;
    }
    renderEducationItem(edu) {
        const dateRange = this.formatDateRange(edu.start, edu.end);
        return `
      <div class="education-item">
        <div class="item-header">
          <div>
            <div class="item-title">${this.escapeHtml(edu.degree) || 'Degree'}</div>
            <div class="item-company">${this.escapeHtml(edu.school) || 'School/University'}</div>
          </div>
          ${dateRange ? `<div class="item-date">${dateRange}</div>` : ''}
        </div>
      </div>
    `;
    }
    formatDateRange(start, end) {
        const startDate = start?.trim();
        const endDate = end?.trim();
        if (!startDate && !endDate) {
            return '';
        }
        if (startDate && endDate) {
            return `${startDate} — ${endDate}`;
        }
        if (startDate && !endDate) {
            return `${startDate} — Present`;
        }
        if (!startDate && endDate) {
            return endDate;
        }
        return '';
    }
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
class ResumeBuilder {
    constructor() {
        this.elements = this.getFormElements();
        this.formManager = new FormManager(this.elements);
        this.previewRenderer = new PreviewRenderer(this.elements.preview);
        this.initializeEventListeners();
        this.updatePreview();
    }
    getFormElements() {
        const getElementById = (id) => {
            const element = document.getElementById(id);
            if (!element) {
                throw new Error(`Element with id '${id}' not found`);
            }
            return element;
        };
        return {
            fullName: getElementById('fullName'),
            title: getElementById('title'),
            email: getElementById('email'),
            phone: getElementById('phone'),
            summary: getElementById('summary'),
            workContainer: getElementById('workContainer'),
            educationContainer: getElementById('educationContainer'),
            preview: getElementById('resumePreview')
        };
    }
    initializeEventListeners() {
        const form = document.getElementById('resumeForm');
        form.addEventListener('input', () => this.updatePreview());
        form.addEventListener('change', () => this.updatePreview());
        this.setupButtonListeners();
        this.setupKeyboardShortcuts();
    }
    setupButtonListeners() {
        document.getElementById('addWorkBtn')?.addEventListener('click', () => {
            this.formManager.addWorkExperience();
            this.updatePreview();
        });
        document.getElementById('addEducationBtn')?.addEventListener('click', () => {
            this.formManager.addEducation();
            this.updatePreview();
        });
        document.getElementById('saveBtn')?.addEventListener('click', () => {
            this.handleSave();
        });
        document.getElementById('loadBtn')?.addEventListener('click', () => {
            this.handleLoad();
        });
        document.getElementById('exportPdfBtn')?.addEventListener('click', () => {
            this.handleExportPDF();
        });
    }
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (event) => {
            if ((event.ctrlKey || event.metaKey) && event.key === 's') {
                event.preventDefault();
                this.handleSave();
            }
            if ((event.ctrlKey || event.metaKey) && event.key === 'o') {
                event.preventDefault();
                this.handleLoad();
            }
            if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
                event.preventDefault();
                this.handleExportPDF();
            }
        });
    }
    updatePreview() {
        try {
            const data = this.formManager.getFormData();
            this.previewRenderer.render(data);
        }
        catch (error) {
            console.error('Error updating preview:', error);
            NotificationSystem.show('Failed to update preview', 'error');
        }
    }
    handleSave() {
        try {
            const data = this.formManager.getFormData();
            if (!data.fullName.trim()) {
                NotificationSystem.show('Please enter your full name before saving', 'error');
                this.elements.fullName.focus();
                return;
            }
            FileHandler.saveResumeToFile(data);
            NotificationSystem.show('Resume saved successfully!', 'success');
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to save resume';
            NotificationSystem.show(errorMessage, 'error');
        }
    }
    handleLoad() {
        FileHandler.loadResumeFromFile((data) => {
            try {
                this.formManager.loadFormData(data);
                this.updatePreview();
                NotificationSystem.show('Resume loaded successfully!', 'success');
            }
            catch (error) {
                NotificationSystem.show('Failed to load resume data into form', 'error');
            }
        }, (error) => {
            NotificationSystem.show(`Failed to load resume: ${error}`, 'error');
        });
    }
    handleExportPDF() {
        try {
            const data = this.formManager.getFormData();
            if (!data.fullName.trim()) {
                NotificationSystem.show('Please enter your full name before exporting', 'error');
                this.elements.fullName.focus();
                return;
            }
            PDFExporter.exportToPDF(data, this.elements.preview);
            NotificationSystem.show('PDF export initiated - check your browser\'s print dialog', 'success');
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to export PDF';
            NotificationSystem.show(errorMessage, 'error');
        }
    }
    getResumeData() {
        return this.formManager.getFormData();
    }
    loadResumeData(data) {
        this.formManager.loadFormData(data);
        this.updatePreview();
    }
}
function initializeApp() {
    try {
        NotificationSystem.initializeStyles();
        const requiredElements = [
            'resumeForm', 'fullName', 'title', 'email', 'phone', 'summary',
            'workContainer', 'educationContainer', 'addWorkBtn', 'addEducationBtn',
            'saveBtn', 'loadBtn', 'exportPdfBtn', 'resumePreview'
        ];
        const missingElements = [];
        for (const elementId of requiredElements) {
            if (!document.getElementById(elementId)) {
                missingElements.push(elementId);
            }
        }
        if (missingElements.length > 0) {
            throw new Error(`Missing required DOM elements: ${missingElements.join(', ')}`);
        }
        new ResumeBuilder();
        console.log('Resume Builder initialized successfully');
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown initialization error';
        NotificationSystem.show(`Failed to initialize Resume Builder: ${errorMessage}`, 'error');
        console.error('Initialization error:', error);
    }
}
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    NotificationSystem.show('An unexpected error occurred. Please refresh the page.', 'error');
});
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    NotificationSystem.show('An unexpected error occurred. Please refresh the page.', 'error');
    event.preventDefault();
});
document.addEventListener('DOMContentLoaded', initializeApp);
window.__RESUME_BUILDER_VERSION__ = '1.0.0';
