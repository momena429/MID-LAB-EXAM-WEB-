// Function to handle the search logic
function searchProducts() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const productCards = document.querySelectorAll('.product-card');

  productCards.forEach(card => {
    const productTitle = card.getAttribute('data-title');
    if (searchTerm.trim() === "" || productTitle.includes(searchTerm)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// Add event listener for search input
document.getElementById('searchInput').addEventListener('input', function () {
  searchProducts();  // Run search every time user types
});
