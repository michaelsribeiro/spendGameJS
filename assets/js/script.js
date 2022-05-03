// Force page scroll position to top at page refresh.
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
} else {
    window.onbeforeunload = function () {
        window.scrollTo(0, 0);
    }
}

// Money bar fixed top
let moneyAmount = document.querySelector('.totalMoney');
currStickyPos = moneyAmount.getBoundingClientRect().top + window.scrollY;
window.onscroll = () => {
    if(window.scrollY > currStickyPos) {
        moneyAmount.classList.add('sticky-top');             
    } else {        
        moneyAmount.classList.remove('sticky-top');
    }
}

// Default data
let productKey = 0;
let quant = 0;
let jorgeFortune = 72000000000;
let cartElements = [];

// Elements
const productContainer = document.querySelector('.product-container .row');
let totalMoneyElement = document.querySelector('#totalMoney');
updateTotal();

products.forEach((item, index) => {
    const productItem = document.querySelector('.model .product-card').cloneNode(true);

    productItem.setAttribute('data-key', index);
    productItem.querySelector('.product--img img').src = item.img;
    productItem.querySelector('.product--name').innerHTML = item.name;
    productItem.querySelector('.product--price').innerHTML = `${item.price.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}`;
    productItem.querySelector('.product--qtd').value = 0;
    
    // Events
    productItem.addEventListener('click', (e) => {
        let element = e.target.parentElement.parentElement;

        if (e.target.classList.contains('product--add')) {
            buyItem(element, e);
        } else if (e.target.classList.contains('product--remove')) {
            sellItem(element, e);
        }
    });

    productContainer.appendChild(productItem);     
    disableButton();
});

function disableButton() {
    let cards = document.querySelectorAll('.product-card');
    cards.forEach((item) => {
        let priceItem = parseInt(item.querySelector('.product--price').textContent.replace(/[R$ .]/g,''));
        
        let buyBtn = item.querySelector('.product--add');
        priceItem > jorgeFortune ? buyBtn.disabled = true : buyBtn.disabled = false;
    });
}

function buyItem(element, e) {
    quant = 1;

    // Get the product key
    let key = e.target.closest('.product-card').getAttribute('data-key');
    productKey = key;
    
    let identifier = products[productKey].id + '-';
    key = cartElements.findIndex((item) => item.identifier == identifier);   
    
    if(key > -1 && jorgeFortune >= cartElements[key].price && jorgeFortune - cartElements[key].price > 0) {
        cartElements[key].qtCart += quant; 
        jorgeFortune -= cartElements[key].price; 
    }

    if(cartElements[key] === undefined && jorgeFortune >= products[productKey].price){
        cartElements.push({
            identifier,
            id: products[productKey].id,
            qtCart: quant,
            price: products[productKey].price,
        });  
        jorgeFortune -= products[productKey].price;     
    } 
    
    for (let i in cartElements) {
        
        cartElements[i].price > jorgeFortune ? e.target.disabled = true : e.target.disabled = false;       

        if(cartElements[i].qtCart > 0)
            element.querySelector('.product--qtd').value = cartElements[i].qtCart;
            element.querySelector('.product--remove').classList.remove('disabled'); 
    }  

    createAndUpdateReceipt();
    updateTotal(); 
    disableButton();    
}

function sellItem(element, e) {
    let sellBtn = element.querySelector('.product--remove');
    let qtd = element.querySelector('.product--qtd');
    let key = e.target.closest('.product-card').getAttribute('data-key');

    for(let i in cartElements){           

        if (cartElements[i].id === products[key].id) {
            cartElements[i].qtCart -= 1;
            qtd.value = cartElements[i].qtCart;
            jorgeFortune += cartElements[i].price;

            if (cartElements[i].qtCart === 0) {        
                cartElements.splice(i, 1);
                sellBtn.classList.add('disabled');
            }
            
            createAndUpdateReceipt();
            updateTotal(); 
            return       
        }      
    
    disableButton();                                       
    };
}

function createAndUpdateReceipt() {    
    let receiptElement = document.querySelector('.receipt');
    let receiptItem = document.querySelector('.receipt .items');
    let total = 0;

    if (cartElements.length > 0) {        
        receiptElement.classList.remove('d-none');
        receiptElement.classList.add('d-flex');
        receiptItem.innerHTML = '';

        for(let i in cartElements) {
            let element = document.querySelector('.cart').cloneNode(true);
            let cartItem = products.find((item) => item.id === cartElements[i].id);
            priceItem = cartItem.price;

            total += cartElements[i].price * cartElements[i].qtCart;

            element.querySelector('.cart-item').innerHTML = cartItem.name + ` x${cartElements[i].qtCart}`;
            element.querySelector('.cart-item-value').innerHTML = `${cartItem.price.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}`;
            document.querySelector('.total .value').innerHTML = `${total.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}`;

            receiptItem.append(element);
        }        
        
    } else {
        document.querySelector('.receipt').classList.remove('d-flex');
        document.querySelector('.receipt').classList.add('d-none');
    }
}

// Print receipt Function
function printReceipt(el){
    let print = document.querySelector(el).innerHTML;
    document.body.innerHTML = print;

    window.print();
}

function updateTotal() {
    totalMoneyElement.innerHTML = `${jorgeFortune.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}`;
}

