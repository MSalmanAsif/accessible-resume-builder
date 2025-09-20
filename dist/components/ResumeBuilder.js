import { FormManager } from './FormManager';
import { PreviewRenderer } from './PreviewRenderer';
import { saveResumeToFile, loadResumeFromFile } from '../utils/fileHandling';
import { showSuccess, showError } from '../utils/notifications';
import { exportToPDF } from '../utils/pdfExport';
export class ResumeBuilder {
    constructor(config = {}) {
        this.config = config;
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
            showError('Failed to update preview');
        }
    }
    handleSave() {
        try {
            const data = this.formManager.getFormData();
            if (!data.fullName.trim()) {
                showError('Please enter your full name before saving');
                this.elements.fullName.focus();
                return;
            }
            saveResumeToFile(data);
            showSuccess('Resume saved successfully!');
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to save resume';
            showError(errorMessage);
        }
    }
    handleLoad() {
        loadResumeFromFile((data) => {
            try {
                this.formManager.loadFormData(data);
                this.updatePreview();
                showSuccess('Resume loaded successfully!');
            }
            catch (error) {
                showError('Failed to load resume data into form');
            }
        }, (error) => {
            showError(`Failed to load resume: ${error}`);
        });
    }
    handleExportPDF() {
        try {
            const data = this.formManager.getFormData();
            if (!data.fullName.trim()) {
                showError('Please enter your full name before exporting');
                this.elements.fullName.focus();
                return;
            }
            exportToPDF(data, this.elements.preview);
            showSuccess('PDF export initiated - check your browser\'s print dialog');
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to export PDF';
            showError(errorMessage);
        }
    }
    getResumeData() {
        return this.formManager.getFormData();
    }
    loadResumeData(data) {
        this.formManager.loadFormData(data);
        this.updatePreview();
    }
    clearForm() {
        this.formManager.clearForm();
        this.updatePreview();
        showSuccess('Form cleared');
    }
    validateForm() {
        return this.formManager.validateForm();
    }
}
