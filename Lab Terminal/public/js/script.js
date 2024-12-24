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

function addToWishlist(productId) {
  fetch(`/wishlist/add/${productId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })
    .then(response => response.json())
    .then(data => alert(data.message))
    .catch(error => alert('Error adding to wishlist.'));
}


// Add event listener for search input
document.getElementById('searchInput').addEventListener('input', function () {
  searchProducts();  // Run search every time user types
});
