/* =========================================================
   ZIVA - MAIN SCRIPT
   Cart + Search + Login Popup + Wishlist + Quantity
   + Dynamic My Orders Button
========================================================= */

let cart = JSON.parse(localStorage.getItem("zivaCart")) || [];
let wishlist = JSON.parse(localStorage.getItem("zivaWishlist")) || [];


/* =========================================================
   STORAGE
========================================================= */

function saveCart() {
    localStorage.setItem("zivaCart", JSON.stringify(cart));
}

function saveWishlist() {
    localStorage.setItem("zivaWishlist", JSON.stringify(wishlist));
}


/* =========================================================
   LOGIN
========================================================= */

function isZivaLoggedIn() {
    return (
        localStorage.getItem("zivaLoggedIn") === "true" &&
        localStorage.getItem("zivaCurrentUser")
    );
}

function getCurrentUser() {
    try {
        return JSON.parse(
            localStorage.getItem("zivaCurrentUser") || "null"
        );
    } catch {
        return null;
    }
}


/* =========================================================
   ACCOUNT BUTTON
========================================================= */

window.openAccount = function () {

    if (isZivaLoggedIn()) {

        const user = getCurrentUser();

        showZivaMessage(
            "Welcome " + (user?.name || "ZIVA Customer"),
            "You are currently logged in.",
            "Logout",
            function () {

                localStorage.removeItem("zivaLoggedIn");
                localStorage.removeItem("zivaCurrentUser");

                updateAccountButton();
                updateOrdersButton();

                window.location.href = "index.html";
            }
        );

    } else {

        window.location.href = "login.html";

    }
};


function updateAccountButton() {

    const button =
        document.getElementById("accountButton");

    if (!button) return;

    const user = getCurrentUser();

    if (isZivaLoggedIn() && user) {

        button.innerText =
            "👤 " + user.name;

    } else {

        button.innerText =
            "👤 Login";

    }
}


/* =========================================================
   MY ORDERS BUTTON
   Hidden before login
   Visible after login
========================================================= */

function updateOrdersButton() {

    const headerActions =
        document.querySelector(".header-actions");

    if (!headerActions) return;


    let ordersButton =
        document.getElementById("zivaOrdersButton");


    /* CREATE BUTTON */

    if (!ordersButton) {

        ordersButton =
            document.createElement("button");

        ordersButton.id =
            "zivaOrdersButton";

        ordersButton.className =
            "ziva-orders-btn";

        ordersButton.innerHTML =
            "📦 Orders";

        ordersButton.onclick =
            function () {

                window.location.href =
                    "my-orders.html";

            };


        /* Insert before Cart */

        const cartButton =
            document.getElementById("cartButton");

        if (cartButton) {

            headerActions.insertBefore(
                ordersButton,
                cartButton
            );

        } else {

            headerActions.appendChild(
                ordersButton
            );

        }


        /* BUTTON CSS */

        if (
            !document.getElementById(
                "ziva-orders-button-style"
            )
        ) {

            const style =
                document.createElement("style");

            style.id =
                "ziva-orders-button-style";

            style.innerHTML = `

                .ziva-orders-btn {
                    border: 0;
                    background: transparent;
                    color: inherit;
                    cursor: pointer;
                    font: inherit;
                    padding: 8px 10px;
                    white-space: nowrap;
                    transition: .2s ease;
                }

                .ziva-orders-btn:hover {
                    opacity: .7;
                }

                @media(max-width:700px) {

                    .ziva-orders-btn {
                        padding: 7px 6px;
                        font-size: 13px;
                    }

                }

            `;

            document.head.appendChild(style);

        }

    }


    /* SHOW / HIDE */

    if (isZivaLoggedIn()) {

        ordersButton.style.display =
            "inline-flex";

    } else {

        ordersButton.style.display =
            "none";

    }

}


/* =========================================================
   ZIVA CUSTOM MODAL
========================================================= */

