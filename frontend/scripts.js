import config from './config.js'

addEventListener('load', () => {
    getProducts()
})

async function getProducts() {
    console.log(config.apiUrl + '/products')
    const result = await fetch(config.apiUrl + '/products')
    const data = await result.json()
    // console.log('data: ' + JSON.stringify(data))
    for (const product of data) {
        console.log('product: ' + JSON.stringify(product))
    }
}