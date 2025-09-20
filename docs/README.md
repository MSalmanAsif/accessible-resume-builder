# 🚀 Accessible Resume Builder

A modern, responsive web application for creating professional resumes with live preview functionality. Built with TypeScript and featuring a beautiful glassmorphism UI design.

![Resume Builder Demo](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)

## ✨ Features

### 🎨 **Modern UI/UX**
- Beautiful gradient background with glassmorphism effects
- Smooth animations and hover transitions
- Fully responsive design (mobile, tablet, desktop)
- Professional color scheme and typography

### ⚡ **Live Functionality**
- **Real-time Preview**: See changes instantly as you type
- **Dynamic Sections**: Add/remove work experience and education entries
- **Form Validation**: Smart validation with user-friendly error messages
- **Auto-formatting**: Professional resume layout with proper spacing

### 💾 **Import/Export Options**
- **Save Resume**: Export your data as JSON for later editing
- **Load Resume**: Import previously saved resume data
- **PDF Export**: Two export options:
  - Direct HTML download (convert to PDF in browser)
  - Traditional print dialog with "Save as PDF" option

### ⌨️ **Keyboard Shortcuts**
- `Ctrl+S` / `Cmd+S`: Save resume
- `Ctrl+O` / `Cmd+O`: Load resume
- `Ctrl+P` / `Cmd+P`: Export to PDF

### ♿ **Accessibility Features**
- ARIA labels and attributes
- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly
- High contrast colors

## 🛠️ Tech Stack

- **TypeScript**: Type-safe JavaScript with modern ES6+ features
- **HTML5**: Semantic markup structure
- **CSS3**: Modern styling with flexbox, grid, and animations
- **No Frameworks**: Pure vanilla implementation for maximum performance

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/accessible-resume-builder.git
   cd accessible-resume-builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open in browser**
   ```
   http://localhost:8080
   ```

## 📦 Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Compile TypeScript to JavaScript |
| `npm run build:watch` | Watch for changes and rebuild automatically |
| `npm start` | Build and start HTTP server |
| `npm run dev` | Development mode with file watching |
| `npm run clean` | Clean build directory |

## 🏗️ Project Structure

```
accessible-resume-builder/
├── 📁 src/
│   └── app.ts                 # Main application (TypeScript)
├── 📁 dist/                   # Compiled JavaScript (auto-generated)
├── 📄 index.html             # Main HTML file
├── 🎨 styles.css             # All CSS styles
├── 📦 package.json           # Project dependencies
├── ⚙️ tsconfig.json          # TypeScript configuration
└── 📖 README.md              # Project documentation
```

## 🎯 How to Use

### 1. **Fill Basic Information**
- Enter your full name, professional title, email, and phone
- Add a professional summary highlighting your key achievements

### 2. **Add Work Experience**
- Click "+ Add Work Experience" to add job entries
- Fill in company, job title, dates, and description
- Use the × button to remove entries you don't need

### 3. **Add Education**
- Click "+ Add Education" to add educational background
- Include school/university, degree, and graduation dates
- Add multiple education entries as needed

### 4. **Live Preview**
- Watch your resume update in real-time in the right panel
- Professional formatting is applied automatically
- Preview shows exactly how your final resume will look

### 5. **Export Your Resume**
- **Save Data**: Export as JSON to continue editing later
- **Load Data**: Import previously saved resume data
- **Export PDF**: Choose your preferred export method

## 🎨 Customization

### Styling
The application uses CSS custom properties for easy theming. Key variables are defined in `styles.css`:

```css
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --glass-background: rgba(255, 255, 255, 0.95);
  --accent-color: #667eea;
  --text-color: #2d3748;
}
```

### Adding New Sections
To add new resume sections, extend the TypeScript interfaces in the main app file and update the form rendering logic.

## 🌐 Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 Responsive Design

The application is fully responsive with breakpoints at:
- **Mobile**: < 768px
- **Tablet**: 768px - 1200px  
- **Desktop**: > 1200px

## 🔧 Development

### TypeScript Configuration
The project uses strict TypeScript settings for maximum type safety:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "strict": true,
    "esModuleInterop": true
  }
}
```

### Code Structure
- **Single File Architecture**: All TypeScript code is in one file to avoid module complexity
- **Class-Based Organization**: Logical separation using TypeScript classes
- **Type Safety**: Full TypeScript interfaces for all data structures

## 🚀 Performance

- **Lightweight**: No external frameworks or heavy dependencies
- **Fast Loading**: Minimal JavaScript bundle size
- **Efficient Rendering**: Optimized DOM manipulation
- **Progressive Enhancement**: Works even with JavaScript disabled (basic form)

## 🔒 Privacy & Security

- **No Data Collection**: All processing happens locally in your browser
- **No Server Dependency**: Completely client-side application
- **Secure**: No data transmitted to external servers
- **XSS Protection**: HTML content is properly escaped

## 🐛 Troubleshooting

### Common Issues

**TypeScript compilation errors:**
```bash
npm run clean
npm run build
```

**Styles not loading:**
- Ensure `styles.css` is in the same directory as `index.html`
- Check browser console for 404 errors

**Features not working:**
- Make sure JavaScript is enabled in your browser
- Check browser console for error messages

## 📈 Future Enhancements

- [ ] Multiple resume templates/themes
- [ ] Skills section with visual tags
- [ ] Projects and certifications sections
- [ ] Dark mode toggle
- [ ] Auto-save functionality
- [ ] Resume optimization tips
- [ ] Integration with job boards
- [ ] True PDF generation with jsPDF
- [ ] Resume scoring algorithms

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by modern resume builders and professional design principles
- Built with accessibility and user experience as top priorities
- Thanks to the TypeScript and web development community

## 📞 Support

If you have any questions or run into issues:

1. Check the troubleshooting section above
2. Search existing GitHub issues
3. Create a new issue with detailed information

---

**Made with ❤️ and TypeScript**

⭐ **Star this repo if you found it helpful!**