function createZivaModal() {

    if (document.getElementById("zivaModal")) {
        return;
    }

    const modal = document.createElement("div");

    modal.id = "zivaModal";

    modal.innerHTML = `

        <div class="ziva-modal-overlay">

            <div class="ziva-modal-box">

                <button
                    class="ziva-modal-close"
                    id="zivaModalClose">
                    ✕
                </button>

                <div class="ziva-modal-logo">
                    ZIVA
                </div>

                <div
                    class="ziva-modal-icon"
                    id="zivaModalIcon">
                    👤
                </div>

                <h2 id="zivaModalTitle">
                    Login required
                </h2>

                <p id="zivaModalText">
                    Please login or sign up to add this product to your bag.
                </p>

                <div
                    class="ziva-modal-buttons"
                    id="zivaModalButtons">

                    <button
                        class="ziva-modal-login"
                        id="zivaModalLogin">
                        Login
                    </button>

                    <button
                        class="ziva-modal-signup"
                        id="zivaModalSignup">
                        Sign Up
                    </button>

                </div>

                <button
                    class="ziva-modal-cancel"
                    id="zivaModalCancel">
                    Cancel
                </button>

            </div>

        </div>
    `;

    document.body.appendChild(modal);


    /* CSS */

    const style = document.createElement("style");

    style.id = "ziva-modal-style";

    style.innerHTML = `

        #zivaModal {
            display: none;
            position: fixed;
            inset: 0;
            z-index: 999999;
        }

        .ziva-modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,.55);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .ziva-modal-box {
            position: relative;
            width: min(430px, 94%);
            background: #fff;
            padding: 34px 28px 28px;
            text-align: center;
            box-shadow: 0 25px 80px rgba(0,0,0,.25);
            animation: zivaModalShow .2s ease;
        }

        @keyframes zivaModalShow {
            from {
                opacity: 0;
                transform: translateY(15px) scale(.97);
            }

            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }

        .ziva-modal-close {
            position: absolute;
            top: 12px;
            right: 15px;
            border: 0;
            background: transparent;
            font-size: 19px;
            cursor: pointer;
        }

        .ziva-modal-logo {
            font-size: 25px;
            font-weight: 700;
            letter-spacing: 5px;
            margin-bottom: 18px;
        }

        .ziva-modal-icon {
            font-size: 35px;
            margin-bottom: 10px;
        }

        .ziva-modal-box h2 {
            margin: 8px 0 10px;
            font-size: 22px;
        }

        .ziva-modal-box p {
            color: #666;
            line-height: 1.6;
            margin: 0 auto 24px;
            max-width: 330px;
            font-size: 14px;
        }

        .ziva-modal-buttons {
            display: flex;
            gap: 10px;
            justify-content: center;
        }

        .ziva-modal-buttons button {
            flex: 1;
            min-height: 45px;
            border: 0;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
        }

        .ziva-modal-login {
            background: #111;
            color: #fff;
        }

        .ziva-modal-signup {
            background: #eee;
            color: #111;
        }

        .ziva-modal-cancel {
            margin-top: 17px;
            border: 0;
            background: transparent;
            text-decoration: underline;
            cursor: pointer;
            color: #666;
        }

        @media(max-width:500px) {

            .ziva-modal-box {
                padding: 30px 20px 24px;
            }

            .ziva-modal-buttons {
                flex-direction: column;
            }

        }
    `;

    document.head.appendChild(style);


    /* CLOSE */

    document
        .getElementById("zivaModalClose")
        .onclick = closeZivaModal;

    document
        .getElementById("zivaModalCancel")
        .onclick = closeZivaModal;


    /* LOGIN */

    document
        .getElementById("zivaModalLogin")
        .onclick = function () {

            window.location.href = "login.html";

        };


    /* SIGN UP */

    document
        .getElementById("zivaModalSignup")
        .onclick = function () {

            localStorage.setItem(
                "zivaOpenSignup",
                "true"
            );

            window.location.href = "login.html";

        };
}


/* =========================================================
   SHOW LOGIN MODAL
========================================================= */

function showLoginRequired(product) {

    localStorage.setItem(
        "zivaPendingProduct",
        JSON.stringify({
            product: product,
            quantity: 1
        })
    );

    createZivaModal();

    document.getElementById("zivaModalTitle").innerText =
        "Login required";

    document.getElementById("zivaModalText").innerText =
        "Please login or sign up to add this product to your bag.";

    document.getElementById("zivaModalIcon").innerText =
        "👤";

    document.getElementById("zivaModalButtons").style.display =
        "flex";

    document.getElementById("zivaModalCancel").style.display =
        "block";

    document.getElementById("zivaModal").style.display =
        "block";
}


/* =========================================================
   GENERAL ZIVA MESSAGE
========================================================= */

