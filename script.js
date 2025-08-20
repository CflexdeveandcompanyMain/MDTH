// hamburger javascript code 


// Get DOM elements
const hamburger = document.getElementById('hamburger');
const sideMenu = document.querySelector('.side-menu'); // Adjust the selector if needed
const cancelIcon = document.getElementById('cancelIcon');

// Show the menu
hamburger.addEventListener('click', () => {
  sideMenu.style.right = '0'; // Slide into view
});

// Hide the menu
cancelIcon.addEventListener('click', () => {
  sideMenu.style.right = '-500px'; // Slide back out of view
});


// Enhanced Dropdown Functionality
document.addEventListener("DOMContentLoaded", () => {
  const caretIcons = document.querySelectorAll(".dropdown .caret");
  
  caretIcons.forEach(caretIcon => {
    const dropdownMenu = caretIcon.closest(".dropdown").querySelector(".dropdown-menu");

    caretIcon.addEventListener("click", (event) => {
      event.stopPropagation(); // Prevent the event from propagating to parent elements
      caretIcon.classList.toggle("open");
      dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
    });
  });

  // Close the dropdown if clicked outside
  document.addEventListener("click", () => {
    caretIcons.forEach(caretIcon => {
      caretIcon.classList.remove("open");
      const dropdownMenu = caretIcon.closest(".dropdown").querySelector(".dropdown-menu");
      dropdownMenu.style.display = "none";
    });
  });
});



//swicth themes javascript code
document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('themeToggle');
  const sideMenu = document.querySelector('.side-menu');
  const textElements = document.querySelectorAll('.side-menu p, .theme-switcher p'); // Exclude links
  const linkElements = document.querySelectorAll('.side-menu a'); // Regular side menu links
  const dropdownLinks = document.querySelectorAll('.dropdown-menu a'); // Dropdown menu links
  const cancelIcon = document.getElementById('cancelIcon');
  
  const dropdownMenuItems = document.querySelectorAll('.dropdown-menu'); // Dropdown parent element
  
  let isDarkMode = true;

  themeToggle.addEventListener('click', () => {
    if (isDarkMode) {
      // Switch to light mode
      sideMenu.style.backgroundColor = 'white';
      textElements.forEach(el => (el.style.color = '#333')); 
      linkElements.forEach(link => (link.style.color = '#333')); 
      dropdownMenuItems.forEach(item => {
        item.style.backgroundColor = 'white'; 
      });
      dropdownLinks.forEach(link => {
        link.style.color = '#333'; 
      });
      themeToggle.innerHTML = '<i class="fa fa-sun-o" aria-hidden="true"></i>';
      themeToggle.style.color = '#ffcc00'; // Yellow Sun
      cancelIcon.style.color = '#333'; // Dark Cancel Icon
      isDarkMode = false;
    } else {
      // Switch to dark mode
      sideMenu.style.backgroundColor = '#0a3d76';
      textElements.forEach(el => (el.style.color = 'white')); // Non-link text
      linkElements.forEach(link => (link.style.color = 'white')); // Normal links
      dropdownMenuItems.forEach(item => {
        item.style.backgroundColor = 'white'; 
      });
      dropdownLinks.forEach(link => {
        link.style.color = '#333'; 
      });
      themeToggle.innerHTML = '<i class="fa fa-moon-o" aria-hidden="true"></i>';
      themeToggle.style.color = 'white'; // White Moon
      cancelIcon.style.color = 'white'; // White Cancel Icon
      isDarkMode = true;
    }
  });
  
  // Hover effect for dropdown items
  dropdownLinks.forEach(link => {
    link.addEventListener('mouseover', () => {
      link.style.color = 'blue'; // On hover, color will change to blue
    });
    link.addEventListener('mouseout', () => {
      link.style.color = '#333'; // Default color
    });
  });
});



document.addEventListener('DOMContentLoaded', function () {
  const slider = document.querySelector('.courses-slider');
  const indicators = document.querySelectorAll('.indicator');
  const exploreBtn = document.querySelector('.explore-btn');
  
  let currentIndex = 0; // Track the current slide
  let touchStartX = 0;  // Store the starting touch position
  let touchEndX = 0;    // Store the ending touch position
  let autoSlideInterval = null; // For automatic sliding

  // Function to calculate the correct card width
  const getCardWidth = () => {
    const card = slider.querySelector('.course-card');
    const cardStyles = window.getComputedStyle(card);
    const cardWidth = card.offsetWidth; // Width including padding
    const margin = parseFloat(cardStyles.marginLeft) + parseFloat(cardStyles.marginRight);
    return cardWidth + margin; // Total card width with margin
  };

  // Function to update the slider's position
  const updateSlider = (index) => {
    const cardWidth = getCardWidth();
    const screenWidth = window.innerWidth;

    if (screenWidth > 768) {
      // For larger screens, use transform
      slider.style.transform = `translateX(-${index * cardWidth}px)`;
    } else {
      // For smaller screens, adjust scroll position
      slider.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
    }

    // Update active indicator
    indicators.forEach((indicator, i) => {
      indicator.classList.toggle('active', i === index);
    });
  };

  // Event listener for indicator clicks
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      currentIndex = index;
      updateSlider(currentIndex);
      resetAutoSlide(); // Reset auto-slide on user interaction
    });
  });

  // Function to handle swipe detection
  const handleSwipe = () => {
    if (touchStartX - touchEndX > 50) {
      // Swipe Left: Move to next slide
      currentIndex = (currentIndex + 1) % indicators.length;
    }
    if (touchEndX - touchStartX > 50) {
      // Swipe Right: Move to next slide (don't go back to the last one)
      currentIndex = (currentIndex + 1) % indicators.length; // Only move forward
    }
    updateSlider(currentIndex);
  };

  // Event listeners for touch events
  slider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  slider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

});



