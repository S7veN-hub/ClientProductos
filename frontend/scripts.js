import config from './config.js'

let globalNumberPage = 1
window.addEventListener('load', () => {
    retrievingProducts(globalNumberPage)
})

let navSearch = document.querySelector('#nav_search')
navSearch.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
        event.preventDefault();
        let productName = navSearch.value
        console.log('Search for: ' + productName)
        if (productName === '') {
            globalNumberPage = 1
            retrievingProducts(globalNumberPage)
        } else {
            globalNumberPage = 1
            retrievingProductsByName(productName, globalNumberPage)
        }
    }
})

let navPaginationPrev = document.querySelector('#nav_pagination_prev')
navPaginationPrev.addEventListener('click', event => {
    event.preventDefault();
    --globalNumberPage
    let productName = navSearch.value
    if (productName === '') {
        retrievingProducts(globalNumberPage)
    } else {
        retrievingProductsByName(productName, globalNumberPage)
    }
})

let navPaginationNext = document.querySelector('#nav_pagination_next')
navPaginationNext.addEventListener('click', event => {
    event.preventDefault();
    ++globalNumberPage
    let productName = navSearch.value
    if (productName === '') {
        retrievingProducts(globalNumberPage)
    } else {
        retrievingProductsByName(productName, globalNumberPage)
    }
})

function retrievingProducts(globalNumberPage) {
    getProducts(globalNumberPage)
    .then(products => {
        printProducts(products)
    })
}

function retrievingProductsByName(productName, globalNumberPage) {
    getProductsByName(productName, globalNumberPage)
    .then(products => {
        printProducts(products)
    })
}

async function getProducts(numberPage) {
    const result = await fetch(config.apiUrl + '/products' + '?numberPage=' + numberPage)
    const data = await result.json()
    const result2 = await fetch(config.apiUrl + '/products' + '?numberPage=' + (numberPage + 1))
    const data2 = await result2.json()
    checkPagination(numberPage, data2)
    return data
}

async function getProductsByName(productName, numberPage) {
    const result = await fetch(config.apiUrl + '/products' + '/search_product' + '?product_name=' + productName + '&numberPage=' + numberPage)
    const data = await result.json()
    const result2 = await fetch(config.apiUrl + '/products' + '/search_product' + '?product_name=' + productName + '&numberPage=' + (numberPage + 1))
    const data2 = await result2.json()
    checkPagination(numberPage, data2)
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

function checkPagination(numberPage, data) {
    if (numberPage <= 1) {
        let prevButton = document.querySelector('#nav_pagination_prev')
        prevButton.className = 'nav_pagination_item_disabled'
        if (data.length > 0) {
            let nextButton = document.querySelector('#nav_pagination_next')
            nextButton.className = 'nav_pagination_item'
        } else {
            let nextButton = document.querySelector('#nav_pagination_next')
            nextButton.className = 'nav_pagination_item_disabled'
        }
    } else {
        let prevButton = document.querySelector('#nav_pagination_prev')
        prevButton.className = 'nav_pagination_item'
        if (data.length > 0) {
            let nextButton = document.querySelector('#nav_pagination_next')
            nextButton.className = 'nav_pagination_item'
        } else {
            let nextButton = document.querySelector('#nav_pagination_next')
            nextButton.className = 'nav_pagination_item_disabled'
        }
    }
}