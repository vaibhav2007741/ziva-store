/* =========================================================
   ZIVA — MAIN SCRIPT
   Cart + Wishlist + Login + Search + Account + Orders
========================================================= */


/* =========================================================
   BASIC HELPERS
========================================================= */

function getZivaCart() {
    try {
        return JSON.parse(localStorage.getItem("zivaCart")) || [];
    } catch (error) {
        return [];
    }
}

function saveZivaCart(cart) {
    localStorage.setItem("zivaCart", JSON.stringify(cart));
}

function getZivaWishlist() {
    try {
        return JSON.parse(localStorage.getItem("zivaWishlist")) || [];
    } catch (error) {
        return [];
    }
}

function saveZivaWishlist(list) {
    localStorage.setItem("zivaWishlist", JSON.stringify(list));
}


/* =========================================================
   LOGIN
========================================================= */

function isZivaLoggedIn() {
    return localStorage.getItem("zivaLoggedIn") === "true";
}

function getZivaCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem("zivaCurrentUser")) || null;
    } catch (error) {
        return null;
    }
}


/* =========================================================
   ACCOUNT
========================================================= */

function openAccount() {

    if (isZivaLoggedIn()) {
        const user = getZivaCurrentUser();

        const name = user && user.name
            ? user.name
            : "ZIVA Customer";

        const modal = createZivaModal(
            "My Account",
            `
                <div style="text-align:center;padding:8px 0 4px;">
                    <div style="
                        width:65px;
                        height:65px;
                        border-radius:50%;
                        background:#f4d6b8;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        margin:0 auto 14px;
                        font-size:25px;
                        font-weight:800;
                    ">
                        ${name.charAt(0).toUpperCase()}
                    </div>

                    <h3 style="margin-bottom:5px;">
                        Hello, ${escapeHtml(name)}
                    </h3>

                    <p style="color:#777;font-size:13px;margin-bottom:18px;">
                        Welcome back to ZIVA
                    </p>

                    <button
                        onclick="window.location.href='my-orders.html'"
                        style="
                            width:100%;
                            padding:13px;
                            border:1px solid #241b19;
                            background:#241b19;
                            color:white;
                            border-radius:5px;
                            font-weight:700;
                            margin-bottom:9px;
                        "
                    >
                        📦 My Orders
                    </button>

                    <button
                        onclick="zivaLogout()"
                        style="
                            width:100%;
                            padding:13px;
                            border:1px solid #ddd;
                            background:white;
                            color:#241b19;
                            border-radius:5px;
                            font-weight:700;
                        "
                    >
                        Logout
                    </button>
                </div>
            `
        );

        document.body.appendChild(modal);

    } else {

        window.location.href = "login.html";
    }
}


function zivaLogout() {

    localStorage.removeItem("zivaLoggedIn");
    localStorage.removeItem("zivaCurrentUser");

    updateAccountButton();
    updateOrdersButton();
    updateMobileAccount();

    showZivaToast("Logged out successfully");

    setTimeout(function () {
        window.location.reload();
    }, 700);
}


/* =========================================================
   ACCOUNT BUTTON
========================================================= */

function updateAccountButton() {

    const accountButtons = document.querySelectorAll(
        "#accountButton, .account-button, [data-account-button]"
    );

    accountButtons.forEach(function (button) {

        if (isZivaLoggedIn()) {

            const user = getZivaCurrentUser();

            const name = user && user.name
                ? user.name
                : "Account";

            button.innerHTML = `
                <i class="fa-regular fa-user"></i>
                <span>${escapeHtml(name.split(" ")[0])}</span>
            `;

        } else {

            button.innerHTML = `
                <i class="fa-regular fa-user"></i>
                <span>Account</span>
            `;
        }

    });
}


/* =========================================================
   MOBILE ACCOUNT
========================================================= */

function updateMobileAccount() {

    const mobileAccount = document.getElementById("zivaMobileAccount");

    if (!mobileAccount) {
        return;
    }

    if (isZivaLoggedIn()) {

        const user = getZivaCurrentUser();

        const name = user && user.name
            ? user.name.split(" ")[0]
            : "Account";

        mobileAccount.innerHTML = `
            <span class="bottom-icon">
                <i class="fa-regular fa-user"></i>
            </span>
            <span>${escapeHtml(name)}</span>
        `;

    } else {

        mobileAccount.innerHTML = `
            <span class="bottom-icon">
                <i class="fa-regular fa-user"></i>
            </span>
            <span>Account</span>
        `;
    }
}