function showZivaMessage(
    title,
    text,
    buttonText,
    buttonFunction
) {

    createZivaModal();

    document.getElementById("zivaModalTitle").innerText =
        title;

    document.getElementById("zivaModalText").innerText =
        text;

    document.getElementById("zivaModalIcon").innerText =
        "✓";

    const buttons =
        document.getElementById("zivaModalButtons");

    buttons.style.display = "block";

    buttons.innerHTML = `
        <button
            class="ziva-modal-login"
            id="zivaSingleModalButton"
            style="width:100%;min-height:45px;border:0;cursor:pointer;">
            ${buttonText}
        </button>
    `;

    document.getElementById(
        "zivaSingleModalButton"
    ).onclick = buttonFunction;

    document.getElementById(
        "zivaModalCancel"
    ).style.display = "block";

    document.getElementById(
        "zivaModal"
    ).style.display = "block";
}


function closeZivaModal() {

    const modal =
        document.getElementById("zivaModal");

    if (modal) {
        modal.style.display = "none";
    }

}


/* =========================================================
   CART COUNT
========================================================= */

function updateCartCount() {

    const buttons =
        document.querySelectorAll("#cartButton");

    let total = 0;

    cart.forEach(function (item) {
        total += Number(item.quantity) || 0;
    });

    buttons.forEach(function (button) {

        button.innerText =
            "🛍 Cart (" + total + ")";

    });
}


/* =========================================================
   GET PRODUCT FROM CARD
========================================================= */

function getProductFromCard(button) {

    if (!button) return null;

    const card =
        button.closest(".product-card");

    if (!card) return null;

    const image =
        card.querySelector(
            ".product-image img, img"
        );

    const title =
        card.querySelector("h3");

    const priceElement =
        card.querySelector(
            ".price, .product-price"
        );

    if (!image || !title) return null;

    const price =
        Number(
            priceElement
                ? priceElement.innerText
                    .replace(/[^\d.]/g, "")
                : 0
        ) || 0;

    return {

        id:
            card.dataset.productId ||
            "ziva-" +
            Date.now(),

        name:
            title.innerText.trim(),

        price:
            price,

        oldPrice:
            price,

        image:
            image.getAttribute("src"),

        category:
            card.dataset.category ||
            "Men"

    };
}


/* =========================================================
   ADD TO CART
========================================================= */

window.addToCart = function (product, button) {

    if (!product && !button) {

        try {
            button =
                window.event?.currentTarget;
        } catch {}

    }

    if (!product) {

        product =
            getProductFromCard(button);

    }

    if (!product) {

        showZivaMessage(
            "Product unavailable",
            "This product could not be added right now.",
            "Close",
            closeZivaModal
        );

        return;
    }


    if (!isZivaLoggedIn()) {

        showLoginRequired(product);

        return;
    }


    const existing =
        cart.find(function (item) {

            return item.cartId === product.id;

        });


    if (existing) {

        existing.quantity =
            Number(existing.quantity) + 1;

    } else {

        cart.push({

            cartId:
                product.id,

            id:
                product.id,

            name:
                product.name,

            price:
                Number(product.price) || 0,

            oldPrice:
                Number(product.oldPrice) || 0,

            image:
                product.image,

            quantity:
                1

        });

    }


    saveCart();
    updateCartCount();
    displayCart();


    showZivaMessage(
        "Added to Bag",
        product.name + " has been added to your ZIVA bag.",
        "Go to Cart",
        function () {

            window.location.href =
                "cart.html";

        }
    );

};


/* =========================================================
   ADD PRODUCT WITH SIZE
========================================================= */

function addProductWithSize(
    product,
    tshirtSize,
    pantSize,
    quantity
) {

    if (!isZivaLoggedIn()) {

        localStorage.setItem(
            "zivaPendingProduct",
            JSON.stringify({

                product: product,
                tshirtSize: tshirtSize,
                pantSize: pantSize,
                quantity: quantity

            })
        );

        showLoginRequired(product);

        return;
    }


    const cartId =
        product.id +
        "-" +
        tshirtSize +
        "-" +
        pantSize;


    const existing =
        cart.find(function (item) {

            return item.cartId === cartId;

        });


    if (existing) {

        existing.quantity +=
            Number(quantity) || 1;

    } else {

        cart.push({

            cartId: cartId,

            id: product.id,

            name: product.name,

            price:
                Number(product.price) || 0,

            oldPrice:
                Number(product.oldPrice) || 0,

            image: product.image,

            tshirtSize: tshirtSize,

            pantSize: pantSize,

            quantity:
                Number(quantity) || 1

        });

    }


    saveCart();
    updateCartCount();
    displayCart();


    showZivaMessage(
        "Added to Bag",
        "Your selected size and quantity have been added to your bag.",
        "Go to Cart",
        function () {

            window.location.href =
                "cart.html";

        }
    );
}


