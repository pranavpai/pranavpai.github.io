# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a professional portfolio website for Pranav Pai, an AI Engineer & Researcher. It's a responsive single-page application built with vanilla HTML, CSS, and JavaScript, featuring dark/light theme support and AI chatbot integration.

## Common Development Commands

```bash
# Install dependencies
npm install

# Start development server (port 3000, no auto-open)
npm run dev

# Start development server with browser auto-open
npm run start

# Validate HTML before committing
npm run validate

# Preview production build
npm run preview

# Run local server using serve
npm run serve
```

## Architecture & Key Components

### Frontend Architecture
- **Single-page application** in `index.html` (1,540 lines)
- **CSS with theming** in `assets/styles.css` using CSS variables for dark/light modes
- **JavaScript classes** in `assets/main.js`:
  - `ThemeManager`: Dark/light theme switching with localStorage
  - `TabManager`: Handles tabbed content sections
  - Additional utility classes for carousel, pagination, and interactive components
- **Bootstrap 5.3.7** for responsive layout
- **Lucide Icons** for UI elements

### Python Automation
- `ai_news_agent.py`: Automated AI news updates using OpenAI and Brave Search APIs
- Runs monthly via GitHub Actions (20th of each month)
- Requires environment variables: `OPENAI_API_KEY`, `BRAVE_API_KEY`

### CI/CD Pipeline
1. **PR Preview** (`pr-preview.yml`): HTML validation on pull requests
2. **Deploy** (`deploy.yml`): Automatic deployment to GitHub Pages on push to `main`
3. **AI News Update** (`ai-news-update.yml`): Monthly automated content updates

## Development Workflow

### Branch Strategy
- **Production**: `main` branch (deploys to GitHub Pages)
- **Development**: `dev` branch (current working branch)
- **Features**: Use `feature/feature-name` pattern

### Before Committing
1. Run `npm run validate` to check HTML validity
2. Test theme switching functionality
3. Verify responsive design on mobile viewports
4. Check that all interactive components work (tabs, carousel, pagination)

### Making Changes
- **CSS**: Edit `assets/styles.css` - maintain CSS variable structure for theming
- **JavaScript**: Edit `assets/main.js` - follow existing class-based architecture
- **Content**: Update sections in `index.html` - maintain semantic HTML structure
- **Images**: Place in appropriate subdirectory under `assets/img/`

## Important Considerations

### License Restrictions
This codebase is **proprietary** with all rights reserved to Pranav Pai. No copying, modification, or redistribution is allowed without explicit permission.

### Performance
- Images use lazy loading - maintain `loading="lazy"` attribute
- JavaScript uses throttled scroll events for performance
- Minimize external dependencies to maintain fast load times

### API Integration
- Chatbot uses Gradio Client with specific space ID
- AI news automation requires proper GitHub secrets configuration
- See `setup_github_secrets.md` for environment setup