export type ResumeData = {
  name: string;
  email: string;
  phone: string;
  summary: string;
  experience: string;
  education: string;
  skills: string;
};

// Read form data
export function readForm(form: HTMLFormElement): ResumeData {
  return {
    name: (form.querySelector<HTMLInputElement>("#name")?.value || "").trim(),
    email: (form.querySelector<HTMLInputElement>("#email")?.value || "").trim(),
    phone: (form.querySelector<HTMLInputElement>("#phone")?.value || "").trim(),
    summary: (form.querySelector<HTMLTextAreaElement>("#summary")?.value || "").trim(),
    experience: (form.querySelector<HTMLTextAreaElement>("#experience")?.value || "").trim(),
    education: (form.querySelector<HTMLTextAreaElement>("#education")?.value || "").trim(),
    skills: (form.querySelector<HTMLTextAreaElement>("#skills")?.value || "").trim(),
  };
}

// Render resume preview
export function renderPreview(container: HTMLElement, data: ResumeData) {
  container.innerHTML = `
    <h2>${data.name || "Your Name"}</h2>
    <p><strong>Email:</strong> ${data.email || "-"}</p>
    <p><strong>Phone:</strong> ${data.phone || "-"}</p>
    <h3>Summary</h3>
    <p>${data.summary || "Write a short professional summary here."}</p>
    <h3>Experience</h3>
    <p>${data.experience || "Add your work experience here."}</p>
    <h3>Education</h3>
    <p>${data.education || "Add your education details here."}</p>
    <h3>Skills</h3>
    <p>${data.skills || "List your skills here."}</p>
  `;
}
