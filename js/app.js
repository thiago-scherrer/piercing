/**
 * ===================================================================
 * app.js - JavaScript moderno para o site Scherrer Piercing
 * ===================================================================
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  initPreloader();
  initScrollAnimations();
  initSmoothScroll();
  initBackToTop();
  initGallery();
});

/**
 * Preloader - Remove a tela de carregamento quando o site estiver pronto
 */
function initPreloader() {
  window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 500);
      }, 500);
    }
  });
}

/**
 * Scroll Animations - Anima elementos quando entram na viewport
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  if (animatedElements.length > 0) {

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      animatedElements.forEach(element => {
        observer.observe(element);
      });
    } else {

      animatedElements.forEach(element => {
        element.classList.add('is-visible');
      });
    }
  }
}

/**
 * Smooth Scroll - Navegação suave para âncoras
 */
function initSmoothScroll() {
  const smoothScrollLinks = document.querySelectorAll('.smoothscroll');

  smoothScrollLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop,
          behavior: 'smooth'
        });


        history.pushState(null, null, targetId);
      }
    });
  });
}

/**
 * Back to Top - Botão para voltar ao topo
 */
function initBackToTop() {
  const goTopButton = document.getElementById('go-top');
  const scrollThreshold = 300;

  if (goTopButton) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > scrollThreshold) {
        goTopButton.style.display = 'block';
        setTimeout(() => {
          goTopButton.style.opacity = '1';
        }, 10);
      } else {
        goTopButton.style.opacity = '0';
        setTimeout(() => {
          goTopButton.style.display = 'none';
        }, 300);
      }
    });
  }
}

/**
 * Gallery - Carrossel de imagens com lazy loading
 */
function initGallery() {
  const slidesContainer = document.getElementById('slidesContainer');
  if (!slidesContainer) return;

  const imgCount = 66;
  let currentIndex = 0;


  for (let i = 1; i <= imgCount; i++) {
    const imgElement = document.createElement('img');
    imgElement.setAttribute('data-src', `images/piercings/${i}.jpeg`);
    imgElement.setAttribute('alt', `Piercing ${i}`);
    imgElement.classList.add('gallery-image', 'lazy-load');
    imgElement.setAttribute('tabindex', '0');

    if (i === 1) {
      imgElement.style.display = 'block';
      imgElement.setAttribute('aria-current', 'true');
      imgElement.src = imgElement.getAttribute('data-src');
    } else {
      imgElement.style.display = 'none';
      imgElement.setAttribute('aria-hidden', 'true');
    }

    slidesContainer.appendChild(imgElement);
  }


  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => navigateSlides(-1));
    nextBtn.addEventListener('click', () => navigateSlides(1));


    prevBtn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        navigateSlides(-1);
      }
    });

    nextBtn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        navigateSlides(1);
      }
    });
  }


  let touchStartX = 0;
  let touchEndX = 0;

  slidesContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, false);

  slidesContainer.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, false);

  function handleSwipe() {
    if (touchEndX < touchStartX) {
      navigateSlides(1);
    } else if (touchEndX > touchStartX) {
      navigateSlides(-1);
    }
  }


  function navigateSlides(step) {
    const slides = document.querySelectorAll('.gallery-image');


    slides[currentIndex].style.display = 'none';
    slides[currentIndex].setAttribute('aria-hidden', 'true');
    slides[currentIndex].removeAttribute('aria-current');


    currentIndex = (currentIndex + step + slides.length) % slides.length;


    slides[currentIndex].style.display = 'block';
    slides[currentIndex].setAttribute('aria-current', 'true');
    slides[currentIndex].removeAttribute('aria-hidden');


    if (slides[currentIndex].classList.contains('lazy-load')) {
      slides[currentIndex].src = slides[currentIndex].getAttribute('data-src');
      slides[currentIndex].classList.remove('lazy-load');
    }


    preloadNearbyImages(currentIndex, slides);


    slides[currentIndex].focus();
  }


  function preloadNearbyImages(index, slides) {

    const nextIndex = (index + 1) % slides.length;
    if (slides[nextIndex].classList.contains('lazy-load')) {
      const nextImg = new Image();
      nextImg.src = slides[nextIndex].getAttribute('data-src');
    }


    const prevIndex = (index - 1 + slides.length) % slides.length;
    if (slides[prevIndex].classList.contains('lazy-load')) {
      const prevImg = new Image();
      prevImg.src = slides[prevIndex].getAttribute('data-src');
    }
  }
}
