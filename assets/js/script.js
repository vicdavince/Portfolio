'use strict';



/**
 * PRELOAD
 * 
 * loading will be end after document is loaded
 */

const preloader = document.querySelector("[data-preaload]");

window.addEventListener("load", function () {
  preloader.classList.add("loaded");
  document.body.classList.add("loaded");
});



/**
 * add event listener on multiple elements
 */

const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
}



/**
 * NAVBAR
 */

const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("nav-active");
}

addEventOnElements(navTogglers, "click", toggleNavbar);



/**
 * HEADER & BACK TOP BTN
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

let lastScrollPos = 0;

const hideHeader = function () {
  const isScrollBottom = lastScrollPos < window.scrollY;
  if (isScrollBottom) {
    header.classList.add("hide");
  } else {
    header.classList.remove("hide");
  }

  lastScrollPos = window.scrollY;
}

window.addEventListener("scroll", function () {
  if (window.scrollY >= 50) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
    hideHeader();
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
});



/**
 * HERO SLIDER
 */

const heroSlider = document.querySelector("[data-hero-slider]");
const heroSliderItems = document.querySelectorAll("[data-hero-slider-item]");
const heroSliderPrevBtn = document.querySelector("[data-prev-btn]");
const heroSliderNextBtn = document.querySelector("[data-next-btn]");

let currentSlidePos = 0;
let lastActiveSliderItem = heroSliderItems[0];

const updateSliderPos = function () {
  lastActiveSliderItem.classList.remove("active");
  heroSliderItems[currentSlidePos].classList.add("active");
  lastActiveSliderItem = heroSliderItems[currentSlidePos];
}

const slideNext = function () {
  if (currentSlidePos >= heroSliderItems.length - 1) {
    currentSlidePos = 0;
  } else {
    currentSlidePos++;
  }

  updateSliderPos();
}

heroSliderNextBtn.addEventListener("click", slideNext);

const slidePrev = function () {
  if (currentSlidePos <= 0) {
    currentSlidePos = heroSliderItems.length - 1;
  } else {
    currentSlidePos--;
  }

  updateSliderPos();
}

heroSliderPrevBtn.addEventListener("click", slidePrev);

/**
 * auto slide
 */

let autoSlideInterval;

const autoSlide = function () {
  autoSlideInterval = setInterval(function () {
    slideNext();
  }, 7000);
}

addEventOnElements([heroSliderNextBtn, heroSliderPrevBtn], "mouseover", function () {
  clearInterval(autoSlideInterval);
});

addEventOnElements([heroSliderNextBtn, heroSliderPrevBtn], "mouseout", autoSlide);

window.addEventListener("load", autoSlide);



/**
 * PARALLAX EFFECT
 */

const parallaxItems = document.querySelectorAll("[data-parallax-item]");

let x, y;

window.addEventListener("mousemove", function (event) {

  x = (event.clientX / window.innerWidth * 10) - 5;
  y = (event.clientY / window.innerHeight * 10) - 5;

  // reverse the number eg. 20 -> -20, -5 -> 5
  x = x - (x * 2);
  y = y - (y * 2);

  for (let i = 0, len = parallaxItems.length; i < len; i++) {
    x = x * Number(parallaxItems[i].dataset.parallaxSpeed);
    y = y * Number(parallaxItems[i].dataset.parallaxSpeed);
    parallaxItems[i].style.transform = `translate3d(${x}px, ${y}px, 0px)`;
  }

});
//booking time slots
document.addEventListener('DOMContentLoaded', function () {
  const sessionDuration = document.getElementById('session-duration');
  const timeSlot = document.getElementById('time-slot');
  const courtSelection = document.getElementById('court-selection');
  const totalPriceElement = document.getElementById('total-price');

  const timeSlots30Min = [
    "08:00-08:30am", "08:30-09:00am", "09:00-09:30am", "09:30-10:00am",
    "10:00-10:30am", "10:30-11:00am", "11:00-11:30am", "11:30-12:00pm",
    "12:00-12:30pm", "12:30-01:00pm", "01:00-01:30pm", "01:30-02:00pm",
    "02:00-02:30pm", "02:30-03:00pm", "03:00-03:30pm", "03:30-04:00pm",
    "04:00-04:30pm", "04:30-05:00pm", "05:00-05:30pm", "05:30-06:00pm",
    "06:00-06:30pm", "06:30-07:00pm", "07:00-07:30pm", "07:30-08:00pm"
  ];

  const timeSlots1Hour = [
    "08:00-09:00am", "09:00-10:00am", "10:00-11:00am", "11:00-12:00pm",
    "12:00-01:00pm", "01:00-02:00pm", "02:00-03:00pm", "03:00-04:00pm",
    "04:00-05:00pm", "05:00-06:00pm", "06:00-07:00pm", "07:00-08:00pm"
  ];

  function updateTimeSlots() {
    timeSlot.innerHTML = '';
    const selectedDuration = sessionDuration.value;
    const slots = selectedDuration === '30-min' ? timeSlots30Min : timeSlots1Hour;
    slots.forEach(slot => {
      const option = document.createElement('option');
      option.value = slot;
      option.textContent = slot;
      timeSlot.appendChild(option);
    });
  }

  function calculatePrice() {
    fetch('pricing.json')
      .then(response => response.json())
      .then(data => {
        const selectedCourt = courtSelection.value;
        const selectedDuration = sessionDuration.value;
        const numberOfPeople = document.querySelector('select[name="person"]').value;
        const isOffPeak = isOffPeakHour(); // Implement this function based on time-slot
        const timeSlotValue = timeSlot.value;
        
        const peakOrOffPeak = isOffPeak ? 'off-peak' : 'peak';
        const courtPrices = data.courts[selectedCourt][peakOrOffPeak];
        const sessionRate = data.sessions[selectedDuration];
        
        const pricePerPerson = courtPrices[numberOfPeople];
        const totalPrice = pricePerPerson * sessionRate;
        
        totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
      });
  }

  function isOffPeakHour() {
    // Implement logic to determine if the selected time slot is off-peak
    return false; // Placeholder; adjust as needed
  }

  sessionDuration.addEventListener('change', () => {
    updateTimeSlots();
    calculatePrice();
  });

  courtSelection.addEventListener('change', calculatePrice);

  // Initialize the time slots and pricing based on default selections
  updateTimeSlots();
  calculatePrice();
});
