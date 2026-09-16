import config from './config.js'
let globalNumberPage = 1
let globalHistoryNumberPage = 1
window.addEventListener('load', () => {
    const page = document.body.getAttribute('data-page')
    switch (page) {
        case 'home':
            retrievingProducts(globalNumberPage)
            break
        case 'history':
            retrievingProductHistory(globalHistoryNumberPage)
            break
        case 'login':
            checkUserLoginIcon()
            break
        case 'register':
            checkUserLoginIcon()
            break
        case 'menu_login':
            checkMenuLogin()
            break
    }
})

let navSearch = document.querySelector('#nav_search')
if (navSearch) {
    navSearch.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            event.preventDefault();
            let productName = navSearch.value
            if (productName === '') {
                globalNumberPage = 1
                retrievingProducts(globalNumberPage)
            } else {
                globalNumberPage = 1
                retrievingProductsByName(productName, globalNumberPage)
            }
        }
    })
}

let navPaginationPrev = document.querySelector('#nav_pagination_prev')
if (navPaginationPrev) {
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
}

let navPaginationNext = document.querySelector('#nav_pagination_next')
if (navPaginationNext) {
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
}

let navPaginationHistoryPrev = document.querySelector('#nav_history_pagination_prev')
if (navPaginationHistoryPrev) {
    navPaginationHistoryPrev.addEventListener('click', event => {
        event.preventDefault();
        --globalHistoryNumberPage
        retrievingProductHistory(globalHistoryNumberPage)
    })
}

let navPaginationHistoryNext = document.querySelector('#nav_history_pagination_next')
if (navPaginationHistoryNext) {
    navPaginationHistoryNext.addEventListener('click', event => {
        event.preventDefault();
        ++globalHistoryNumberPage
        retrievingProductHistory(globalHistoryNumberPage)
    })
}

let formRegister = document.forms['form_register']
let formRegisterInputUsername = document.forms['form_register']? document.forms['form_register']['Username'] : null
let formRegisterInputEmail = document.forms['form_register']? document.forms['form_register']['Email'] : null
let formRegisterInputPassword = document.forms['form_register']? document.forms['form_register']['Password'] : null
let formRegisterInputConfirmPassword = document.forms['form_register']? document.forms['form_register']['ConfirmPassword'] : null
let errorMessage1 = document.querySelector('#error_message1')
let errorMessage2 = document.querySelector('#error_message2')
let errorMessage4 = document.querySelector('#error_message4')
let successMessage1 = document.querySelector('#success_message1')
let formRegisterButton = document.querySelector('#form_register button')

if (formRegisterInputUsername) formRegisterInputUsername.addEventListener('input', validateRegisterForm)
if (formRegisterInputEmail) formRegisterInputEmail.addEventListener('input', validateRegisterForm)
if (formRegisterInputPassword) formRegisterInputPassword.addEventListener('input', validateRegisterForm)
if (formRegisterInputConfirmPassword) formRegisterInputConfirmPassword.addEventListener('input', validateRegisterForm)
if (formRegister) formRegister.addEventListener('submit', async event => {
    event.preventDefault();
    const email = formRegisterInputEmail.value
    const username = formRegisterInputUsername.value
    const password = formRegisterInputPassword.value
    const role = 'user'
    const response = await fetch(config.apiUrl + '/register/check_user', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            name: username
        })
    })
    const data = await response.json()
    if (data.exists) {
        errorMessage2.style.display = 'block'
    } else {
        errorMessage2.style.display = 'none'
        const response2 = await fetch(config.apiUrl + '/register/register_user', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                name: username,
                password: password,
                role: role
            })
        })
        const data2 = await response2.json()
        if (data2.isSuccess) {
            successMessage1.style.display = 'block'
            errorMessage4.style.display = 'none'
            formRegisterInputUsername.value = ''
            formRegisterInputEmail.value = ''
            formRegisterInputPassword.value = ''
            formRegisterInputConfirmPassword.value = ''
            formRegisterButton.className = 'register_button_disabled'
        } else {
            errorMessage4.style.display = 'block'
            successMessage1.style.display = 'none'
        }
    }
})

