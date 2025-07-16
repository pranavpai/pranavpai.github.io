const autoSlide = false; // use true/false
const slideInterval = 2200;

const imageUrls = [
  "https://images.unsplash.com/photo-1749200622589-86f652f26761?w=600&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1533612608997-212b06408bb9?w=600&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1751601727553-8bd4ad69f6b4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxNHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1752001198783-a50a87122934?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1752199718118-133cba05df0e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D",
];

const carousel = document.getElementById("carousel");
const leftBtn = document.querySelector(".nav.left");
const rightBtn = document.querySelector(".nav.right");

let current = 0;
let interval;
const slides = [];

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

function updateSlides() {
  const total = slides.length;
  const leftIndex = (current - 1 + total) % total;
  const rightIndex = (current + 1) % total;

  slides.forEach((slide, i) => {
    slide.className = "slide"; // Reset
    if (i === current) {
      slide.classList.add("center");
    } else if (i === leftIndex) {
      slide.classList.add("left");
    } else if (i === rightIndex) {
      slide.classList.add("right");
    }
  });
}

function goLeft() {
  current = (current - 1 + slides.length) % slides.length;
  updateSlides();
  resetAutoSlide();
}

function goRight() {
  current = (current + 1) % slides.length;
  updateSlides();
  resetAutoSlide();
}

function startAutoSlide() {
  if (autoSlide) {
    interval = setInterval(goRight, slideInterval);
  }
}

function resetAutoSlide() {
  if (autoSlide) {
    clearInterval(interval);
    startAutoSlide();
  }
}

// Init
createSlides();
updateSlides();
leftBtn.onclick = goLeft;
rightBtn.onclick = goRight;
startAutoSlide();