/* =========================================================
   ORDERS BUTTON
========================================================= */

function updateOrdersButton() {

    const headerActions = document.querySelector(".header-actions");

    if (!headerActions) {
        return;
    }

    let ordersButton = document.getElementById("zivaOrdersButton");

    if (!ordersButton) {

        ordersButton = document.createElement("button");

        ordersButton.id = "zivaOrdersButton";
        ordersButton.className = "ziva-orders-btn";

        ordersButton.innerHTML = `
            📦 Orders
        `;

        ordersButton.onclick = function () {
            window.location.href = "my-orders.html";
        };

        const cartButton = document.getElementById("cartButton");

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

        const style = document.createElement("style");

        style.innerHTML = `
            .ziva-orders-btn {
                border:1px solid #241b19;
                background:#fff;
                color:#241b19;
                padding:9px 13px;
                border-radius:25px;
                font-weight:700;
                cursor:pointer;
            }

            .ziva-orders-btn:hover {
                background:#241b19;
                color:#fff;
            }
        `;

        document.head.appendChild(style);
    }

    ordersButton.style.display =
        isZivaLoggedIn()
            ? "inline-flex"
            : "none";
}


/* =========================================================
   CART COUNT
========================================================= */

function updateCartCount() {

    const cart = getZivaCart();

    const totalQuantity = cart.reduce(function (total, item) {

        return total + Number(item.quantity || 1);

    }, 0);


    /* Desktop */

    const desktopCount =
        document.getElementById("cartCount");

    if (desktopCount) {

        desktopCount.textContent =
            totalQuantity;

        desktopCount.style.display =
            totalQuantity > 0
                ? "inline-block"
                : "none";
    }


    /* Mobile */

    const mobileCount =
        document.getElementById("zivaMobileCartCount");

    if (mobileCount) {

        mobileCount.textContent =
            totalQuantity;

        mobileCount.style.display =
            totalQuantity > 0
                ? "grid"
                : "none";
    }


    /* Generic */

    document.querySelectorAll(".ziva-cart-count").forEach(function (element) {

        element.textContent =
            totalQuantity;

        element.style.display =
            totalQuantity > 0
                ? "grid"
                : "none";
    });
}


/* =========================================================
   ADD TO CART
========================================================= */

function addToCart(product, selectedSize) {

    if (!product) {
        return;
    }


    /* Login required */

    if (!isZivaLoggedIn()) {

        localStorage.setItem(
            "zivaLoginRedirect",
            "cart.html"
        );

        showLoginRequiredModal();

        return;
    }


    const cart = getZivaCart();


    const productId =
        product.id ||
        product.productId ||
        product.name;


    const size =
        selectedSize ||
        product.size ||
        product.selectedSize ||
        "";


    const existingIndex =
        cart.findIndex(function (item) {

            return (
                String(item.id) === String(productId) &&
                String(item.size || "") === String(size || "")
            );

        });


    if (existingIndex !== -1) {

        cart[existingIndex].quantity =
            Number(cart[existingIndex].quantity || 1) + 1;

    } else {

        cart.push({
            id: productId,
            name: product.name || "ZIVA Product",
            price: Number(product.price || 0),
            image: product.image || "",
            category: product.category || "Fashion",
            size: size || "",
            quantity: 1
        });
    }


    saveZivaCart(cart);

    updateCartCount();

    showZivaToast("Added to ZIVA bag");
}


/* =========================================================
   DIRECT PRODUCT ADD
========================================================= */

function addProductToCart(product) {
    addToCart(product);
}


/* =========================================================
   CART BUTTON
========================================================= */

function openCart() {
    window.location.href = "cart.html";
}


/* =========================================================
   WISHLIST
========================================================= */

function toggleWishlist(product) {

    if (!product) {
        return;
    }

    const wishlist = getZivaWishlist();

    const id =
        product.id ||
        product.productId ||
        product.name;


    const index =
        wishlist.findIndex(function (item) {

            return String(item.id) === String(id);

        });


    if (index !== -1) {

        wishlist.splice(index, 1);

        saveZivaWishlist(wishlist);

        showZivaToast("Removed from wishlist");

    } else {

        wishlist.push({
            id: id,
            name: product.name || "ZIVA Product",
            price: Number(product.price || 0),
            image: product.image || "",
            category: product.category || "Fashion"
        });

        saveZivaWishlist(wishlist);

        showZivaToast("Added to wishlist");
    }


    updateWishlistButtons();
}


