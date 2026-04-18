document.addEventListener('DOMContentLoaded', () => {

  /* --- 1. Sticky Navbar & Mobile Menu --- */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
  
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
    });
  });

  /* --- 2. Typewriter Effect for Hero Title --- */
  const typeText = "Elegance In Every Petal.";
  const typeElement = document.getElementById('typewriter');
  let i = 0;
  
  function typeWriter() {
    if(!typeElement) return;
    if (i < typeText.length) {
      typeElement.innerHTML += typeText.charAt(i);
      i++;
      setTimeout(typeWriter, 100);
    } else {
      typeElement.classList.add('blinking-cursor');
    }
  }
  setTimeout(typeWriter, 800);

  /* --- 3. Intersection Observer for Scroll Animations --- */
  const animatedElements = document.querySelectorAll('.fade-up');
  const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };

  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); 
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => scrollObserver.observe(el));

  /* --- 4. Cart Logic --- */
  let cart = [];
  const addCartBtns = document.querySelectorAll('.add-cart-btn');
  const buyNowBtns = document.querySelectorAll('.buy-now-btn');
  
  const cartBadge = document.getElementById('cart-badge');
  const cartIcon = document.getElementById('cart-icon');
  const cartToggle = document.getElementById('cart-toggle');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartModal = document.getElementById('cart-modal');
  const closeCartBtn = document.getElementById('close-cart');
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartTotalPrice = document.getElementById('cart-total-price');
  const checkoutBtn = document.getElementById('checkout-btn');
  
  const successOverlay = document.getElementById('success-overlay');
  const successModal = document.getElementById('success-modal');
  const closeSuccessBtn = document.getElementById('close-success');

  function updateCartUI() {
    cartBadge.innerText = cart.length;
    
    if(cart.length === 0) {
      cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your cart is currently empty.</p>';
      cartTotalPrice.innerText = '$0.00';
      return;
    }

    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
      total += parseFloat(item.price);
      cartItemsContainer.innerHTML += `
        <div class="cart-item">
          <img src="${item.img}" alt="${item.name}">
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <span class="price">$${item.price.toFixed(2)}</span>
          </div>
          <button class="cart-item-remove" onclick="removeCartItem(${index})"><i class="fa-solid fa-trash"></i></button>
        </div>
      `;
    });

    cartTotalPrice.innerText = '$' + total.toFixed(2);
  }

  // Expose remove globally
  window.removeCartItem = function(index) {
    cart.splice(index, 1);
    updateCartUI();
  }

  function openCart() {
    cartOverlay.classList.add('active');
    cartModal.classList.add('active');
    document.body.classList.add('no-scroll');
  }

  function closeCart() {
    cartOverlay.classList.remove('active');
    cartModal.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }

  // Toggles
  cartToggle.addEventListener('click', openCart);
  closeCartBtn.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  // Add to cart click
  addCartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      
      const item = {
        name: btn.getAttribute('data-name'),
        price: parseFloat(btn.getAttribute('data-price')),
        img: btn.getAttribute('data-img')
      };
      
      cart.push(item);
      updateCartUI();
      
      // Visual feedback
      const originalHtml = btn.innerHTML;
      btn.innerHTML = 'Added!';
      btn.style.backgroundColor = 'var(--color-accent)';
      btn.style.color = 'white';
      
      cartIcon.style.color = 'var(--color-accent)';
      cartIcon.style.transform = 'scale(1.3)';
      createFlyToCartAnimation(e.clientX, e.clientY);

      setTimeout(() => {
        cartIcon.style.transform = 'scale(1)';
        cartIcon.style.color = '';
      }, 300);

      setTimeout(() => {
        btn.innerHTML = originalHtml;
        btn.style.backgroundColor = 'var(--color-dark)';
      }, 2000);
    });
  });

  // Buy Now hit
  buyNowBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      
      const item = {
        name: btn.getAttribute('data-name'),
        price: parseFloat(btn.getAttribute('data-price')),
        img: btn.getAttribute('data-img')
      };
      
      cart.push(item);
      updateCartUI();
      openCart();
    });
  });

  function createFlyToCartAnimation(x, y) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.width = '20px';
    particle.style.height = '20px';
    particle.style.backgroundColor = 'var(--color-accent)';
    particle.style.borderRadius = '50%';
    particle.style.zIndex = '9999';
    particle.style.transition = 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
    particle.style.pointerEvents = 'none';
    
    document.body.appendChild(particle);

    const cartRect = cartIcon.getBoundingClientRect();
    
    setTimeout(() => {
      particle.style.left = (cartRect.left + 5) + 'px';
      particle.style.top = (cartRect.top + 5) + 'px';
      particle.style.transform = 'scale(0.2)';
      particle.style.opacity = '0';
    }, 10);

    setTimeout(() => {
      particle.remove();
    }, 800);
  }

  /* --- 5. Checkout Process --- */
  checkoutBtn.addEventListener('click', () => {
    if(cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    
    // Simulate loading
    const originalText = checkoutBtn.innerText;
    checkoutBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
    
    setTimeout(() => {
      // Close Cart, Open Success
      checkoutBtn.innerText = originalText;
      closeCart();
      
      // Empty cart
      cart = [];
      updateCartUI();

      // Show success modal
      successOverlay.classList.add('active');
      successModal.classList.add('active');
      document.body.classList.add('no-scroll');
    }, 1200);
  });

  function closeSuccess() {
    successOverlay.classList.remove('active');
    successModal.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }

  closeSuccessBtn.addEventListener('click', closeSuccess);
  successOverlay.addEventListener('click', closeSuccess);


  /* --- 6. Auto-scroll Testimonial Slider --- */
  const slider = document.getElementById('testimonial-slider');
  let isDown = false, startX, scrollLeft;

  if(slider) {
    slider.addEventListener('mousedown', (e) => {
      isDown = true;
      slider.style.cursor = 'grabbing';
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener('mouseleave', () => { isDown = false; slider.style.cursor = 'auto'; });
    slider.addEventListener('mouseup', () => { isDown = false; slider.style.cursor = 'auto'; });
    slider.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2;
      slider.scrollLeft = scrollLeft - walk;
    });
    
    setInterval(() => {
      if(!isDown) {
         slider.scrollLeft += 1;
         if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 1) {
             slider.scrollLeft = 0;
         }
      }
    }, 40);
  }

});