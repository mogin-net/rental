window.addEventListener('load', function() {
  const navbarRequest = fetch('./templates/navbar.html');
  const footerRequest = fetch('./templates/footer.html');

  Promise.all([navbarRequest, footerRequest])
  .then((responses) => {
      return Promise.all(responses.map((response) => {
          return response.text();
      }));
  })
  .then(([navbarResponse, footerResponse]) => {
      document.querySelector('nav').innerHTML = navbarResponse;
      document.querySelector('footer').innerHTML = footerResponse;

      const listItems = document.querySelectorAll('#navbar li');
      listItems.forEach((item) => {
          const anchor = item.querySelector('a');
          const href = anchor.getAttribute('href').replace(/^\./, '');
          
          // Check if the href attribute matches the current page's URL
          if (href === window.location.pathname) {
              item.classList.add('active'); // Add the 'active' class to the <li> element
          }
      });
      
      // Burger Icon Logic
      const burgerIcon = document.getElementById('burger-icon');
      const menu = document.getElementById('menu');
      const body = document.querySelector('body');
      burgerIcon.addEventListener('click', () => {
          burgerIcon.classList.toggle('open');
          menu.classList.toggle('menu-open');
          body.classList.toggle('no-scroll')
      });
      
      function checkViewport() {
          if (window.innerWidth > 644) {
              burgerIcon.classList.remove('open');
              menu.classList.remove('menu-open');
              body.classList.remove('no-scroll');
          }            
      }
      window.addEventListener('resize', checkViewport);
  });
});  

// Custom button for Selling and Rental pages
const currentPathname = window.location.pathname;

if (currentPathname === '/selling.html' || currentPathname === '/rental.html') {
  // Get all boxes
  const boxes = document.querySelectorAll('.box');

  boxes.forEach(box => {
      // Get product title and button element
      const productTitle = box.querySelector('h3');
      const contactBtn = box.querySelector('.contact-btn');

      // Create WhatsApp link corresponding with the product name
      const productName = encodeURIComponent(productTitle.textContent.trim());
      let whatsappLink = '';

      // Check whether user wants to Buy or Rent a vehicle
      if (currentPathname === '/selling.html') {
          whatsappLink = `https://wa.me/6281337674197/?text=Hi,%20I'm%20interested%20in%20buying%20${productName}%20and%20would%20like%20to%20know%20more%20about%20it.%20Could%20you%20please%20provide%20me%20with%20additional%20details%20and%20pricing%20information?`;
      } else if (currentPathname === '/rental.html') {
          whatsappLink = `https://wa.me/6281337674197/?text=Hi,%20I'm%20interested%20in%20renting%20${productName}%20and%20would%20like%20to%20know%20more%20about%20it.%20Could%20you%20please%20provide%20me%20with%20additional%20details%20and%20pricing%20information?`;
      }

      contactBtn.href = whatsappLink;
      contactBtn.target = '_blank';
  });
}