function updateWishlistButtons() {

    const wishlist = getZivaWishlist();

    document.querySelectorAll("[data-wishlist-id]").forEach(function (button) {

        const id =
            button.getAttribute("data-wishlist-id");

        const exists =
            wishlist.some(function (item) {

                return String(item.id) === String(id);

            });


        if (exists) {

            button.classList.add("active");

            button.innerHTML = "♥";

        } else {

            button.classList.remove("active");

            button.innerHTML = "♡";
        }

    });
}


/* =========================================================
   SEARCH
========================================================= */

function openSearch() {

    let searchOverlay =
        document.getElementById("zivaSearchOverlay");


    if (!searchOverlay) {

        searchOverlay =
            document.createElement("div");

        searchOverlay.id =
            "zivaSearchOverlay";

        searchOverlay.innerHTML = `
            <div class="ziva-search-box">

                <button
                    class="ziva-search-close"
                    onclick="closeSearch()"
                >
                    ×
                </button>

                <h2>Search ZIVA</h2>

                <div class="ziva-search-input-wrap">

                    <i class="fa-solid fa-magnifying-glass"></i>

                    <input
                        id="zivaSearchInput"
                        type="text"
                        placeholder="Search dresses, shirts, pants..."
                        autocomplete="off"
                    >

                </div>

                <div id="zivaSearchResults"></div>

            </div>
        `;

        document.body.appendChild(searchOverlay);


        const style =
            document.createElement("style");

        style.innerHTML = `
            #zivaSearchOverlay {
                position:fixed;
                inset:0;
                z-index:5000;
                background:rgba(36,27,25,.55);
                display:flex;
                justify-content:center;
                align-items:flex-start;
                padding:70px 15px 20px;
            }

            .ziva-search-box {
                width:100%;
                max-width:650px;
                background:#fff8f3;
                border-radius:12px;
                padding:25px;
                position:relative;
                box-shadow:0 25px 70px rgba(0,0,0,.25);
            }

            .ziva-search-box h2 {
                margin-bottom:18px;
            }

            .ziva-search-close {
                position:absolute;
                top:10px;
                right:15px;
                border:0;
                background:none;
                font-size:30px;
            }

            .ziva-search-input-wrap {
                height:48px;
                display:flex;
                align-items:center;
                gap:10px;
                padding:0 14px;
                background:white;
                border:1px solid #ddd;
                border-radius:8px;
            }

            .ziva-search-input-wrap input {
                width:100%;
                border:0;
                outline:0;
                background:transparent;
                font-size:14px;
            }

            #zivaSearchResults {
                margin-top:15px;
                max-height:400px;
                overflow:auto;
            }

            .ziva-search-result {
                display:flex;
                align-items:center;
                gap:12px;
                padding:10px 0;
                border-bottom:1px solid #eee;
                cursor:pointer;
            }

            .ziva-search-result img {
                width:55px;
                height:65px;
                object-fit:cover;
                border-radius:5px;
            }

            .ziva-search-result strong {
                font-size:13px;
            }

            .ziva-search-result small {
                display:block;
                margin-top:3px;
                color:#b87973;
            }
        `;

        document.head.appendChild(style);


        const input =
            document.getElementById("zivaSearchInput");


        input.addEventListener(
            "input",
            function () {

                searchZivaProducts(
                    input.value
                );

            }
        );
    }


    searchOverlay.style.display = "flex";


    setTimeout(function () {

        const input =
            document.getElementById("zivaSearchInput");

        if (input) {
            input.focus();
        }

    }, 100);
}


function closeSearch() {

    const overlay =
        document.getElementById("zivaSearchOverlay");

    if (overlay) {
        overlay.style.display = "none";
    }
}


