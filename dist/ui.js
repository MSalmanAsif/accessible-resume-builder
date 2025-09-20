// Read all form data and return structured resume data
export function readForm() {
    // Get basic information
    const fullName = document.getElementById('fullName')?.value || '';
    const title = document.getElementById('title')?.value || '';
    const email = document.getElementById('email')?.value || '';
    const phone = document.getElementById('phone')?.value || '';
    const summary = document.getElementById('summary')?.value || '';
    // Collect work experience from dynamic items
    const work = [];
    const workItems = document.querySelectorAll('#workContainer .dynamic-item');
    workItems.forEach(item => {
        const company = item.querySelector('input[name="workCompany"]')?.value || '';
        const role = item.querySelector('input[name="workRole"]')?.value || '';
        const start = item.querySelector('input[name="workStart"]')?.value || '';
        const end = item.querySelector('input[name="workEnd"]')?.value || '';
        const description = item.querySelector('textarea[name="workDescription"]')?.value || '';
        if (company || role) {
            work.push({ company, role, start, end, description });
        }
    });
    // Collect education from dynamic items
    const education = [];
    const educationItems = document.querySelectorAll('#educationContainer .dynamic-item');
    educationItems.forEach(item => {
        const school = item.querySelector('input[name="educationSchool"]')?.value || '';
        const degree = item.querySelector('input[name="educationDegree"]')?.value || '';
        const start = item.querySelector('input[name="educationStart"]')?.value || '';
        const end = item.querySelector('input[name="educationEnd"]')?.value || '';
        if (school || degree) {
            education.push({ school, degree, start, end });
        }
    });
    return {
        fullName,
        title,
        email,
        phone,
        summary,
        work,
        education
    };
}
// Render the resume preview from data
export function renderPreview(container, data) {
    let html = `
    <div class="resume-header">
      <h1>${data.fullName || 'Your Name'}</h1>
      ${data.title ? `<h2>${data.title}</h2>` : ''}
      <div class="contact-info">
        ${data.email ? `<span>📧 ${data.email}</span>` : ''}
        ${data.phone ? `<span>📞 ${data.phone}</span>` : ''}
      </div>
    </div>
  `;
    // Add summary section if exists
    if (data.summary) {
        html += `
      <div class="resume-section">
        <h3>Professional Summary</h3>
        <p>${data.summary}</p>
      </div>
    `;
    }
    // Add work experience section if exists
    if (data.work.length > 0) {
        html += `
      <div class="resume-section">
        <h3>Work Experience</h3>
    `;
        data.work.forEach(work => {
            html += `
        <div class="work-item">
          <div class="item-header">
            <div>
              <div class="item-title">${work.role || 'Job Title'}</div>
              <div class="item-company">${work.company || 'Company Name'}</div>
            </div>
            <div class="item-date">${work.start || ''} ${work.start && work.end ? '—' : ''} ${work.end || ''}</div>
          </div>
          ${work.description ? `<div class="item-description">${work.description}</div>` : ''}
        </div>
      `;
        });
        html += '</div>';
    }
    // Add education section if exists
    if (data.education.length > 0) {
        html += `
      <div class="resume-section">
        <h3>Education</h3>
    `;
        data.education.forEach(edu => {
            html += `
        <div class="education-item">
          <div class="item-header">
            <div>
              <div class="item-title">${edu.degree || 'Degree'}</div>
              <div class="item-company">${edu.school || 'School/University'}</div>
            </div>
            <div class="item-date">${edu.start || ''} ${edu.start && edu.end ? '—' : ''} ${edu.end || ''}</div>
          </div>
        </div>
      `;
        });
        html += '</div>';
    }
    // Show empty state if no data
    const hasData = data.fullName || data.title || data.email || data.phone ||
        data.summary || data.work.length > 0 || data.education.length > 0;
    if (!hasData) {
        html = `
      <div class="empty-state">
        <p>Your resume preview will appear here as you fill out the form</p>
      </div>
    `;
    }
    container.innerHTML = html;
}
// Add work experience item to form
export function addWorkExperience() {
    const container = document.getElementById('workContainer');
    if (!container)
        return;
    const workItem = document.createElement('div');
    workItem.className = 'dynamic-item';
    workItem.innerHTML = `
    <button type="button" class="remove-btn" onclick="this.parentElement.remove(); updatePreview()">×</button>
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
    container.appendChild(workItem);
}
// Add education item to form
export function addEducation() {
    const container = document.getElementById('educationContainer');
    if (!container)
        return;
    const educationItem = document.createElement('div');
    educationItem.className = 'dynamic-item';
    educationItem.innerHTML = `
    <button type="button" class="remove-btn" onclick="this.parentElement.remove(); updatePreview()">×</button>
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
    container.appendChild(educationItem);
}
// Save resume data as JSON file
export function saveResume(data) {
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.fullName || 'resume'}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
// Load resume data from JSON file
export function loadResume(callback, errorCallback) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target?.result);
                    callback(data);
                }
                catch (error) {
                    errorCallback('Error parsing resume file');
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
}
// Load resume data into form fields
export function loadResumeData(data) {
    // Load basic info
    document.getElementById('fullName').value = data.fullName || '';
    document.getElementById('title').value = data.title || '';
    document.getElementById('email').value = data.email || '';
    document.getElementById('phone').value = data.phone || '';
    document.getElementById('summary').value = data.summary || '';
    // Clear existing dynamic items
    const workContainer = document.getElementById('workContainer');
    const educationContainer = document.getElementById('educationContainer');
    if (workContainer)
        workContainer.innerHTML = '';
    if (educationContainer)
        educationContainer.innerHTML = '';
    // Load work experience
    if (data.work) {
        data.work.forEach(work => {
            addWorkExperience();
            const workItems = document.querySelectorAll('#workContainer .dynamic-item');
            const lastItem = workItems[workItems.length - 1];
            lastItem.querySelector('input[name="workCompany"]').value = work.company || '';
            lastItem.querySelector('input[name="workRole"]').value = work.role || '';
            lastItem.querySelector('input[name="workStart"]').value = work.start || '';
            lastItem.querySelector('input[name="workEnd"]').value = work.end || '';
            lastItem.querySelector('textarea[name="workDescription"]').value = work.description || '';
        });
    }
    // Load education
    if (data.education) {
        data.education.forEach(edu => {
            addEducation();
            const eduItems = document.querySelectorAll('#educationContainer .dynamic-item');
            const lastItem = eduItems[eduItems.length - 1];
            lastItem.querySelector('input[name="educationSchool"]').value = edu.school || '';
            lastItem.querySelector('input[name="educationDegree"]').value = edu.degree || '';
            lastItem.querySelector('input[name="educationStart"]').value = edu.start || '';
            lastItem.querySelector('input[name="educationEnd"]').value = edu.end || '';
        });
    }
}
// Export resume as PDF (uses print dialog)
export function exportPDF(data) {
    const printWindow = window.open('', '_blank');
    if (!printWindow)
        return;
    printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Resume - ${data.fullName}</title>
      <style>
        body { font-family: 'Times New Roman', serif; line-height: 1.4; margin: 20px; }
        .resume-header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
        .resume-header h1 { font-size: 24px; margin-bottom: 5px; }
        .resume-header h2 { font-size: 16px; color: #666; margin-bottom: 5px; }
        .contact-info { font-size: 14px; color: #666; }
        .resume-section { margin-bottom: 20px; }
        .resume-section h3 { font-size: 14px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #ccc; margin-bottom: 10px; }
        .work-item, .education-item { margin-bottom: 15px; padding-left: 10px; border-left: 2px solid #eee; }
        .item-header { display: flex; justify-content: space-between; margin-bottom: 5px; }
        .item-title { font-weight: bold; }
        .item-company { color: #666; font-style: italic; }
        .item-date { color: #666; font-size: 12px; }
        .item-description { margin-top: 5px; color: #555; }
      </style>
    </head>
    <body>
      ${document.getElementById('resumePreview')?.innerHTML || ''}
    </body>
    </html>
  `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 250);
}
// Show notification to user
export function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
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
    background: ${type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#4299e1'};
  `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
// Global function for remove buttons (called from onclick)
window.updatePreview = () => {
    const container = document.getElementById('resumePreview');
    if (container) {
        const data = readForm();
        renderPreview(container, data);
    }
};
