import { readForm, renderPreview } from "./ui";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("resume-form") as HTMLFormElement;
  const previewDiv = document.getElementById("preview") as HTMLDivElement;
  const downloadBtn = document.getElementById("download") as HTMLButtonElement;

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
