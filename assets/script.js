const SOLDIER_PRICE = 11000
const API_KEY = '65c40140-98e4-11ec-a01b-25a901458265'
const DELAY = 300000

const savePrices = (payload) => {
  var rates = JSON.parse(localStorage.getItem('rates')) || {}

  rates['USD'] = payload['USD']
  rates['EUR'] = payload['EUR']

  localStorage.setItem('prevRates', localStorage.getItem('rates'))
  localStorage.setItem('rates', JSON.stringify(rates))
}

const refreshPrices = () => {
  var rates = JSON.parse(localStorage.getItem('rates')) || {}
  var prevRates = JSON.parse(localStorage.getItem('prevRates')) || {}

  if (rates['USD']) {
    var priceInUsd = (SOLDIER_PRICE * rates['USD']).toFixed(2)
    var $usdPrice = document.querySelector('.usd-info .price-js')
    
    $usdPrice.textContent = priceInUsd

    if (prevRates['USD']) {
      var usdRateRatio = (rates['USD'] / prevRates['USD'] - 1).toFixed(2)
      var $usdRatio = document.querySelector('.usd-info .posneg-js')
      
      $usdRatio.textContent = `(${usdRateRatio}%)`
      $usdRatio.classList.remove('red', 'green')
      $usdRatio.classList.add(usdRateRatio >= 0 ? 'green' : 'red')
    }
  }

  if (rates['EUR']) {
    var priceInEur = (SOLDIER_PRICE * rates['EUR']).toFixed(2)
    var $eurPrice = document.querySelector('.eur-info .price-js')
    
    $eurPrice.textContent = priceInEur

    if (prevRates['EUR']) {
      var eurRateRatio = (rates['EUR'] / prevRates['EUR'] - 1).toFixed(2)
      var $eurRatio = document.querySelector('.eur-info .posneg-js')
      
      $eurRatio.textContent = `(${eurRateRatio}%)`
      $eurRatio.classList.remove('red', 'green')
      $eurRatio.classList.add(eurRateRatio >= 0 ? 'green' : 'red')
    }
  }
}

const fetchPricesFromAPI = () => {
  fetch('https://freecurrencyapi.net/api/v2/historical?base_currency=RUB')
    .then((response) => {
      if (response.status === 429) {
        throw new Error('Too many requests!');
      } else {
        return response.json();
      }
    })
    .then((body) => {
      var payload = Object.values(body.data)[0]
      
      savePrices(payload)
      refreshPrices()
    })
    .catch(() => {
      fetch(`https://freecurrencyapi.net/api/v2/historical?base_currency=RUB&apikey=${API_KEY}`)
        .then((response) => response.json())
        .then((body) => {
          var payload = Object.values(body.data)[0]
          
          savePrices(payload)
          refreshPrices()
        })
    })
} 

document.addEventListener('DOMContentLoaded', () => {
  try { 
    fetchPricesFromAPI() 
  } catch(_error) { 
    refreshPrices()
  }

  setInterval(fetchPricesFromAPI, DELAY)
});
