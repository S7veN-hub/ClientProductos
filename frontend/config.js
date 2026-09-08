const config = {
    apiUrl: 'http://localhost:3000',
    pageURL: 'http://localhost:5501',
    currencyMap: new Map([
        ['USD', '$'],
        ['EUR', '€'],
        ['GBP', '£'],
        ['JPY', '¥']
    ]),
    discountDefault: 'No hay descuento'
}

export default config;