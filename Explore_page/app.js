let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.querySelector('.icon-cart span');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');
let products = [];
let cart = [];

iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});
closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

// Add product data to HTML
const addDataToHTML = () => {
    if (products.length > 0) {
        products.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.dataset.id = product.id;
            newProduct.classList.add('item');
            newProduct.innerHTML = `
                <img src="${product.image}" alt="" class="product-image">
                <h2>${product.name}</h2>
                <div class="price">RS.${product.price}</div>
                <button class="addCart">Add To Cart</button>`;
            listProductHTML.appendChild(newProduct);
        });
    }
};

// Handle image click for redirection
listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;

    // Handle Add to Cart
    if (positionClick.classList.contains('addCart')) {
        let id_product = positionClick.parentElement.dataset.id;
        addToCart(id_product);
    }

    // Handle Image Click - Redirect to another page
    if (positionClick.classList.contains('product-image')) {
        let id_product = positionClick.parentElement.dataset.id;
        localStorage.setItem('selectedProduct', id_product);
        window.location.href = `product-details.html?id=${id_product}`;
    }
});

// Add item to cart
const addToCart = (product_id) => {
    let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);
    if (cart.length <= 0) {
        cart = [{
            product_id: product_id,
            quantity: 1
        }];
    } else if (positionThisProductInCart < 0) {
        cart.push({
            product_id: product_id,
            quantity: 1
        });
    } else {
        cart[positionThisProductInCart].quantity += 1;
    }
    addCartToHTML();
    addCartToMemory();
};

// Save cart to localStorage
const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

// Display cart items in HTML
const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    if (cart.length > 0) {
        cart.forEach(item => {
            totalQuantity += item.quantity;
            let newItem = document.createElement('div');
            newItem.classList.add('item');
            newItem.dataset.id = item.product_id;

            let positionProduct = products.findIndex((value) => value.id == item.product_id);
            let info = products[positionProduct];
            listCartHTML.appendChild(newItem);
            newItem.innerHTML = `
                <div class="image">
                    <img src="${info.image}">
                </div>
                <div class="name">${info.name}</div>
                <div class="totalPrice">RS.${info.price * item.quantity}</div>
                <div class="quantity">
                    <span class="minus"><</span>
                    <span>${item.quantity}</span>
                    <span class="plus">></span>
                </div>`;
        });
    }
    iconCartSpan.innerText = totalQuantity;
};

// Handle cart item quantity changes
listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = positionClick.classList.contains('plus') ? 'plus' : 'minus';
        changeQuantityCart(product_id, type);
    }
});

// Change item quantity in cart
const changeQuantityCart = (product_id, type) => {
    let positionItemInCart = cart.findIndex((value) => value.product_id == product_id);
    if (positionItemInCart >= 0) {
        if (type === 'plus') {
            cart[positionItemInCart].quantity += 1;
        } else {
            let changeQuantity = cart[positionItemInCart].quantity - 1;
            if (changeQuantity > 0) {
                cart[positionItemInCart].quantity = changeQuantity;
            } else {
                cart.splice(positionItemInCart, 1);
            }
        }
    }
    addCartToHTML();
    addCartToMemory();
};

// Initialize the app
const initApp = () => {
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            products = data;
            addDataToHTML();

            if (localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'));
                addCartToHTML();
            }
        });
};

initApp();
let params = new URLSearchParams(window.location.search);
let productId = params.get('id') || localStorage.getItem('selectedProduct');

// Fetch product details from products.json
fetch('products.json')
    .then(response => response.json())
    .then(products => {
        let product = products.find(p => p.id == productId);
        if (product) {
            document.querySelector('.product-image').src = product.image;
            document.querySelector('.product-name').textContent = product.name;
            document.querySelector('.product-price').textContent = `RS.${product.price}`;
            // Add more product details as needed
        }
    });

// Perform search function
function performSearch() {
    const query = document.getElementById('search').value.toLowerCase();
    const resultsDiv = document.querySelector('.listProduct');

    // Clear previous results
    resultsDiv.innerHTML = '';

    // Filter results based on query from the actual products
    const results = products.filter(product => 
        product.name.toLowerCase().includes(query)
    );

    // Display results
    if (results.length > 0) {
        results.forEach(product => {
            const productItem = document.createElement('div');
            productItem.dataset.id = product.id; // Set the data-id for cart functionality
            productItem.classList.add('item');
            productItem.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <h2>${product.name}</h2>
                <div class="price">RS.${product.price}</div>
                <button class="addCart">Add To Cart</button>`;
            resultsDiv.appendChild(productItem);
        });
    } else {
        resultsDiv.innerHTML = '<p>No results found.</p>';
    }
}