/* =========================================================
   CART QUANTITY
========================================================= */

window.changeQuantity = function (
    index,
    change
) {

    if (!cart[index]) return;

    cart[index].quantity =
        Number(cart[index].quantity) +
        change;


    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);

    }

    saveCart();
    updateCartCount();
    displayCart();
};


/* =========================================================
   REMOVE CART ITEM
========================================================= */

window.removeFromCart = function (index) {

    if (!cart[index]) return;

    cart.splice(index, 1);

    saveCart();
    updateCartCount();
    displayCart();
};


/* =========================================================
   DISPLAY CART
========================================================= */

function displayCart() {

    const container =
        document.getElementById("cartItems");

    if (!container) return;

    const subtotalElement =
        document.getElementById("cartSubtotal");

    const totalElement =
        document.getElementById("cartTotal");


    if (cart.length === 0) {

        container.innerHTML = `

            <div class="empty-cart">

                <h2>Your cart is empty</h2>

                <p>
                    Start shopping and add something you love.
                </p>

                <a href="index.html">
                    Continue Shopping
                </a>

            </div>
        `;

        if (subtotalElement)
            subtotalElement.innerText = "₹0";

        if (totalElement)
            totalElement.innerText = "₹0";

        return;
    }


    let total = 0;

    container.innerHTML = "";


    cart.forEach(function (item, index) {

        const price =
            Number(item.price) || 0;

        const quantity =
            Number(item.quantity) || 1;

        const itemTotal =
            price * quantity;

        total += itemTotal;


        container.innerHTML += `

            <div class="cart-item">

                <img
                    src="${item.image}"
                    alt="${item.name}"
                >

                <div class="cart-item-info">

                    <h3>
                        ${item.name}
                    </h3>

                    <p class="cart-item-price">
                        ₹${price}
                    </p>

                    ${
                        item.tshirtSize
                        ? `
                            <p>
                                T-Shirt Size:
                                <strong>
                                    ${item.tshirtSize}
                                </strong>
                            </p>
                        `
                        : ""
                    }

                    ${
                        item.pantSize
                        ? `
                            <p>
                                Pant Size:
                                <strong>
                                    ${item.pantSize}
                                </strong>
                            </p>
                        `
                        : ""
                    }

                    <div class="quantity">

                        <button
                            onclick="changeQuantity(${index}, -1)">
                            −
                        </button>

                        <span>
                            ${quantity}
                        </span>

                        <button
                            onclick="changeQuantity(${index}, 1)">
                            +
                        </button>

                    </div>

                    <p>
                        Total:
                        <strong>
                            ₹${itemTotal}
                        </strong>
                    </p>

                </div>

                <button
                    class="remove-btn"
                    onclick="removeFromCart(${index})">
                    REMOVE
                </button>

            </div>
        `;
    });


    if (subtotalElement)
        subtotalElement.innerText =
            "₹" + total;

    if (totalElement)
        totalElement.innerText =
            "₹" + total;
}


/* =========================================================
   SEARCH
========================================================= */

function getZivaProducts() {

    if (
        Array.isArray(window.zivaProducts)
    ) {
        return window.zivaProducts;
    }


    const cards =
        document.querySelectorAll(
            ".product-card"
        );

    const products = [];


    cards.forEach(function (card, index) {

        const image =
            card.querySelector("img");

        const title =
            card.querySelector("h3");

        const priceElement =
            card.querySelector(
                ".price, .product-price"
            );

        if (!image || !title) return;


        const price =
            Number(
                priceElement
                ? priceElement.innerText
                    .replace(/[^\d.]/g, "")
                : 0
            ) || 0;


        products.push({

            id:
                "ziva-search-" + index,

            name:
                title.innerText.trim(),

            price: price,

            image:
                image.getAttribute("src"),

            category:
                "Men"

        });

    });


    return products;
}


