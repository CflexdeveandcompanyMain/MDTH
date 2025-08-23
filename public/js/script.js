      // Theme Toggle Functionality
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = document.getElementById('themeIcon');
        const body = document.body;

        // Check for saved theme preference or use preferred color scheme
        const savedTheme = localStorage.getItem('theme') || 
                         (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        
        // Apply the saved theme
        if (savedTheme === 'dark') {
            body.setAttribute('data-theme', 'dark');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        }

        // Toggle theme on button click
        themeToggle.addEventListener('click', () => {
            if (body.getAttribute('data-theme') === 'dark') {
                body.setAttribute('data-theme', 'light');
                themeIcon.classList.replace('fa-sun', 'fa-moon');
                localStorage.setItem('theme', 'light');
            } else {
                body.setAttribute('data-theme', 'dark');
                themeIcon.classList.replace('fa-moon', 'fa-sun');
                localStorage.setItem('theme', 'dark');
            }
        });

        // Mobile Menu Toggle
        const hamburger = document.getElementById('hamburger');
        const sideMenu = document.getElementById('sideMenu');
        const cancelIcon = document.getElementById('cancelIcon');

        hamburger.addEventListener('click', () => {
            sideMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        cancelIcon.addEventListener('click', () => {
            sideMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });

        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.side-menu .nav-links a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                sideMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });

        // Testimonial Slider
        const testimonialSlider = document.querySelector('.testimonial-slider');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        let currentSlide = 0;

        function updateSlider() {
            testimonialSlider.scrollTo({
                left: currentSlide * 380,
                behavior: 'smooth'
            });
        }

        prevBtn.addEventListener('click', () => {
            currentSlide = Math.max(0, currentSlide - 1);
            updateSlider();
        });

        nextBtn.addEventListener('click', () => {
            const maxSlides = Math.floor(testimonialSlider.scrollWidth / 380) - 1;
            currentSlide = Math.min(maxSlides, currentSlide + 1);
            updateSlider();
        });

        // Course Slider Indicators
        const indicators = document.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                document.querySelector('.indicator.active').classList.remove('active');
                indicator.classList.add('active');
                document.querySelector('.courses-slider').scrollTo({
                    left: index * 350,
                    behavior: 'smooth'
                });
            });
        });

        // Animate elements on scroll
        const animateOnScroll = () => {
            const elements = document.querySelectorAll('.icon-box, .course-card, .testimonial-card');
            
            elements.forEach(element => {
                const elementPosition = element.getBoundingClientRect().top;
                const screenPosition = window.innerHeight / 1.2;
                
                if (elementPosition < screenPosition) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
            });
        };

        // Set initial state for animated elements
        document.querySelectorAll('.icon-box, .course-card, .testimonial-card').forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });

        window.addEventListener('scroll', animateOnScroll);
        window.addEventListener('load', animateOnScroll);
      // Enhanced slider functionality
    document.addEventListener('DOMContentLoaded', function() {
        const slider = document.querySelector('.courses-slider');
        const prevBtn = document.querySelector('.prev-arrow');
        const nextBtn = document.querySelector('.next-arrow');
        const indicatorsContainer = document.querySelector('.slider-indicators');
        
        // Create indicators based on number of courses
        const courseCards = document.querySelectorAll('.course-card');
        const cardWidth = courseCards[0].offsetWidth + 30; // width + margin
        const visibleCards = Math.floor(slider.offsetWidth / cardWidth);
        const totalSlides = Math.ceil(courseCards.length / visibleCards);
        
        for (let i = 0; i < totalSlides; i++) {
            const indicator = document.createElement('span');
            indicator.classList.add('indicator');
            if (i === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => goToSlide(i));
            indicatorsContainer.appendChild(indicator);
        }
        
        let currentSlide = 0;
        
        function updateSlider() {
            slider.scrollTo({
                left: currentSlide * slider.offsetWidth,
                behavior: 'smooth'
            });
            
            // Update indicators
            document.querySelectorAll('.indicator').forEach((ind, index) => {
                ind.classList.toggle('active', index === currentSlide);
            });
        }
        
        function goToSlide(slideIndex) {
            currentSlide = slideIndex;
            updateSlider();
        }
        
        prevBtn.addEventListener('click', () => {
            currentSlide = Math.max(0, currentSlide - 1);
            updateSlider();
        });
        
        nextBtn.addEventListener('click', () => {
            currentSlide = Math.min(totalSlides - 1, currentSlide + 1);
            updateSlider();
        });
        
        // Auto-scroll prevention when manually scrolling
        let isScrolling = false;
        slider.addEventListener('scroll', () => {
            if (!isScrolling) {
                window.requestAnimationFrame(() => {
                    const slideIndex = Math.round(slider.scrollLeft / slider.offsetWidth);
                    if (slideIndex !== currentSlide) {
                        currentSlide = slideIndex;
                        document.querySelectorAll('.indicator').forEach((ind, index) => {
                            ind.classList.toggle('active', index === currentSlide);
                        });
                    }
                    isScrolling = false;
                });
            }
            isScrolling = true;
        });
    });
           // Theme Toggle Functionality
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = document.getElementById('themeIcon');
        const body = document.body;

        // Check for saved theme preference or use preferred color scheme
        const savedTheme = localStorage.getItem('theme') || 
                         (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        
        // Apply the saved theme
        if (savedTheme === 'dark') {
            body.setAttribute('data-theme', 'dark');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        }

        // Toggle theme on button click
        themeToggle.addEventListener('click', () => {
            if (body.getAttribute('data-theme') === 'dark') {
                body.setAttribute('data-theme', 'light');
                themeIcon.classList.replace('fa-sun', 'fa-moon');
                localStorage.setItem('theme', 'light');
            } else {
                body.setAttribute('data-theme', 'dark');
                themeIcon.classList.replace('fa-moon', 'fa-sun');
                localStorage.setItem('theme', 'dark');
            }
        });

        // Mobile Menu Toggle
        const hamburger = document.getElementById('hamburger');
        const sideMenu = document.getElementById('sideMenu');
        const cancelIcon = document.getElementById('cancelIcon');

        hamburger.addEventListener('click', () => {
            sideMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        cancelIcon.addEventListener('click', () => {
            sideMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });

        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.side-menu .nav-links a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                sideMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });

        // Testimonial Slider
        const testimonialSlider = document.querySelector('.testimonial-slider');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        let currentSlide = 0;

        function updateSlider() {
            testimonialSlider.scrollTo({
                left: currentSlide * 380,
                behavior: 'smooth'
            });
        }

        prevBtn.addEventListener('click', () => {
            currentSlide = Math.max(0, currentSlide - 1);
            updateSlider();
        });

        nextBtn.addEventListener('click', () => {
            const maxSlides = Math.floor(testimonialSlider.scrollWidth / 380) - 1;
            currentSlide = Math.min(maxSlides, currentSlide + 1);
            updateSlider();
        });

        // Course Slider Indicators
        const indicators = document.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                document.querySelector('.indicator.active').classList.remove('active');
                indicator.classList.add('active');
                document.querySelector('.courses-slider').scrollTo({
                    left: index * 350,
                    behavior: 'smooth'
                });
            });
        });

        // Animate elements on scroll
        const animateOnScroll = () => {
            const elements = document.querySelectorAll('.icon-box, .course-card, .testimonial-card');
            
            elements.forEach(element => {
                const elementPosition = element.getBoundingClientRect().top;
                const screenPosition = window.innerHeight / 1.2;
                
                if (elementPosition < screenPosition) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
            });
        };

        // Set initial state for animated elements
        document.querySelectorAll('.icon-box, .course-card, .testimonial-card').forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });

        window.addEventListener('scroll', animateOnScroll);
        window.addEventListener('load', animateOnScroll);
      // Enhanced slider functionality
    document.addEventListener('DOMContentLoaded', function() {
        const slider = document.querySelector('.courses-slider');
        const prevBtn = document.querySelector('.prev-arrow');
        const nextBtn = document.querySelector('.next-arrow');
        const indicatorsContainer = document.querySelector('.slider-indicators');
        
        // Create indicators based on number of courses
        const courseCards = document.querySelectorAll('.course-card');
        const cardWidth = courseCards[0].offsetWidth + 30; // width + margin
        const visibleCards = Math.floor(slider.offsetWidth / cardWidth);
        const totalSlides = Math.ceil(courseCards.length / visibleCards);
        
        for (let i = 0; i < totalSlides; i++) {
            const indicator = document.createElement('span');
            indicator.classList.add('indicator');
            if (i === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => goToSlide(i));
            indicatorsContainer.appendChild(indicator);
        }
        
        let currentSlide = 0;
        
        function updateSlider() {
            slider.scrollTo({
                left: currentSlide * slider.offsetWidth,
                behavior: 'smooth'
            });
            
            // Update indicators
            document.querySelectorAll('.indicator').forEach((ind, index) => {
                ind.classList.toggle('active', index === currentSlide);
            });
        }
        
        function goToSlide(slideIndex) {
            currentSlide = slideIndex;
            updateSlider();
        }
        
        prevBtn.addEventListener('click', () => {
            currentSlide = Math.max(0, currentSlide - 1);
            updateSlider();
        });
        
        nextBtn.addEventListener('click', () => {
            currentSlide = Math.min(totalSlides - 1, currentSlide + 1);
            updateSlider();
        });
        
        // Auto-scroll prevention when manually scrolling
        let isScrolling = false;
        slider.addEventListener('scroll', () => {
            if (!isScrolling) {
                window.requestAnimationFrame(() => {
                    const slideIndex = Math.round(slider.scrollLeft / slider.offsetWidth);
                    if (slideIndex !== currentSlide) {
                        currentSlide = slideIndex;
                        document.querySelectorAll('.indicator').forEach((ind, index) => {
                            ind.classList.toggle('active', index === currentSlide);
                        });
                    }
                    isScrolling = false;
                });
            }
            isScrolling = true;
        });
    });