// Read form data
export function readForm(form) {
    return {
        name: (form.querySelector("#name")?.value || "").trim(),
        email: (form.querySelector("#email")?.value || "").trim(),
        phone: (form.querySelector("#phone")?.value || "").trim(),
        summary: (form.querySelector("#summary")?.value || "").trim(),
        experience: (form.querySelector("#experience")?.value || "").trim(),
        education: (form.querySelector("#education")?.value || "").trim(),
        skills: (form.querySelector("#skills")?.value || "").trim(),
    };
}
// Render resume preview
export function renderPreview(container, data) {
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
