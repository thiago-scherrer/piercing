/**
 * ===================================================================
 * modern.js - Versão moderna de JavaScript para substituir jQuery
 * ===================================================================
 */

document.addEventListener('DOMContentLoaded', function () {


  initPreloader();
  initSmoothScroll();
  initBackToTop();
  initLazyLoading();
  initCarousel();
});

/**
 * Preloader
 */
function initPreloader() {
  window.addEventListener('load', function () {

    const loader = document.getElementById('loader');
    const preloader = document.getElementById('preloader');

    if (loader) {
      fadeOut(loader, 'slow', function () {
        if (preloader) {
          setTimeout(function () {
            fadeOut(preloader, 'slow');
          }, 300);
        }
      });
    }
  });
}

/**
 * Smooth Scrolling
 */
function initSmoothScroll() {
  document.querySelectorAll('.smoothscroll').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset;

        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });


        history.pushState(null, null, targetId);
      }
    });
  });
}

/**
 * Back to top button
 */
function initBackToTop() {
  const pxShow = 300;
  const goTopButton = document.getElementById('go-top');

  if (goTopButton) {
    window.addEventListener('scroll', function () {
      const headerSearch = document.getElementById('header-search');
      const isHeaderSearchVisible = headerSearch ? headerSearch.classList.contains('is-visible') : false;

      if (!isHeaderSearchVisible) {
        if (window.scrollY >= pxShow) {
          fadeIn(goTopButton, 400);
        } else {
          fadeOut(goTopButton, 400);
        }
      }
    });
  }
}

/**
 * Lazy Loading para imagens
 */
function initLazyLoading() {
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img.lazy-load');

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.getAttribute('data-src');
          img.classList.remove('lazy-load');
          observer.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
  } else {

    loadLazyImagesImmediately();
  }
}

/**
 * Carrossel de imagens
 */
function initCarousel() {


}

/**
 * Funções utilitárias
 */


function fadeOut(element, duration, callback) {
  let speed = duration === 'slow' ? 400 : (duration === 'fast' ? 200 : duration);

  element.style.opacity = 1;

  const fade = setInterval(function () {
    if (element.style.opacity > 0) {
      element.style.opacity -= 0.1;
    } else {
      clearInterval(fade);
      element.style.display = 'none';
      if (typeof callback === 'function') {
        callback();
      }
    }
  }, speed / 10);
}


function fadeIn(element, duration) {
  let speed = duration === 'slow' ? 400 : (duration === 'fast' ? 200 : duration);

  element.style.opacity = 0;
  element.style.display = 'block';

  const fade = setInterval(function () {
    if (element.style.opacity < 1) {
      element.style.opacity = parseFloat(element.style.opacity) + 0.1;
    } else {
      clearInterval(fade);
    }
  }, speed / 10);
}


function loadLazyImagesImmediately() {
  const lazyImages = document.querySelectorAll('img.lazy-load');
  lazyImages.forEach(img => {
    img.src = img.getAttribute('data-src');
    img.classList.remove('lazy-load');
  });
}


window.navigateSlides = function (n) {
  const slides = document.querySelectorAll(".slide-img");
  const currentIndex = Array.from(slides).findIndex(slide => slide.style.display === "block");
  let slideIndex = currentIndex;


  if (slideIndex >= 0 && slideIndex < slides.length) {
    slides[slideIndex].style.display = "none";
  }


  slideIndex = (slideIndex + n + slides.length) % slides.length;


  slides[slideIndex].style.display = "block";
}
