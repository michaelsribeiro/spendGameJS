let moneyAmount = document.querySelector('.money');

currStickyPos = moneyAmount.getBoundingClientRect().top + window.scrollY;
window.onscroll = () => {
    if(window.scrollY > currStickyPos) {
        moneyAmount.classList.add('sticky-top');             
    } else {        
        moneyAmount.classList.remove('sticky-top');
    }
}

let cart = [];
let productKey = 0;

products.map((item, index) => {
    const productItem = document.querySelector('.model .product-card').cloneNode(true);
    let total = 72000000000.00;
    
    document.querySelector('.value').innerHTML = `${total.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}`;
    productItem.setAttribute('data-key', index);
    productItem.querySelector('.product--img img').src = item.img;
    productItem.querySelector('.product--name').innerHTML = item.name;
    productItem.querySelector('.product--price').innerHTML = `${item.price.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}`;
    productItem.querySelector('.product--qtd').value = 0;
    addToCart(productItem);

    document.querySelector('.products .row').append(productItem);
});

function addToCart(productItem) {
    productItem.querySelector('.product--add').addEventListener("click", (event) => {
        let key = event.target.closest('.product-card').getAttribute('data-key');
        let quant = 1;
        productKey = key;

        let identifier = products[productKey].id;
        key = cart.findIndex((item) => item.identifier == identifier);

        if(key > -1) {
            cart[key].qtCart += quant;
        } else {
            cart.push({
                identifier,
                id: products[productKey].id,
                qtCart: quant,
                price: products[productKey].price,
            });          
        }      
        updateCart(productItem);    
    });
}

function updateCart(productItem) {
    if(cart.length > 0){
        document.querySelector('.receipt').classList.remove('d-none');
        document.querySelector('.receipt').classList.add('d-flex');
        productItem.querySelector('.btn.btn-danger').classList.remove('disabled');
        let total = 72000000000.00;
        for(let i in cart) {
            let itemCart = products.find((item) => item.id == cart[i].id);
            let showCartItem = document.querySelector('.model .cart').cloneNode(true);
            total -= itemCart.price * cart[i].qtCart;
            productItem.querySelector('.product--qtd').value = cart[i].qtCart; 
            document.querySelector('.value').innerHTML = `${total.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}`;   
            showCartItem.querySelector('.cart-item').innerHTML = itemCart.name;
            showCartItem.querySelector('.cart-item-value').innerHTML = `${itemCart.price.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}`;
            document.querySelector('.receipt .items').append(showCartItem);
        }
    } else {
        document.querySelector('.receipt').classList.remove('d-flex');
        document.querySelector('.receipt').classList.add('d-none');
    }
}
