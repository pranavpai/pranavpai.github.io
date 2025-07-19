/**
 * Theme Management Class
 * Handles dark/light theme switching with localStorage persistence
 */
class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem("theme") || "light";
    this.init();
  }

  init() {
    this.applyTheme();
    this.bindEvents();
  }

  bindEvents() {
    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
      themeToggle.addEventListener("click", () => this.toggleTheme());
    }
  }

  toggleTheme() {
    this.theme = this.theme === "light" ? "dark" : "light";
    this.applyTheme();
    localStorage.setItem("theme", this.theme);
  }

  applyTheme() {
    document.documentElement.setAttribute("data-theme", this.theme);
  }
}

/**
 * Tab Management Class
 * Handles switching between tabbed content sections
 */
class TabManager {
  constructor() {
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    const tabButtons = document.querySelectorAll(".tab-button");
    tabButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const tabName = e.target.getAttribute("data-tab");
        this.switchTab(e.target.closest(".tabs"), tabName);
      });
    });
  }

  switchTab(tabsContainer, activeTabName) {
    // Remove active class from all buttons in this tabs container
    const tabButtons = tabsContainer.querySelectorAll(".tab-button");
    tabButtons.forEach((btn) => btn.classList.remove("active"));

    // Remove active class from all panels in this tabs container
    const tabPanels = tabsContainer.querySelectorAll(".tab-panel");
    tabPanels.forEach((panel) => panel.classList.remove("active"));

    // Add active class to clicked button
    const activeButton = tabsContainer.querySelector(
      `[data-tab="${activeTabName}"]`
    );
    if (activeButton) {
      activeButton.classList.add("active");
    }

    // Add active class to corresponding panel
    const activePanel = tabsContainer.querySelector(`#${activeTabName}`);
    if (activePanel) {
      activePanel.classList.add("active");
    }
  }
}

// Chat Management



/**
 * Utility Functions Class
 * Provides common utility methods for performance optimization
 */
class Utils {
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  static throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }
}

/**
 * Performance Manager Class
 * Handles image lazy loading and scroll event optimization
 */
class PerformanceManager {
  constructor() {
    this.init();
  }

  init() {
    this.lazyLoadImages();
    this.optimizeScrollEvents();
  }

  lazyLoadImages() {
    const images = document.querySelectorAll("img[src]");
    const imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.style.opacity = "1";
            img.style.transition = "opacity 0.3s ease";

            img.onload = () => {
              img.style.opacity = "1";
            };

            imageObserver.unobserve(img);
          }
        });
      },
      {
        rootMargin: "50px",
      }
    );

    images.forEach((img) => {
      imageObserver.observe(img);
    });
  }

  optimizeScrollEvents() {
    const throttledScrollHandler = Utils.throttle(() => {
      // Handle scroll-based animations or effects here
      this.updateScrollProgress();
    }, 16);

    window.addEventListener("scroll", throttledScrollHandler);
  }

  updateScrollProgress() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;

    document.documentElement.style.setProperty(
      "--scroll-progress",
      `${scrollPercent}%`
    );
  }
}

/**
 * Pagination Manager Class
 * Manages pagination for projects and recommendations sections
 */
class PaginationManager {
  constructor() {
    this.init();
  }

  init() {
    this.setup({
      listId: "research-list",
      paginationId: "pagination",
      itemsPerPage: 4,
      displayStyle: "flex",
      hash: "#research-project",
    });

    this.setup({
      listId: "project-list",
      paginationId: "project-pagination",
      itemsPerPage: 4,
      displayStyle: "flex",
      hash: "#research-project",
    });

    this.setup({
      listId: "recommendation-list",
      paginationId: "recommendation-pagination",
      itemsPerPage: 4,
      displayStyle: "block",
      hash: "#recommendations",
    });
  }

  setup({ listId, paginationId, itemsPerPage, displayStyle, hash }) {
    const listEl = document.getElementById(listId);
    const paginationEl = document.getElementById(paginationId);
    if (!listEl || !paginationEl) return;

    const cards = Array.from(listEl.children);
    const totalPages = Math.ceil(cards.length / itemsPerPage);
    let currentPage = 1;

    const showPage = (page, shouldScroll = false) => {
      currentPage = page;
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;

      cards.forEach((card, index) => {
        card.style.display =
          index >= start && index < end ? displayStyle : "none";
      });

      const buttons = paginationEl.querySelectorAll("button");
      buttons.forEach((btn) => btn.classList.remove("active"));
      buttons[page - 1]?.classList.add("active");

      if (hash && shouldScroll) {
        const target = document.querySelector(hash);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    };

    const setupPaginationButtons = () => {
      paginationEl.innerHTML = "";
      for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        btn.addEventListener("click", () => showPage(i, true)); // ← only scroll on click
        if (i === currentPage) btn.classList.add("active");
        paginationEl.appendChild(btn);
      }
    };

    setupPaginationButtons();
    showPage(1, false); // ← no scroll on first render
  }
}

/**
 * Portfolio Application Main Class
 * Initializes and coordinates all portfolio components
 */
class PortfolioApp {
  constructor() {
    this.init();
  }

  init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () =>
        this.initializeComponents()
      );
    } else {
      this.initializeComponents();
    }
  }

  initializeComponents() {
    try {
      // Initialize all managers
      this.themeManager = new ThemeManager();
      this.tabManager = new TabManager();
      this.performanceManager = new PerformanceManager();
      this.paginationManager = new PaginationManager();

      // Add resize event listener for responsive behavior
      window.addEventListener(
        "resize",
        Utils.debounce(() => {
          this.handleResize();
        }, 250)
      );

      // Development logging
      if (process?.env?.NODE_ENV === 'development' || window.location.hostname === 'localhost') {
        console.log("Pranav Pai's application initialized successfully");
      }
    } catch (error) {
      // Development error logging
      if (process?.env?.NODE_ENV === 'development' || window.location.hostname === 'localhost') {
        console.error("Error initializing Pranav Pai's application:", error);
      }
    }
  }

  handleResize() {
    // Handle responsive behavior changes
    if (window.innerWidth > 1024) {
      const sidebar = document.querySelector(".sidebar");
      if (sidebar) {
        sidebar.classList.remove("open");
      }
    }
  }
}

/**
 * Toggle achievements visibility in experience cards
 * @param {HTMLElement} button - The toggle button element
 */
function toggleAchievements(button) {
  const list = button.nextElementSibling;
  const icon = button.querySelector('.toggle-icon');
  const text = button.querySelector('span:first-child');
  
  if (list.style.display === 'none' || list.style.display === '') {
    list.style.display = 'block';
    text.textContent = 'Hide Key Achievements';
    button.classList.add('expanded');
  } else {
    list.style.display = 'none';
    text.textContent = 'Show Key Achievements';
    button.classList.remove('expanded');
  }
}

// Initialize the application
const portfolioApp = new PortfolioApp();

// Export for potential module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    PortfolioApp,
    ThemeManager,
    TabManager,
 
  };
}