/* =========================================================
   SEARCH OVERLAY
========================================================= */

function createSearchOverlay() {

    if (
        document.getElementById(
            "zivaSearchOverlay"
        )
    ) {
        return;
    }


    const overlay =
        document.createElement("div");

    overlay.id =
        "zivaSearchOverlay";


    overlay.innerHTML = `

        <div class="ziva-search-box">

            <div class="ziva-search-top">

                <div class="ziva-search-logo">
                    ZIVA
                </div>

                <button
                    id="zivaSearchClose">
                    ✕
                </button>

            </div>


            <div class="ziva-search-input">

                <span>🔍</span>

                <input
                    id="zivaSearchInput"
                    type="search"
                    placeholder="Search ZIVA products..."
                    autocomplete="off"
                >

                <button
                    id="zivaSearchClear">
                    ✕
                </button>

            </div>


            <div
                class="ziva-search-results"
                id="zivaSearchResults">
            </div>

        </div>
    `;


    document.body.appendChild(
        overlay
    );


    const style =
        document.createElement("style");


    style.innerHTML = `

        #zivaSearchOverlay {
            display:none;
            position:fixed;
            inset:0;
            z-index:999998;
            background:rgba(0,0,0,.5);
            overflow-y:auto;
        }

        .ziva-search-box {
            width:min(900px,95%);
            margin:45px auto;
            background:#fff;
            padding:25px;
            box-shadow:0 20px 70px rgba(0,0,0,.25);
        }

        .ziva-search-top {
            display:flex;
            justify-content:space-between;
            align-items:center;
            margin-bottom:20px;
        }

        .ziva-search-logo {
            font-size:25px;
            font-weight:700;
            letter-spacing:5px;
        }

        .ziva-search-top button {
            border:0;
            background:transparent;
            font-size:20px;
            cursor:pointer;
        }

        .ziva-search-input {
            height:52px;
            border:1px solid #222;
            display:flex;
            align-items:center;
            gap:10px;
            padding:0 14px;
        }

        .ziva-search-input input {
            flex:1;
            border:0;
            outline:0;
            font-size:16px;
        }

        .ziva-search-input button {
            border:0;
            background:transparent;
            cursor:pointer;
        }

        .ziva-search-results {
            display:grid;
            grid-template-columns:repeat(3,1fr);
            gap:20px;
            margin-top:25px;
        }

        .ziva-search-card {
            cursor:pointer;
        }

        .ziva-search-card img {
            width:100%;
            aspect-ratio:3/4;
            object-fit:cover;
        }

        .ziva-search-card h4 {
            margin:8px 0 4px;
            font-size:14px;
        }

        .ziva-search-card p {
            margin:0;
        }

        .ziva-no-results {
            grid-column:1/-1;
            text-align:center;
            padding:50px 10px;
        }

        @media(max-width:600px) {

            .ziva-search-box {
                width:100%;
                min-height:100vh;
                margin:0;
                padding:18px;
            }

            .ziva-search-results {
                grid-template-columns:repeat(2,1fr);
                gap:12px;
            }
        }
    `;

    document.head.appendChild(style);


    document.getElementById(
        "zivaSearchClose"
    ).onclick = closeSearch;


    document.getElementById(
        "zivaSearchClear"
    ).onclick = function () {

        const input =
            document.getElementById(
                "zivaSearchInput"
            );

        input.value = "";

        renderSearchResults("");

        input.focus();
    };


    document.getElementById(
        "zivaSearchInput"
    ).oninput = function () {

        renderSearchResults(
            this.value
        );
    };
}


/* =========================================================
   OPEN SEARCH
========================================================= */

window.openSearch = function () {

    createSearchOverlay();

    const overlay =
        document.getElementById(
            "zivaSearchOverlay"
        );

    overlay.style.display = "block";

    document.body.style.overflow = "hidden";


    const input =
        document.getElementById(
            "zivaSearchInput"
        );

    setTimeout(function () {

        input.focus();

        renderSearchResults("");

    }, 50);
};


/* =========================================================
   CLOSE SEARCH
========================================================= */

function closeSearch() {

    const overlay =
        document.getElementById(
            "zivaSearchOverlay"
        );

    if (!overlay) return;

    overlay.style.display = "none";

    document.body.style.overflow = "";
}


/* =========================================================
   SEARCH RESULTS
========================================================= */

