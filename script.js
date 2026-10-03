let cart = JSON.parse(localStorage.getItem("zivaCart")) || [];

// SAVE CART
function saveCart() {
    localStorage.setItem("zivaCart", JSON.stringify(cart));
}

// UPDATE CART COUNT
function updateCartCount() {
    const buttons = document.querySelectorAll("#cartButton");

    buttons.forEach(button => {
        button.innerText = "🛍 Cart (" + cart.length + ")";
    });
}

// ADD PRODUCT
function addToCart() {

    const product = {
        id: "classic-dress",
        name: "Classic Fashion Dress",
        price: 799,
        image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=700&q=80",
        quantity: 1
    };

    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push(product);
    }

    saveCart();
    updateCartCount();

    alert("Product added to cart!");
}

// OPEN CART
document.addEventListener("DOMContentLoaded", function () {

    updateCartCount();

    const cartButtons = document.querySelectorAll("#cartButton");

    cartButtons.forEach(button => {
        button.addEventListener("click", function () {
            window.location.href = "cart.html";
        });
    });

    displayCart();
});


// DISPLAY CART
function displayCart() {

    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");

    if (!cartItems) {
        return;
    }

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-cart">
                <h2>Your cart is empty</h2>
                <p>Start shopping and add something you love.</p>
                <a href="index.html">Continue Shopping</a>
            </div>
        `;

        cartTotal.innerText = "0";
        return;
    }

    let total = 0;

    cart.forEach((item, index) => {

        total += item.price * item.quantity;

        cartItems.innerHTML += `
            <div class="cart-item">

                <img src="${item.image}" alt="${item.name}">

                <div class="cart-item-info">
                    <h3>${item.name}</h3>

                    <p class="cart-item-price">
                        ₹${item.price}
                    </p>

                    <div class="quantity">

                        <button onclick="changeQuantity(${index}, -1)">
                            −
                        </button>

                        <span>${item.quantity}</span>

                        <button onclick="changeQuantity(${index}, 1)">
                            +
                        </button>

                    </div>
                </div>

                <button
                    class="remove-btn"
                    onclick="removeFromCart(${index})">
                    REMOVE
                </button>

            </div>
        `;
    });

    cartTotal.innerText = total;
}


// CHANGE QUANTITY
function changeQuantity(index, change) {

    cart[index].quantity += change;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    saveCart();
    updateCartCount();
    displayCart();
}


// REMOVE PRODUCT
function removeFromCart(index) {

    cart.splice(index, 1);

    saveCart();
    updateCartCount();
    displayCart();
}// ZIVA SEARCH
function openSearch() {
    const searchTerm = prompt("What are you looking for?");

    if (searchTerm === null) {
        return;
    }

    const search = searchTerm.trim().toLowerCase();

    if (search === "") {
        return;
    }

    const products = {
        dress: "product.html",
        "classic fashion dress": "product.html"
    };

    if (products[search]) {
        window.location.href = products[search];
    } else {
        alert("Sorry, this product is not available yet.");
    }
}// ZIVA WISHLIST
let wishlist = JSON.parse(localStorage.getItem("zivaWishlist")) || [];

function addToWishlist() {

    const product = {
        id: "classic-dress",
        name: "Classic Fashion Dress",
        price: 799,
        image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=700&q=80"
    };

    const alreadyAdded = wishlist.some(item => item.id === product.id);

    if (alreadyAdded) {
        alert("Already in your wishlist ❤️");
        return;
    }

    wishlist.push(product);

    localStorage.setItem(
        "zivaWishlist",
        JSON.stringify(wishlist)
    );

    alert("Added to wishlist ❤️");
}