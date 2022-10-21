const express = require("express");
const https = require("https");
const app = express();
const axios = require("axios");
const port = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const inputCurrency = req.query;
  console.log("пришло на бэк с главной стр", inputCurrency);
  convert(inputCurrency, res);
});

app.get("/rates", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const toCurrency = req.query.to;
  getRates(toCurrency, res);
});

function convert(inputCurrency, response) {
  const url = `https://api.getgeoapi.com/v2/currency/convert?api_key=904feae0b722e7df9827cc79d154b91a6975cffc&from=${inputCurrency.from}&to=${inputCurrency.to}&amount=1&format=json`;
  let outputCurrency = {};
  axios
    .get(url)
    .then(function (res) {
      console.log("ответ от сервера", res.data);
      outputCurrency.from = inputCurrency.from;
      outputCurrency.to = inputCurrency.to;
      outputCurrency.rate = res.data.rates[inputCurrency.to].rate;
      response.end(JSON.stringify(outputCurrency));
    })
    .catch(function (error) {
      console.log(error);
    });
}

function getRates(toCurrency, response) {
  const outputRates = { toCurrency: toCurrency };
  const urls = [
    `https://api.getgeoapi.com/v2/currency/convert?api_key=904feae0b722e7df9827cc79d154b91a6975cffc&from=EUR&to=${toCurrency}&amount=1&format=json`,
    `https://api.getgeoapi.com/v2/currency/convert?api_key=904feae0b722e7df9827cc79d154b91a6975cffc&from=USD&to=${toCurrency}&amount=1&format=json`,
    `https://api.getgeoapi.com/v2/currency/convert?api_key=904feae0b722e7df9827cc79d154b91a6975cffc&from=GBP&to=${toCurrency}&amount=1&format=json`,
  ];

  axios.all(urls.map((url) => axios.get(url))).then((res) => {
    outputRates["EUR"] = res[0].data.rates[toCurrency].rate_for_amount;
    outputRates["USD"] = res[1].data.rates[toCurrency].rate_for_amount;
    outputRates["GBP"] = res[2].data.rates[toCurrency].rate_for_amount;
    response.end(JSON.stringify(outputRates));
  });
}

// function getRates(toCurrency, response) {
//   const urlEur = `https://api.getgeoapi.com/v2/currency/convert?api_key=904feae0b722e7df9827cc79d154b91a6975cffc&from=EUR&to=${toCurrency}&amount=1&format=json`;
//   const urlUsd = `https://api.getgeoapi.com/v2/currency/convert?api_key=904feae0b722e7df9827cc79d154b91a6975cffc&from=USD&to=${toCurrency}&amount=1&format=json`;
//   const urlGbp = `https://api.getgeoapi.com/v2/currency/convert?api_key=904feae0b722e7df9827cc79d154b91a6975cffc&from=GBP&to=${toCurrency}&amount=1&format=json`;
//   const outputRates = { toCurrency: toCurrency };
//   let myPromise = new Promise((resolve, reject) => {
//     axios
//       .get(urlEur)
//       .then(function (res) {
//         console.log("ответ от сервера на стр Rates EUR", res.data);
//         outputRates["EUR"] = res.data.rates[toCurrency].rate_for_amount;
//         resolve();
//       })
//       .catch(function (error) {
//         console.log(error);
//       });
//   });
//   let myPromise2 = new Promise((resolve, reject) => {
//     axios
//       .get(urlUsd)
//       .then(function (res) {
//         console.log("ответ от сервера на стр Rates USD", res.data);
//         outputRates["USD"] = res.data.rates[toCurrency].rate_for_amount;
//         resolve();
//       })
//       .catch(function (error) {
//         console.log(error);
//       });
//   });

//   Promise.all([myPromise, myPromise2]).then(() => {
//     axios
//       .get(urlGbp)
//       .then(function (res) {
//         console.log("ответ от сервера на стр Rates USD", res.data);
//         outputRates["GBP"] = res.data.rates[toCurrency].rate_for_amount;
//         response.end(JSON.stringify(outputRates));
//       })
//       .catch(function (error) {
//         console.log(error);
//       });
//   });
// }

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
