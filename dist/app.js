import { readForm, renderPreview } from "./ui";
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("resume-form");
    const previewDiv = document.getElementById("preview");
    const downloadBtn = document.getElementById("download");
    // Initial preview
    renderPreview(previewDiv, {
        name: "",
        email: "",
        phone: "",
        summary: "",
        experience: "",
        education: "",
        skills: "",
    });
    // Live update on typing
    form.addEventListener("input", () => {
        const data = readForm(form);
        renderPreview(previewDiv, data);
    });
    // For now, download just triggers print dialog
    downloadBtn.addEventListener("click", (e) => {
        e.preventDefault();
        window.print();
    });
});