function searchZivaProducts(query) {

    const results =
        document.getElementById("zivaSearchResults");

    if (!results) {
        return;
    }


    const search =
        String(query || "")
            .trim()
            .toLowerCase();


    if (!search) {

        results.innerHTML = `
            <p style="
                color:#777;
                font-size:13px;
                padding:15px 0;
            ">
                Search for products on ZIVA.
            </p>
        `;

        return;
    }


    let products = [];


    if (Array.isArray(window.zivaProducts)) {
        products = window.zivaProducts;
    }


    const matches =
        products.filter(function (product) {

            const text = `
                ${product.name || ""}
                ${product.category || ""}
                ${product.type || ""}
            `.toLowerCase();

            return text.includes(search);

        }).slice(0, 12);


    if (!matches.length) {

        results.innerHTML = `
            <p style="
                padding:15px 0;
                color:#777;
            ">
                No products found.
            </p>
        `;

        return;
    }


    results.innerHTML =
        matches.map(function (product) {

            return `
                <div
                    class="ziva-search-result"
                    onclick="openSearchedProduct('${escapeAttribute(product.id)}')"
                >

                    <img
                        src="${escapeAttribute(product.image || "")}"
                        alt=""
                    >

                    <div>
                        <strong>
                            ${escapeHtml(product.name || "ZIVA Product")}
                        </strong>

                        <small>
                            ₹${Number(product.price || 0).toLocaleString("en-IN")}
                        </small>
                    </div>

                </div>
            `;

        }).join("");
}


function openSearchedProduct(id) {

    const products =
        Array.isArray(window.zivaProducts)
            ? window.zivaProducts
            : [];

    const product =
        products.find(function (item) {

            return String(item.id) === String(id);

        });


    if (!product) {
        return;
    }


    localStorage.setItem(
        "zivaSelectedProduct",
        JSON.stringify(product)
    );


    window.location.href =
        "product.html";
}


/* =========================================================
   LOGIN REQUIRED MODAL
========================================================= */

function showLoginRequiredModal() {

    const modal =
        createZivaModal(
            "Login Required",
            `
                <div style="text-align:center;">

                    <div style="
                        font-size:40px;
                        margin-bottom:10px;
                    ">
                        🛍️
                    </div>

                    <p style="
                        color:#666;
                        font-size:14px;
                        margin-bottom:20px;
                    ">
                        Please login or create your ZIVA account
                        before adding products to your bag.
                    </p>

                    <button
                        onclick="window.location.href='login.html'"
                        style="
                            width:100%;
                            padding:13px;
                            border:0;
                            background:#241b19;
                            color:white;
                            border-radius:5px;
                            font-weight:800;
                        "
                    >
                        Login / Sign Up
                    </button>

                </div>
            `
        );

    document.body.appendChild(modal);
}


/* =========================================================
   CUSTOM MODAL
========================================================= */

function createZivaModal(title, content) {

    const wrapper =
        document.createElement("div");

    wrapper.className =
        "ziva-custom-modal";

    wrapper.innerHTML = `
        <div class="ziva-modal-backdrop"></div>

        <div class="ziva-modal-card">

            <button
                class="ziva-modal-close"
                aria-label="Close"
            >
                ×
            </button>

            <h2>${escapeHtml(title)}</h2>

            <div class="ziva-modal-content">
                ${content}
            </div>

        </div>
    `;


    const style =
        document.createElement("style");


    style.innerHTML = `
        .ziva-custom-modal {
            position:fixed;
            inset:0;
            z-index:6000;
            display:flex;
            align-items:center;
            justify-content:center;
            padding:20px;
        }

        .ziva-modal-backdrop {
            position:absolute;
            inset:0;
            background:rgba(36,27,25,.55);
        }

        .ziva-modal-card {
            width:100%;
            max-width:430px;
            max-height:90vh;
            overflow:auto;
            position:relative;
            z-index:2;
            background:#fff8f3;
            border-radius:12px;
            padding:25px;
            box-shadow:0 25px 70px rgba(0,0,0,.25);
        }

        .ziva-modal-card h2 {
            margin-bottom:20px;
            font-size:22px;
        }

        .ziva-modal-close {
            position:absolute;
            top:9px;
            right:13px;
            width:35px;
            height:35px;
            border:0;
            background:transparent;
            font-size:27px;
            cursor:pointer;
        }
    `;


    document.head.appendChild(style);


    const close =
        function () {
            wrapper.remove();
        };


    wrapper
        .querySelector(".ziva-modal-close")
        .addEventListener("click", close);


    wrapper
        .querySelector(".ziva-modal-backdrop")
        .addEventListener("click", close);


    return wrapper;
}


/* =========================================================
   TOAST
========================================================= */