let formLogin = document.forms['form_login']
let formLoginInputUsername = document.forms['form_login']? document.forms['form_login']['Username'] : null
let formLoginInputPassword = document.forms['form_login']? document.forms['form_login']['Password'] : null
let errorMessage3 = document.querySelector('#error_message3')
let formLoginButton = document.querySelector('#form_login button')

if (formLogin) formLogin.addEventListener('submit', async event => {
    event.preventDefault();
    const username = formLoginInputUsername.value
    const password = formLoginInputPassword.value
    const response = await fetch(config.apiUrl + '/login/login_user', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: username,
            password: password
        })
    })
    const data = await response.json()
    if (data.isSuccess) {
        errorMessage3.style.display = 'none'
        window.location.href = config.pageURL
    } else {
        errorMessage3.style.display = 'block'
    }
})
if (formLoginInputUsername) formLoginInputUsername.addEventListener('input', validateLoginForm)
if (formLoginInputPassword) formLoginInputPassword.addEventListener('input', validateLoginForm)

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

function retrievingProductHistory() {
    getProductHistory(globalHistoryNumberPage)
    .then(products => {
        printHistoryProducts(products)
    })
}

async function getProducts(numberPage) {
    await checkUserLoginIcon()
    const result = await fetch(config.apiUrl + '/products' + '?numberPage=' + numberPage, {
        method: 'GET',
        credentials: 'include'
    })
    const data = await result.json()
    const result2 = await fetch(config.apiUrl + '/products' + '?numberPage=' + (numberPage + 1), {
        method: 'GET',
        credentials: 'include'
    })
    const data2 = await result2.json()
    checkPagination(numberPage, data2.data)
    return data.data
}

async function getProductsByName(productName, numberPage) {
    await checkUserLoginIcon()
    const result = await fetch(config.apiUrl + '/products' + '/search_product' + '?product_name=' + productName + '&numberPage=' + numberPage, {
        method: 'GET',
        credentials: 'include'
    })
    const data = await result.json()
    const result2 = await fetch(config.apiUrl + '/products' + '/search_product' + '?product_name=' + productName + '&numberPage=' + (numberPage + 1), {
        method: 'GET',
        credentials: 'include'
    })
    const data2 = await result2.json()
    checkPagination(numberPage, data2.data)
    return data.data
}

async function getProductHistory(numberPage) {
    const userData = await checkUserLoginIcon()
    if (userData.isSuccess === false) return null
    const result = await fetch(config.apiUrl + '/products' + '/get_product_history' + `/${userData.data[0].user_id}` + '?numberPage=' + numberPage, {
        method: 'GET',
        credentials: 'include'
    })
    const data = await result.json()
    const result2 = await fetch(config.apiUrl + '/products' + '/get_product_history' + `/${userData.data[0].user_id}` + '?numberPage=' + (numberPage + 1), {
        method: 'GET',
        credentials: 'include'
    })
    const data2 = await result2.json()
    checkPaginationHistory(numberPage, data2.data)
    return data.data
}

async function checkUserLoginIcon() {
    const userLoginIcon = document.querySelector('.menu_login_container .menu_login i')
    const userResult = await fetch(config.apiUrl + '/checking_permission' + '/check_user', {
        method: 'GET',
        credentials: 'include'
    })
    const userData = await userResult.json()
    if (userLoginIcon) {
        if (userData.isSuccess) {
            userLoginIcon.className = 'fa-solid fa-user-pen'
        } else {
            userLoginIcon.className = 'fa-solid fa-user'
        }
    }
    return userData
}

