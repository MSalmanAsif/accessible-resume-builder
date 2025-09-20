export function saveResumeToFile(data, filename) {
    try {
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], {
            type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const finalFilename = filename || generateFilename(data.fullName);
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = finalFilename;
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
export function loadResumeFromFile(onSuccess, onError) {
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
        if (!isValidJsonFile(file)) {
            onError('Please select a valid JSON file');
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
                if (!isValidResumeData(data)) {
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
function generateFilename(fullName) {
    const date = new Date().toISOString().split('T')[0];
    const sanitizedName = fullName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    return `resume-${sanitizedName || 'untitled'}-${date}.json`;
}
function isValidJsonFile(file) {
    const validTypes = ['application/json', 'text/json'];
    const validExtensions = ['.json'];
    if (validTypes.includes(file.type)) {
        return true;
    }
    const fileName = file.name.toLowerCase();
    return validExtensions.some(ext => fileName.endsWith(ext));
}
function isValidResumeData(data) {
    if (!data || typeof data !== 'object') {
        return false;
    }
    const requiredStringFields = ['fullName', 'title', 'email', 'phone', 'summary'];
    for (const field of requiredStringFields) {
        if (typeof data[field] !== 'string') {
            return false;
        }
    }
    if (!Array.isArray(data.work)) {
        return false;
    }
    if (!Array.isArray(data.education)) {
        return false;
    }
    for (const work of data.work) {
        if (!isValidWorkItem(work)) {
            return false;
        }
    }
    for (const edu of data.education) {
        if (!isValidEducationItem(edu)) {
            return false;
        }
    }
    return true;
}
function isValidWorkItem(item) {
    if (!item || typeof item !== 'object')
        return false;
    const requiredFields = ['company', 'role', 'start'];
    for (const field of requiredFields) {
        if (typeof item[field] !== 'string') {
            return false;
        }
    }
    if (item.end !== undefined && typeof item.end !== 'string')
        return false;
    if (item.description !== undefined && typeof item.description !== 'string')
        return false;
    return true;
}
function isValidEducationItem(item) {
    if (!item || typeof item !== 'object')
        return false;
    const requiredFields = ['school', 'degree', 'start'];
    for (const field of requiredFields) {
        if (typeof item[field] !== 'string') {
            return false;
        }
    }
    if (item.end !== undefined && typeof item.end !== 'string')
        return false;
    return true;
}
export const exportFormats = {
    json: saveResumeToFile,
};
export const importFormats = {
    json: loadResumeFromFile,
};
