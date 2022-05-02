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
let cartElements = new Array(0);

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

function buyItem(element, e) {
    quant = 1;

    // Get the product key
    let key = e.target.closest('.product-card').getAttribute('data-key');
    productKey = key;

    let identifier = products[productKey].id + '-';
    key = cartElements.findIndex((item) => item.identifier == identifier); 

    if(key > -1 && jorgeFortune > cartElements[key].price) {
        cartElements[key].qtCart ++;        
    } 

    if(cartElements[key] === undefined && jorgeFortune >= products[productKey].price){
        cartElements.push({
            identifier,
            id: products[productKey].id,
            qtCart: quant,
            price: products[productKey].price,
        });      
    } 


    
    for (let i in cartElements) {

        console.log(cartElements[i].id)

        cartElements[i].price > jorgeFortune ? e.target.disabled = true : e.target.disabled = false;
    
        if (jorgeFortune - cartElements[i].price > 0 && jorgeFortune >= cartElements[i].price)
            jorgeFortune -= cartElements[i].price;

        if(cartElements[i].qtCart > 0)
            element.querySelector('.product--qtd').value = cartElements[i].qtCart;
            element.querySelector('.product--remove').classList.remove('disabled'); 
            updateTotal(); 
    }

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
        
        updateTotal();                   
        }                                        
    }; 
 
    disableButton();
}

function updateTotal() {
    totalMoneyElement.innerHTML = `${jorgeFortune.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}`;
}

function disableButton() {
    let cards = document.querySelectorAll('.product-card');
    cards.forEach((item) => {
        let priceItem = parseInt(item.querySelector('.product--price').textContent.replace(/[R$ .]/g,''));
        
        let buyBtn = item.querySelector('.product--add');

        priceItem > jorgeFortune ? buyBtn.disabled = true : buyBtn.disabled = false;
    });
}
