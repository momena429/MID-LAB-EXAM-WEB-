document.addEventListener('DOMContentLoaded', function () {
    const sortBtn = document.getElementById('sortBtn');
    const filterBtn = document.getElementById('filterBtn');
    const sortOptions = document.getElementById('sortOptions');
    const filterOptions = document.getElementById('filterOptions');
    
    const sortSelect = document.getElementById('sortSelect');
    const filterSelect = document.getElementById('filterSelect');
  
    const productCards = Array.from(document.querySelectorAll('.product-card'));
    const itemsPerPage = 12;
    let currentPage = 1;
    let filteredSortedCards = [];
  
    // Toggle sort options
    sortBtn.addEventListener('click', function() {
      sortOptions.style.display = sortOptions.style.display === 'none' ? 'block' : 'none';
      filterOptions.style.display = 'none'; // Hide filter options
    });
  
    // Toggle filter options
    filterBtn.addEventListener('click', function() {
      filterOptions.style.display = filterOptions.style.display === 'none' ? 'block' : 'none';
      sortOptions.style.display = 'none'; // Hide sort options
    });
  
    // Sorting function
    function sortProducts(products) {
      const sortOption = sortSelect.value;
      return products.sort((a, b) => {
        const titleA = a.querySelector('.card-title').innerText.toLowerCase();
        const titleB = b.querySelector('.card-title').innerText.toLowerCase();
  
        if (sortOption === 'title-asc') {
          return titleA.localeCompare(titleB);
        } else if (sortOption === 'title-desc') {
          return titleB.localeCompare(titleA);
        }
      });
    }
  
    // Filtering function
    function filterProducts(products) {
      const filterOption = filterSelect.value;
      return products.filter(card => {
        const price = parseFloat(card.getAttribute('data-price'));
        if (filterOption === 'low' && price >= 500) {
          return false;
        } else if (filterOption === 'medium' && (price < 500 || price > 1000)) {
          return false;
        } else if (filterOption === 'high' && price <= 1000) {
          return false;
        }
        return true;
      });
    }
  
    // Function to show products for the current page
    function displayPage(page) {
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const currentPageCards = filteredSortedCards.slice(startIndex, endIndex);
      
      const productList = document.getElementById('productList');
      productList.innerHTML = ''; // Clear existing products
  
      currentPageCards.forEach(card => {
        productList.appendChild(card);
      });
  
      // Update pagination controls
      updatePaginationControls();
    }
  // Update pagination controls
  function updatePaginationControls() {
    const totalPages = Math.ceil(filteredSortedCards.length / itemsPerPage);
    
    // Create page number links dynamically
    const pageNumbersContainer = document.getElementById('pageNumbers');
    pageNumbersContainer.innerHTML = ''; // Clear previous page numbers
  
    for (let i = 1; i <= totalPages; i++) {
      const pageLink = document.createElement('li');
      pageLink.classList.add('page-item');
      pageLink.innerHTML = `<a class="page-link" href="#">${i}</a>`;
  
      // Highlight the current page
      if (i === currentPage) {
        pageLink.classList.add('active');
      }
  
      pageLink.addEventListener('click', function (event) {
        event.preventDefault();
        currentPage = i;
        displayPage(currentPage); // Display the selected page
      });
  
      pageNumbersContainer.appendChild(pageLink);
    }
  
    // Disable Prev and Next buttons based on current page
    document.getElementById('prevBtn').classList.toggle('disabled', currentPage === 1);
    document.getElementById('nextBtn').classList.toggle('disabled', currentPage === totalPages);
  }
  
    // Handle previous button click
    document.getElementById('prevBtn').addEventListener('click', function() {
      if (currentPage > 1) {
        currentPage--;
        displayPage(currentPage);
      }
    });
  
    // Handle next button click
    document.getElementById('nextBtn').addEventListener('click', function() {
      const totalPages = Math.ceil(filteredSortedCards.length / itemsPerPage);
      if (currentPage < totalPages) {
        currentPage++;
        displayPage(currentPage);
      }
    });
  
    // Initialize product list
    function initializeProducts() {
      // Start with all products
      filteredSortedCards = [...productCards];
  
      // Apply sorting and filtering
      filteredSortedCards = sortProducts(filteredSortedCards);
      filteredSortedCards = filterProducts(filteredSortedCards);
  
      // Display first page of products
      currentPage = 1;
      displayPage(currentPage);
    }
  
    // Add event listeners for sort and filter changes
    sortSelect.addEventListener('change', function() {
      initializeProducts();
    });
  
    filterSelect.addEventListener('change', function() {
      initializeProducts();
    });
  
    // Initialize the page
    initializeProducts();
  });