function printProducts(products) {
    let innerHTML = ''
    let cardContainer = document.querySelector('#main_card_section_container')
    if (cardContainer && products) {
        innerHTML = products.length === 0 ? "There are no products to show" : ""
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
}

function printHistoryProducts(products) {
    let innerHTML = ''
    let cardContainer = document.querySelector('#main_card_section_container_history')
    if (cardContainer && products) {
        innerHTML = products.length === 0 ? "You don't have any products to show" : ""
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
}

function checkPagination(numberPage, data) {
    if (numberPage <= 1) {
        let prevButton = document.querySelector('#nav_pagination_prev')
        if (prevButton) prevButton.className = 'nav_pagination_item_disabled'
        if (data.length > 0) {
            let nextButton = document.querySelector('#nav_pagination_next')
            if (nextButton) nextButton.className = 'nav_pagination_item'
        } else {
            let nextButton = document.querySelector('#nav_pagination_next')
            if (nextButton) nextButton.className = 'nav_pagination_item_disabled'
        }
    } else {
        let prevButton = document.querySelector('#nav_pagination_prev')
        if (prevButton) prevButton.className = 'nav_pagination_item'
        if (data.length > 0) {
            let nextButton = document.querySelector('#nav_pagination_next')
            if (nextButton) nextButton.className = 'nav_pagination_item'
        } else {
            let nextButton = document.querySelector('#nav_pagination_next')
            if (nextButton) nextButton.className = 'nav_pagination_item_disabled'
        }
    }
}

async function checkMenuLogin() {
    const userData = await checkUserLoginIcon()
    if (userData.isSuccess) {
        const cardLoginConainerH2 = document.querySelector('.card_login_container_info h2')
        const cardLoginConainerUl = document.querySelector('.card_login_container_info ul')
        if (cardLoginConainerH2) cardLoginConainerH2.innerHTML = `Welcome, ${userData.data[0].name}`
        if (cardLoginConainerUl) cardLoginConainerUl.innerHTML = `
            <li><a href="" class="item_login_container_info" id="logout">Logout</a></li>
        `
        let logoutButton = document.querySelector('#logout');
        if (logoutButton) {
            logoutButton.addEventListener('click', async event => {
                event.preventDefault();
                const response = await fetch(config.apiUrl + '/login/logout_user', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                const data = await response.json()
                if (data.isSuccess) {
                    window.location.href = config.pageURL
                } else {
                    alert('Error to logout, please try again or contact with the administrator.')
                }
            })
        }
    } else {
        const cardLoginConainerUl = document.querySelector('.card_login_container_info ul')
        if (cardLoginConainerUl) cardLoginConainerUl.innerHTML = `
            <li><a href="./login_page.html" class="item_login_container_info">Login</a></li>
            <li><a href="./register_page.html" class="item_login_container_info">Register</a></li>
        `
    }
}

function checkPaginationHistory(numberPage, data) {
    if (numberPage <= 1) {
        let prevButton = document.querySelector('#nav_history_pagination_prev')
        if (prevButton) prevButton.className = 'nav_pagination_item_disabled'
        if (data.length > 0) {
            let nextButton = document.querySelector('#nav_history_pagination_next')
            if (nextButton) nextButton.className = 'nav_pagination_item'
        } else {
            let nextButton = document.querySelector('#nav_history_pagination_next')
            if (nextButton) nextButton.className = 'nav_pagination_item_disabled'
        }
    } else {
        let prevButton = document.querySelector('#nav_history_pagination_prev')
        if (prevButton) prevButton.className = 'nav_pagination_item'
        if (data.length > 0) {
            let nextButton = document.querySelector('#nav_history_pagination_next')
            if (nextButton) nextButton.className = 'nav_pagination_item'
        } else {
            let nextButton = document.querySelector('#nav_history_pagination_next')
            if (nextButton) nextButton.className = 'nav_pagination_item_disabled'
        }
    }
}

function validateRegisterForm() {
    if (formRegisterInputUsername.value !== '' && formRegisterInputEmail.value !== '' && formRegisterInputPassword.value !== '' && formRegisterInputConfirmPassword.value !== '') {
        if (formRegisterInputPassword.value === formRegisterInputConfirmPassword.value) {
            formRegisterButton.className = 'register_button'
            errorMessage1.style.display = 'none'
        } else {
            formRegisterButton.className = 'register_button_disabled'
            errorMessage1.style.display = 'block'
        }
    } else {
        formRegisterButton.className = 'register_button_disabled'
        errorMessage1.style.display = 'none'
    }
}

function validateLoginForm() {
    if (formLoginInputUsername.value !== '' && formLoginInputPassword.value !== '') {
        formLoginButton.className = 'login_button'
    } else {
        formLoginButton.className = 'login_button_disabled'
    }
}