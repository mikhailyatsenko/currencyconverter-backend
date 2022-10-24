const axios = require("axios");
const saveAndGetRates = require("./saveAndGetRates.js");

function getRates(toCurrency, response) {
  const urlEur = `https://api.getgeoapi.com/v2/currency/convert?api_key=904feae0b722e7df9827cc79d154b91a6975cffc&from=EUR&to=${toCurrency}&amount=1&format=json`;
  const urlUsd = `https://api.getgeoapi.com/v2/currency/convert?api_key=904feae0b722e7df9827cc79d154b91a6975cffc&from=USD&to=${toCurrency}&amount=1&format=json`;
  const urlGbp = `https://api.getgeoapi.com/v2/currency/convert?api_key=904feae0b722e7df9827cc79d154b91a6975cffc&from=GBP&to=${toCurrency}&amount=1&format=json`;
  const outputRates = { toCurrency: toCurrency };
  let myPromise = new Promise(async (resolve, reject) => {
    try {
      const res = await axios.get(urlEur);
      outputRates["EUR"] = res.data.rates[toCurrency].rate_for_amount;
      resolve();
    } catch (err) {
      console.error(err);
    }
  });
  let myPromise2 = new Promise(async (resolve, reject) => {
    try {
      const res = await axios.get(urlUsd);
      outputRates["USD"] = res.data.rates[toCurrency].rate_for_amount;
      resolve();
    } catch (err) {
      console.error(err);
    }
  });

  let myPromise3 = new Promise(async (resolve, reject) => {
    try {
      const res = await axios.get(urlGbp);
      outputRates["GBP"] = res.data.rates[toCurrency].rate_for_amount;
      resolve();
    } catch (err) {
      console.error(err);
    }
  });

  Promise.all([myPromise, myPromise2, myPromise3]).then(() => {
    saveAndGetRates.saveRatesToCache(toCurrency, outputRates);
    response.end(JSON.stringify(outputRates));
  });
}

module.exports = getRates;