function showZivaToast(message) {

    const oldToast =
        document.querySelector(".ziva-toast");

    if (oldToast) {
        oldToast.remove();
    }


    const toast =
        document.createElement("div");

    toast.className =
        "ziva-toast";

    toast.textContent =
        message;


    const style =
        document.createElement("style");

    style.innerHTML = `
        .ziva-toast {
            position:fixed;
            left:50%;
            bottom:90px;
            transform:translateX(-50%);
            z-index:7000;
            background:#241b19;
            color:#fff;
            padding:12px 18px;
            border-radius:30px;
            font-size:12px;
            font-weight:700;
            box-shadow:0 10px 30px rgba(0,0,0,.2);
            animation:zivaToastIn .25s ease;
        }

        @keyframes zivaToastIn {
            from {
                opacity:0;
                transform:translate(-50%,10px);
            }

            to {
                opacity:1;
                transform:translate(-50%,0);
            }
        }
    `;

    document.head.appendChild(style);

    document.body.appendChild(toast);


    setTimeout(function () {

        toast.style.opacity = "0";

        setTimeout(function () {
            toast.remove();
        }, 250);

    }, 1800);
}


/* =========================================================
   MOBILE BOTTOM NAV
========================================================= */

function setupMobileNavigation() {

    const bottomNav =
        document.querySelector(".ziva-bottom-nav");

    if (!bottomNav) {
        return;
    }


    const home =
        document.getElementById("zivaMobileHome");

    const categories =
        document.getElementById("zivaMobileCategories");

    const wishlist =
        document.getElementById("zivaMobileWishlist");

    const account =
        document.getElementById("zivaMobileAccount");

    const cart =
        document.getElementById("zivaMobileCart");


    if (home) {

        home.onclick = function () {

            window.location.href =
                "index.html";
        };
    }


    if (categories) {

        categories.onclick = function () {

            const section =
                document.querySelector(
                    ".categories-section"
                );

            if (section) {

                section.scrollIntoView({
                    behavior: "smooth"
                });

            } else {

                window.location.href =
                    "index.html#categories";
            }
        };
    }


    if (wishlist) {

        wishlist.onclick = function () {

            const list =
                getZivaWishlist();

            if (!list.length) {

                showZivaToast(
                    "Your wishlist is empty"
                );

                return;
            }

            window.location.href =
                "index.html#wishlist";
        };
    }


    if (account) {

        account.onclick =
            openAccount;
    }


    if (cart) {

        cart.onclick =
            openCart;
    }
}


/* =========================================================
   PRODUCT IMAGE / TITLE CLICK
========================================================= */

function openProduct(product) {

    if (!product) {
        return;
    }

    localStorage.setItem(
        "zivaSelectedProduct",
        JSON.stringify(product)
    );

    window.location.href =
        "product.html";
}


/* =========================================================
   CHECKOUT
========================================================= */

function goToCheckout() {

    if (!isZivaLoggedIn()) {

        localStorage.setItem(
            "zivaCheckoutPending",
            "true"
        );

        showLoginRequiredModal();

        return;
    }

    window.location.href =
        "checkout.html";
}


/* =========================================================
   ESCAPE HELPERS
========================================================= */

function escapeHtml(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function escapeAttribute(value) {
    return escapeHtml(value)
        .replace(/`/g, "&#096;");
}


/* =========================================================
   GLOBAL KEYBOARD
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {

            closeSearch();

            const modal =
                document.querySelector(
                    ".ziva-custom-modal"
                );

            if (modal) {
                modal.remove();
            }
        }
    }
);


/* =========================================================
   PAGE LOAD
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateCartCount();

        updateAccountButton();

        updateOrdersButton();

        updateMobileAccount();

        updateWishlistButtons();

        setupMobileNavigation();


        /* Search buttons */

        document
            .querySelectorAll(
                "[data-ziva-search], .search-button"
            )
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    openSearch
                );

            });


        /* Cart buttons */

        document
            .querySelectorAll(
                "[data-ziva-cart]"
            )
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    openCart
                );

            });


        /* Account buttons */

        document
            .querySelectorAll(
                "[data-ziva-account]"
            )
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    openAccount
                );

            });


        /* Login redirect after login */

        if (isZivaLoggedIn()) {

            const redirect =
                localStorage.getItem(
                    "zivaLoginRedirect"
                );

            if (redirect) {

                localStorage.removeItem(
                    "zivaLoginRedirect"
                );

            }
        }

    }
);


/* =========================================================
   CART STORAGE CHANGE
========================================================= */

window.addEventListener(
    "storage",
    function (event) {

        if (
            event.key === "zivaCart" ||
            event.key === "zivaWishlist" ||
            event.key === "zivaLoggedIn"
        ) {

            updateCartCount();

            updateWishlistButtons();

            updateAccountButton();

            updateOrdersButton();

            updateMobileAccount();
        }

    }
);
