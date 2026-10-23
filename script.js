let cart = JSON.parse(localStorage.getItem("stepStyleCart")) || [];
let total = 0;
let selectedCategory = "all";

// Add product to cart
function addToCart(productName, price) {
    cart.push({
        name: productName,
        price: price
    });

    updateCart();
}

// Remove product from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

// Update cart items and total
function updateCart() {
    const cartCount = document.getElementById("cart-count");
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const headerCartCount = document.getElementById("header-cart-count");

    total = 0;
    cartItems.innerHTML = "";

    cart.forEach(function(product, index) {
        total += product.price;

        const item = document.createElement("li");
        item.textContent =
            product.name + " - ₹" + product.price + " ";

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove ❌";

        removeButton.onclick = function() {
            removeFromCart(index);
        };

        item.appendChild(removeButton);
        cartItems.appendChild(item);
    });
cartCount.textContent = cart.length;
headerCartCount.textContent = cart.length;
cartTotal.textContent = total;
localStorage.setItem("stepStyleCart", JSON.stringify(cart));

}

// Search products and apply category filter
function searchProducts() {
    const searchText = document
        .getElementById("searchInput")
        .value.toLowerCase().trim();

    const products = document.querySelectorAll(".product-card");

    products.forEach(function(product) {
        const productName = product.querySelector("h3")
            .textContent.toLowerCase();

        const matchesSearch = productName.includes(searchText);

        const matchesCategory =
            selectedCategory === "all" ||
            (selectedCategory === "shoes" &&
                ["shoes", "sneakers"].includes(product.id)) ||
            (selectedCategory === "sandals" &&
                ["sandals", "heels"].includes(product.id));

        product.style.display =
            matchesSearch && matchesCategory ? "" : "none";
    });
}

// Filter products by category
function filterCategory(category, button) {
    selectedCategory = category;

    document.querySelectorAll(".category-btn").forEach(function(btn) {
        btn.classList.remove("active");
    });

    button.classList.add("active");

    searchProducts();
}

// Clear the entire cart
function clearCart() {
    cart = [];
    updateCart();
}

 // Load saved customer reviews
let savedReviews = JSON.parse(
    localStorage.getItem("stepStyleReviews")
) || [];

const reviewForm = document.getElementById("review-form");
const reviewList = document.getElementById("review-list");

// Function to display one review
function displayReview(review) {
    const reviewItem = document.createElement("div");
    reviewItem.className = "review-item";

    const reviewName = document.createElement("h3");
    reviewName.textContent = review.name;

    const reviewRating = document.createElement("p");
    reviewRating.textContent =
        "Rating: " + "⭐".repeat(Number(review.rating));

    const reviewMessage = document.createElement("p");
    reviewMessage.textContent = review.message;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-review";
    deleteButton.textContent = "Delete Review 🗑️";

    deleteButton.addEventListener("click", function() {
        savedReviews = savedReviews.filter(function(item) {
            return item !== review;
        });

        localStorage.setItem(
            "stepStyleReviews",
            JSON.stringify(savedReviews)
        );

        reviewItem.remove();
    });

    reviewItem.appendChild(reviewName);
    reviewItem.appendChild(reviewRating);
    reviewItem.appendChild(reviewMessage);
    reviewItem.appendChild(deleteButton);

    reviewList.appendChild(reviewItem);
}

// Display saved reviews when the page opens
savedReviews.forEach(function(review) {
    displayReview(review);
});

// Submit a new customer review
reviewForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("review-name").value.trim();
    const rating = document.getElementById("review-rating").value;
    const message = document.getElementById("review-message").value.trim();

    const review = {
        name: name,
        rating: rating,
        message: message
    };

    savedReviews.push(review);

    localStorage.setItem(
        "stepStyleReviews",
        JSON.stringify(savedReviews)
    );

    displayReview(review);
    reviewForm.reset();
});

// Display cart when the page opens
updateCart();
