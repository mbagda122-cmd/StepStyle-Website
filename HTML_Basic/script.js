
let cart = JSON.parse(localStorage.getItem("stepStyleCart")) || [];
let total = 0;
let selectedCategory = "all";

// Add product to cart
function addToCart(productName, price, button) {

    let selectedSize = "";

    if (button && button.closest(".product-card")) {
        const card = button.closest(".product-card");
        const sizeSelect = card.querySelector(".product-size");

        if (sizeSelect) {
            selectedSize = sizeSelect.value;

            if (selectedSize === "") {
                alert("Please select your size first!");
                return;
            }
        }
    }

    cart.push({
        name: productName,
        price: Number(price),
        size: selectedSize
    });

    updateCart();

    if (button && button.tagName === "BUTTON") {
        button.textContent = "Added ✓";

        setTimeout(function() {
            button.textContent = "Add to Cart 🛒";
        }, 1200);
    }

    alert(productName + " added to cart!");
}

// Remove product from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

// Update cart on every page
function updateCart() {
    const cartCount = document.getElementById("cart-count");
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const headerCartCount = document.getElementById("header-cart-count");

    total = 0;

    if (cartItems) {
        cartItems.innerHTML = "";
    }

    cart.forEach(function(product, index) {
        total += Number(product.price) || 0;

        if (cartItems) {
            const item = document.createElement("li");

            let itemText =
                product.name + " - ₹" +
                Number(product.price).toLocaleString("en-IN");

            if (product.size) {
                itemText += " | Size: " + product.size;
            }

            item.appendChild(document.createTextNode(itemText + " "));

            const removeButton = document.createElement("button");
            removeButton.textContent = "Remove ❌";

            removeButton.onclick = function() {
                removeFromCart(index);
            };

            item.appendChild(removeButton);
            cartItems.appendChild(item);
        }
    });

    if (cartCount) {
        cartCount.textContent = cart.length;
    }

    if (headerCartCount) {
        headerCartCount.textContent = cart.length;
    }

    if (cartTotal) {
        cartTotal.textContent = total.toLocaleString("en-IN");
    }

    localStorage.setItem("stepStyleCart", JSON.stringify(cart));
}

// Search products
function searchProducts() {
    const searchInput = document.getElementById("searchInput");

    if (!searchInput) return;

    const searchText = searchInput.value.toLowerCase().trim();
    const products = document.querySelectorAll(".product-card");

    products.forEach(function(product) {
        const nameElement = product.querySelector("h3");

        if (!nameElement) return;

        const productName = nameElement.textContent.toLowerCase();
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

    if (button) {
        button.classList.add("active");
    }

    searchProducts();
}

// Clear cart
function clearCart() {
    cart = [];
    updateCart();
}

// Customer reviews
let savedReviews =
    JSON.parse(localStorage.getItem("stepStyleReviews")) || [];

const reviewForm = document.getElementById("review-form");
const reviewList = document.getElementById("review-list");

function displayReview(review) {
    if (!reviewList) return;

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

if (reviewList) {
    savedReviews.forEach(function(review) {
        displayReview(review);
    });
}

if (reviewForm) {
    reviewForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const name =
            document.getElementById("review-name").value.trim();

        const rating =
            document.getElementById("review-rating").value;

        const message =
            document.getElementById("review-message").value.trim();

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
}

// Open product details page
function openProductDetails(button) {
    const card = button.closest(".product-card");

    if (!card) return;

    const image = card.querySelector("img");
    const name = card.querySelector("h3");
    const priceText = card.querySelector("p");

    if (!image || !name || !priceText) return;

    const productName = name.textContent.trim();
    const productPrice = priceText.textContent.replace(/[^\d]/g, "");

    let description =
        "Discover stylish and comfortable footwear for every step.";

    if (productName.toLowerCase().includes("running")) {
        description =
            "Comfortable running shoes for your everyday activities.";
    } else if (productName.toLowerCase().includes("sandal")) {
        description =
            "Stylish sandals designed for comfort and everyday wear.";
    } else if (productName.toLowerCase().includes("sneaker")) {
        description =
            "Classic sneakers to complete your everyday style.";
    } else if (productName.toLowerCase().includes("heel")) {
        description =
            "Elegant heels to add a stylish touch to your look.";
    }

    const params = new URLSearchParams({
        name: productName,
        price: productPrice,
        image: image.src,
        description: description
    });

    window.location.href =
        "product-details.html?" + params.toString();
}

// Load product details page
const detailsButton =
    document.getElementById("details-add-to-cart");

if (detailsButton) {
    const params = new URLSearchParams(window.location.search);

    const productName =
        params.get("name") || "Running Shoes";

    const productPrice =
        Number(params.get("price")) || 1499;

    const productImage = params.get("image");
    const productDescription = params.get("description");

    document.getElementById("detail-name").textContent =
        productName;

    document.getElementById("detail-price").textContent =
        "₹" + productPrice.toLocaleString("en-IN");

    if (productImage) {
        document.getElementById("detail-image").src = productImage;
    }

    if (productDescription) {
        document.getElementById("detail-description").textContent =
            productDescription;
    }

    detailsButton.addEventListener("click", function() {
        const sizeSelect = document.getElementById("detail-size");
        const size = sizeSelect ? sizeSelect.value : "";

        if (sizeSelect && !size) {
            alert("Please select your size first!");
            return;
        }

        addToCart(productName, productPrice, size);
        detailsButton.textContent = "Added to Cart ✓";
    });
}

// Load cart when page opens
updateCart();


function openProductDetails(button) {

    const card = button.closest(".product-card");

    const name = card.querySelector("h3").textContent;
    const price = card.querySelector("p").textContent;
    const image = card.querySelector("img").src;

    window.location.href =
        "product-details.html?name=" + encodeURIComponent(name) +
        "&price=" + encodeURIComponent(price.replace(/[^\d]/g, "")) +
        "&image=" + encodeURIComponent(image);
}

function openProductDetails(button) {
    const card = button.closest(".product-card");

    const name = card.querySelector("h3").textContent;
    const price = card.querySelector("p").textContent;
    const image = card.querySelector("img").src;

    const url = new URL("product-details.html", window.location.href);

    url.searchParams.set("name", name);
    url.searchParams.set("price", price.replace(/[^\d]/g, ""));
    url.searchParams.set("image", image);

    window.location.href = url.href;
}