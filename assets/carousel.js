/**
 * Image Carousel Configuration and State
 */
const autoSlide = false; // use true/false
const slideInterval = 2200;

/** @type {string[]} Array of image URLs for carousel */
const imageUrls = [
  "./assets/img/Photos/profile/china.jpeg",
  "./assets/img/Photos/profile/hike.jpeg",
  "./assets/img/Photos/profile/office.jpeg"
];

/** @type {HTMLElement} Carousel container element */
const carousel = document.getElementById("carousel");

/** @type {number} Current slide index */
let current = 0;
/** @type {number} Auto-slide interval ID */
let interval;
/** @type {HTMLElement[]} Array of slide elements */
const slides = [];

/**
 * Create slide elements from image URLs
 */
function createSlides() {
  imageUrls.forEach((url, i) => {
    const slide = document.createElement("div");
    slide.className = "slide";
    const img = document.createElement("img");
    img.src = url;
    slide.appendChild(img);
    carousel.appendChild(slide);
    slides.push(slide);
  });
}

/**
 * Update slide positions and classes based on current index
 */
function updateSlides() {
  const total = slides.length;
  const leftIndex = (current - 1 + total) % total;
  const rightIndex = (current + 1) % total;

  slides.forEach((slide, i) => {
    slide.className = "slide"; // Reset
    if (i === current) {
      slide.classList.add("center");
      // Add click handler for center image on mobile
      if (isMobileDevice()) {
        slide.style.cursor = "pointer";
        slide.onclick = goRight;
      } else {
        slide.style.cursor = "default";
        slide.onclick = null;
      }
    } else if (i === leftIndex) {
      slide.classList.add("left");
      slide.style.cursor = "pointer";
      slide.onclick = goLeft;
    } else if (i === rightIndex) {
      slide.classList.add("right");
      slide.style.cursor = "pointer";
      slide.onclick = goRight;
    } else {
      slide.style.cursor = "default";
      slide.onclick = null;
    }
  });
}

/**
 * Navigate to previous slide
 */
function goLeft() {
  current = (current - 1 + slides.length) % slides.length;
  updateSlides();
  resetAutoSlide();
}

/**
 * Navigate to next slide
 */
function goRight() {
  current = (current + 1) % slides.length;
  updateSlides();
  resetAutoSlide();
}

/**
 * Start automatic slide progression
 */
function startAutoSlide() {
  if (autoSlide) {
    interval = setInterval(goRight, slideInterval);
  }
}

/**
 * Reset automatic slide progression
 */
function resetAutoSlide() {
  if (autoSlide) {
    clearInterval(interval);
    startAutoSlide();
  }
}

/**
 * Touch/Swipe functionality variables
 */
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;
let touchStartTime = 0;

/**
 * Mobile detection utility
 * @returns {boolean} True if device is mobile
 */
function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         window.innerWidth <= 768;
}

/**
 * Handle touch start event
 * @param {TouchEvent} e - Touch event
 */
function handleTouchStart(e) {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
  touchStartTime = Date.now();
}

/**
 * Handle touch move event
 * @param {TouchEvent} e - Touch event
 */
function handleTouchMove(e) {
  e.preventDefault(); // Prevent scrolling
}

/**
 * Handle touch end event
 * @param {TouchEvent} e - Touch event
 */
function handleTouchEnd(e) {
  touchEndX = e.changedTouches[0].clientX;
  touchEndY = e.changedTouches[0].clientY;
  handleSwipe();
}

/**
 * Process swipe gesture and navigate accordingly
 */
function handleSwipe() {
  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;
  const timeDiff = Date.now() - touchStartTime;
  const minSwipeDistance = isMobileDevice() ? 30 : 50; // More sensitive on mobile
  const maxTapTime = 300; // Maximum time for a tap (ms)
  const maxTapDistance = 10; // Maximum movement for a tap (px)
  
  // Check if this was a tap (short time, minimal movement)
  if (timeDiff < maxTapTime && Math.abs(deltaX) < maxTapDistance && Math.abs(deltaY) < maxTapDistance) {
    // Handle tap on mobile devices
    if (isMobileDevice()) {
      handleMobileTap();
      return;
    }
  }
  
  // Handle swipe gesture
  if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
    if (deltaX > 0) {
      goLeft(); // Swipe right -> go to previous image
    } else {
      goRight(); // Swipe left -> go to next image
    }
  }
}

/**
 * Handle tap on mobile devices - cycles to next image
 */
function handleMobileTap() {
  goRight(); // Tap anywhere on carousel advances to next image
}

// Init
createSlides();
updateSlides();

// Add touch event listeners to carousel
carousel.addEventListener('touchstart', handleTouchStart, { passive: false });
carousel.addEventListener('touchmove', handleTouchMove, { passive: false });
carousel.addEventListener('touchend', handleTouchEnd, { passive: false });

// Add mouse events for desktop testing of mobile functionality
if (!isMobileDevice()) {
  carousel.addEventListener('mousedown', (e) => {
    touchStartX = e.clientX;
    touchStartY = e.clientY;
    touchStartTime = Date.now();
  });
  
  carousel.addEventListener('mouseup', (e) => {
    touchEndX = e.clientX;
    touchEndY = e.clientY;
    handleSwipe();
  });
}

startAutoSlide();