//testimonial sliding javascript code
const testimonials = document.querySelectorAll('.testimonial-card');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

let currentIndex = 0; // Starting index
const totalCards = testimonials.length;
let cardsPerView = 3; // Number of cards visible at once on larger screens
let autoSlideInterval;

// Function to update the active testimonials
function updateActiveTestimonials() {
  testimonials.forEach((testimonial, index) => {
    // Hide all cards
    testimonial.style.display = "none"; 
    // Reset background color and icon color
    testimonial.style.backgroundColor = "#fff";
    const quoteIcon = testimonial.querySelector('.quote-icon');
    quoteIcon.style.color = "#093c78"; 
    
    // When the card is in the range of the view
    if (index >= currentIndex && index < currentIndex + cardsPerView) {
      testimonial.style.display = "flex"; // Show the testimonial
      testimonial.style.backgroundColor = "#fff"; // Set default background
    }

    // Set the background color and icon for the active card (middle one)
    if (index === currentIndex + Math.floor(cardsPerView / 1)) {
      testimonial.style.backgroundColor = "#093c78"; 
      quoteIcon.style.color = "#fff"; 
    }
  });
}

// Function to move to the next set of testimonials
function showNextTestimonial() {
  currentIndex = (currentIndex + 1) % totalCards;
  updateActiveTestimonials();
}

// Function to move to the previous set of testimonials
function showPrevTestimonial() {
  currentIndex = (currentIndex - 1 + totalCards) % totalCards;
  updateActiveTestimonials();
}

// Function to start auto-slide
function startAutoSlide() {
  autoSlideInterval = setInterval(showNextTestimonial, 4000); // Change slides every 3 seconds
}

// Function to stop auto-slide
function stopAutoSlide() {
  clearInterval(autoSlideInterval);
}

// Event listeners for arrow buttons
nextBtn.addEventListener('click', () => {
  stopAutoSlide();
  showNextTestimonial();
  startAutoSlide();
});

prevBtn.addEventListener('click', () => {
  stopAutoSlide();
  showPrevTestimonial();
  startAutoSlide();
});

// Initial setup
updateActiveTestimonials();
startAutoSlide();

// Update cards per view based on screen size
window.addEventListener('resize', () => {
  if (window.innerWidth <= 768) {
    cardsPerView = 1; // 1 card per view on smaller screens
  } else if (window.innerWidth <= 1024) {
    cardsPerView = 2; // Adjust for 1024px screen width
  } else {
    cardsPerView = 3; // 3 cards per view on larger screens
  }
  updateActiveTestimonials(); // Update the active testimonials when the screen resizes
});

function updateActiveTestimonials() {
  testimonials.forEach((testimonial, index) => {
    // Hide all cards initially
    testimonial.style.display = "none"; 

    // Remove active class and reset styles
    testimonial.classList.remove('active');

    // Display only cards in the current view
    if (index >= currentIndex && index < currentIndex + cardsPerView) {
      testimonial.style.display = "flex"; // Show testimonial
    }

    // Set the active card (middle one)
    if (index === currentIndex + Math.floor(cardsPerView / 2)) {
      testimonial.classList.add('active'); // Add active class
    }
  });
}

document.addEventListener("DOMContentLoaded", function() {
  const dotContainer = document.querySelector(".background-dots");
  const numberOfDots = 50;  // Adjust the number of dots as needed

  for (let i = 0; i < numberOfDots; i++) {
    const dot = document.createElement("div");
    dot.classList.add("dot");

    // Set random size for each dot
    const size = Math.random() * (30 - 10) + 10; // Random size between 10px and 30px
    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;

    // Set random position for each dot
    const xPosition = Math.random() * 100; // Random x position (percentage)
    const yPosition = Math.random() * 100; // Random y position (percentage)
    dot.style.top = `${yPosition}%`;
    dot.style.left = `${xPosition}%`;

    // Append the dot to the container
    dotContainer.appendChild(dot);
  }
});

/*about us team card slider */
// Automatic Slider and Indicator Functionality
let teamIndex = 0;
  
const slides = document.querySelectorAll('.team-member');
const dots = document.querySelectorAll('.dot');

function showSlide(index) {
    if (index >= slides.length) {
        teamIndex = 0;
    } else if (index < 0) {
        teamIndex = slides.length - 1;
    } else {
        teamIndex = index;
    }

    // Hide all slides and remove active dot
    slides.forEach(slide => slide.style.display = 'none');
    dots.forEach(dot => dot.classList.remove('active'));

    // Show current slide and active dot
    slides[teamIndex].style.display = 'flex';
    dots[teamIndex].classList.add('active');
}

// Initialize the slider
showSlide(teamIndex);

// Auto slide every 3 seconds
setInterval(() => {
    showSlide(teamIndex + 1);
}, 5000);

// Add event listeners for manual dot navigation
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => showSlide(index));
});


//back to previous page functionality
function goToPreviousPage() {
  window.history.back();
}



  function saveCourseDetails(title, description, image) {
      localStorage.setItem("selectedCourseTitle", title);
      localStorage.setItem("selectedCourseDescription", description);
      localStorage.setItem("selectedCourseImage", image);

      // Redirect to the join-now.html page
      window.location.href = "join-now.html";
  }

  