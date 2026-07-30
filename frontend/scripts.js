import config from './config.js'

addEventListener('load', () => {
    getProducts()
    .then(products => printProducts(products))
})

async function getProducts(numberPage=1) {
    const result = await fetch(config.apiUrl + '/products' + '?numberPage=' + numberPage)
    const data = await result.json()
    return data
}

function printProducts(products) {
    let innerHTML = ''
    let cardContainer = document.querySelector('#main_card_section_container')
    for (const product of products) {
        innerHTML += `
        <div class="card_container">
            <div class="card_container_image">
                <img src="${config.apiUrl}${product.image}" alt="${product.name}">
            </div>
            <div class="card_container_info">
                <ul>
                    <li class="li_name"><span class="card_header">Name: </span><span class="card_info">${product.name}</span></li>
                    <li class="li_price"><span class="card_header">Price: </span><span class="card_info">${product.price}${config.currencyMap.get(product.currency)}</span></li>
                    <li class="li_discount"><span class="card_header">Discount: </span><span class="card_info">${product.discount > 0 ? `${product.discount}%` : config.discountDefault}</span></li>
                    <li class="li_stock"><span class="card_header">Stock: </span><span class="card_info">${product.stock}</span></li>
                    <li class="li_description"><span class="card_header">Description: </span><span class="card_info">${product.description}</span></li>
                </ul>
            </div>
        </div>
        `
    }
    cardContainer.innerHTML = innerHTML
}