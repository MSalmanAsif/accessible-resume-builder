export class FormManager {
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
    clearForm() {
        this.elements.fullName.value = '';
        this.elements.title.value = '';
        this.elements.email.value = '';
        this.elements.phone.value = '';
        this.elements.summary.value = '';
        this.elements.workContainer.innerHTML = '';
        this.elements.educationContainer.innerHTML = '';
        this.workIndex = 0;
        this.educationIndex = 0;
    }
    validateForm() {
        const errors = [];
        const data = this.getFormData();
        if (!data.fullName.trim()) {
            errors.push('Full name is required');
        }
        if (data.email && !this.isValidEmail(data.email)) {
            errors.push('Please enter a valid email address');
        }
        if (data.phone && !this.isValidPhone(data.phone)) {
            errors.push('Please enter a valid phone number');
        }
        data.work.forEach((work, index) => {
            if (work.company && !work.role) {
                errors.push(`Work experience ${index + 1}: Job title is required when company is specified`);
            }
            if (work.role && !work.company) {
                errors.push(`Work experience ${index + 1}: Company is required when job title is specified`);
            }
        });
        data.education.forEach((edu, index) => {
            if (edu.school && !edu.degree) {
                errors.push(`Education ${index + 1}: Degree is required when school is specified`);
            }
            if (edu.degree && !edu.school) {
                errors.push(`Education ${index + 1}: School is required when degree is specified`);
            }
        });
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
        return phoneRegex.test(phone);
    }
}
