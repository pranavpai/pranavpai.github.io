# Professional Portfolio Website - Pranav Pai

[![Deploy to GitHub Pages](https://github.com/pranavpai/pranavpai.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/pranavpai/pranavpai.github.io/actions/workflows/deploy.yml)
[![PR Preview Check](https://github.com/pranavpai/pranavpai.github.io/actions/workflows/pr-preview.yml/badge.svg)](https://github.com/pranavpai/pranavpai.github.io/actions/workflows/pr-preview.yml)

A modern, responsive portfolio website for Pranav Pai - AI Engineer & Full Stack Developer, featuring dark/light mode, interactive components, and AI-powered chatbot integration.

## 🌐 Live Website

**Production:** [https://pranavpai.github.io](https://pranavpai.github.io)

## ✨ Features

- **Responsive Design**: Mobile-first approach with Bootstrap 5
- **Theme Toggle**: Dark/light mode with localStorage persistence
- **Interactive Components**: 
  - Image carousel with navigation
  - Tabbed sections for skills, experience, projects
  - Pagination for projects and recommendations
- **AI Chatbot**: Gradio-integrated resume Q&A system
- **Performance Optimized**: 
  - Lazy loading images
  - Throttled scroll events
  - CSS variables for efficient theming

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Styling**: Bootstrap 5.3.7, Custom CSS with CSS Variables
- **Icons**: Lucide Icons, Custom SVG
- **Fonts**: Google Fonts (Playfair Display, Roboto, Fira Code, Inter)
- **AI Integration**: Gradio Client for chatbot functionality
- **Deployment**: GitHub Pages with GitHub Actions CI/CD

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/pranavpai/pranavpai.github.io.git
   cd pranavpai.github.io
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   
   Website will be available at `http://127.0.0.1:3000`

### Available Scripts

- `npm run dev` - Start development server (no auto-open browser)
- `npm run start` - Start development server (auto-open browser)
- `npm run serve` - Serve using serve package
- `npm run preview` - Preview production build
- `npm run validate` - Run HTML validation

## 📁 Project Structure

```
pranavpai.github.io/
├── assets/
│   ├── img/           # Images and SVG icons
│   ├── styles.css     # Main stylesheet with CSS variables
│   ├── main.js        # Core JavaScript functionality
│   └── carousel.js    # Image carousel component
├── .github/
│   └── workflows/     # GitHub Actions CI/CD
├── index.html         # Main HTML file
├── package.json       # Dependencies and scripts
└── README.md         # Project documentation
```

## 🔄 Deployment

### Automatic Deployment (GitHub Actions)

The website automatically deploys to GitHub Pages on every push to the `main` branch using GitHub Actions.

**Workflow Features:**
- ✅ Automated HTML validation
- ✅ Dependency caching for faster builds
- ✅ Security-first permissions
- ✅ PR preview checks
- ✅ Concurrent deployment protection

### Manual Deployment

For manual deployment to other platforms:

1. **Build the project**
   ```bash
   npm run preview
   ```

2. **Deploy the files**
   - Upload `index.html`, `assets/` folder, and `package.json` to your hosting provider

## 🔗 Social Links

- **LinkedIn**: [pranav-pai](https://www.linkedin.com/in/pranav-pai/)
- **GitHub**: [pranavpai](https://github.com/pranavpai)
- **X (Twitter)**: [@PranavPai01](https://x.com/PranavPai01)
- **Hugging Face**: [pranavpai](https://huggingface.co/pranavpai)
- **Spotify**: [Profile](https://open.spotify.com/user/317pss47k332ud34gtibzpaal7ju?si=db64a3ed321c4ade)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

**Pranav Pai** - paipranav01@gmail.com

Project Link: [https://github.com/pranavpai/pranavpai.github.io](https://github.com/pranavpai/pranavpai.github.io)

---

⭐ **Star this repo if you found it helpful!** 
