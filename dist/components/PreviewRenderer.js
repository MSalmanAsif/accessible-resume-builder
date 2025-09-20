export class PreviewRenderer {
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
    getHTML() {
        return this.container.innerHTML;
    }
    clear() {
        this.container.innerHTML = this.renderEmptyState();
    }
    updateSection(sectionType, data) {
        console.warn('Partial updates not implemented yet, using full re-render');
    }
    setTheme(theme) {
        this.container.className = `resume-preview theme-${theme}`;
    }
    exportForPDF() {
        return this.container.innerHTML;
    }
}