function renderSearchResults(term) {

    const box =
        document.getElementById(
            "zivaSearchResults"
        );

    if (!box) return;


    const products =
        getZivaProducts();


    term =
        String(term || "")
            .trim()
            .toLowerCase();


    if (!term) {

        box.innerHTML = `

            <div class="ziva-no-results">

                <h3>
                    Search ZIVA
                </h3>

                <p>
                    Find your favourite fashion products.
                </p>

            </div>
        `;

        return;
    }


    const results =
        products.filter(function (product) {

            const text =
                (
                    product.name +
                    " " +
                    (product.category || "")
                ).toLowerCase();

            return text.includes(term);

        });


    if (results.length === 0) {

        box.innerHTML = `

            <div class="ziva-no-results">

                <h3>
                    No products found
                </h3>

                <p>
                    Try searching another product.
                </p>

            </div>
        `;

        return;
    }


    box.innerHTML = "";


    results.forEach(function (product) {

        const card =
            document.createElement("div");

        card.className =
            "ziva-search-card";


        card.innerHTML = `

            <img
                src="${product.image}"
                alt="${product.name}"
            >

            <h4>
                ${product.name}
            </h4>

            <p>
                ₹${product.price}
            </p>
        `;


        card.onclick = function () {

            localStorage.setItem(
                "zivaSelectedProduct",
                JSON.stringify(product)
            );

            closeSearch();

            window.location.href =
                "product.html";
        };


        box.appendChild(card);

    });
}


/* =========================================================
   WISHLIST
========================================================= */

window.addToWishlist = function (product) {

    if (!product) return;


    const exists =
        wishlist.some(function (item) {

            return item.id === product.id;

        });


    if (exists) {

        showZivaMessage(
            "Already in Wishlist",
            "This product is already in your ZIVA wishlist.",
            "Close",
            closeZivaModal
        );

        return;
    }


    wishlist.push({

        id: product.id,

        name: product.name,

        price: product.price,

        image: product.image

    });


    saveWishlist();


    showZivaMessage(
        "Added to Wishlist",
        product.name + " has been added to your wishlist.",
        "Close",
        closeZivaModal
    );
};


/* =========================================================
   CART BUTTON
========================================================= */

function setupCartButton() {

    document
        .querySelectorAll("#cartButton")
        .forEach(function (button) {

            button.onclick = function () {

                window.location.href =
                    "cart.html";

            };

        });
}


/* =========================================================
   IMAGE / TITLE CLICK
========================================================= */

function setupProductCards() {

    document
        .querySelectorAll(".product-card")
        .forEach(function (card) {

            const image =
                card.querySelector(
                    ".product-image"
                );

            const title =
                card.querySelector("h3");

            const addButton =
                card.querySelector(
                    ".add-btn"
                );


            function openProduct() {

                const product =
                    getProductFromCard(
                        addButton
                    );

                if (!product) return;

                localStorage.setItem(
                    "zivaSelectedProduct",
                    JSON.stringify(product)
                );

                window.location.href =
                    "product.html";
            }


            if (image) {

                image.style.cursor =
                    "pointer";

                image.onclick =
                    openProduct;
            }


            if (title) {

                title.style.cursor =
                    "pointer";

                title.onclick =
                    openProduct;
            }

        });
}


/* =========================================================
   CHECKOUT
========================================================= */

window.checkoutMessage = function () {

    if (cart.length === 0) {

        showZivaMessage(
            "Your Bag Is Empty",
            "Add a product to your ZIVA bag before checkout.",
            "Continue Shopping",
            function () {

                closeZivaModal();

                window.location.href =
                    "index.html";

            }
        );

        return;
    }


    if (!isZivaLoggedIn()) {

        localStorage.setItem(
            "zivaCheckoutPending",
            "true"
        );

        showLoginRequired(
            cart[0]
        );

        return;
    }


    showZivaMessage(
        "Checkout",
        "Your checkout system will be connected next.",
        "Close",
        closeZivaModal
    );
};


/* =========================================================
   ESC KEY
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {

            closeSearch();
            closeZivaModal();

        }

    }
);


/* =========================================================
   PAGE LOAD
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        createZivaModal();

        updateCartCount();

        updateAccountButton();

        updateOrdersButton();

        setupCartButton();

        setupProductCards();

        displayCart();

    }
);