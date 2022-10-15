const express = require("express");
const https = require("https");
const { resolve } = require("path");
const app = express();
const port = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");
  const inputCurrency = req.query;
  convert(inputCurrency, res);
});

app.get("/rates", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");

  const toCurrency = req.query.to;
  getRates(toCurrency, res);
});

function convert(inputCurrency, response) {
  const url = `https://api.getgeoapi.com/v2/currency/convert?api_key=904feae0b722e7df9827cc79d154b91a6975cffc&from=${inputCurrency.from}&to=${inputCurrency.to}&amount=${inputCurrency.amount}&format=json`;

  https.get(url, (res) => {
    let outputData = "";
    let outputCurrency = {};
    if (res.statusCode !== 200) {
      console.log(`Something wrong: ${res}`);
      return;
    }

    res.on("data", (chunk) => {
      outputData += chunk;
    });

    res.on("end", () => {
      outputData = JSON.parse(outputData);
      outputCurrency.from = outputData.base_currency_name;
      outputCurrency.to = outputData.rates[inputCurrency.to.toUpperCase()].currency_name;
      outputCurrency.fromAmount = outputData.amount;
      outputCurrency.toAmount = outputData.rates[inputCurrency.to.toUpperCase()].rate_for_amount;
      response.end(JSON.stringify(outputCurrency));
    });
  });
}

function getRates(toCurrency, response) {
  const urlEur = `https://api.getgeoapi.com/v2/currency/convert?api_key=904feae0b722e7df9827cc79d154b91a6975cffc&from=EUR&to=${toCurrency}&amount=1&format=json`;
  const urlUsd = `https://api.getgeoapi.com/v2/currency/convert?api_key=904feae0b722e7df9827cc79d154b91a6975cffc&from=USD&to=${toCurrency}&amount=1&format=json`;
  const urlGbp = `https://api.getgeoapi.com/v2/currency/convert?api_key=904feae0b722e7df9827cc79d154b91a6975cffc&from=GBP&to=${toCurrency}&amount=1&format=json`;
  const outputRates = { toCurrency: toCurrency };

  let myPromise = new Promise((resolve, reject) => {
    https.get(urlEur, (res) => {
      if (res.statusCode !== 200) {
        console.log(`Something wrong: ${res}`);
        return;
      }

      let outputData = "";

      res.on("data", (chunk) => {
        outputData += chunk;
      });

      res.on("end", () => {
        outputData = JSON.parse(outputData);
        outputRates["EUR"] = outputData.rates[toCurrency].rate_for_amount;
        resolve();
      });
    });
  });

  myPromise
    .then(() => {
      return new Promise((resolve, reject) => {
        https.get(urlUsd, (res) => {
          let outputData = "";

          if (res.statusCode !== 200) {
            console.log(`Something wrong: ${res}`);
            return;
          }

          res.on("data", (chunk) => {
            outputData += chunk;
          });

          res.on("end", () => {
            outputData = JSON.parse(outputData);
            outputRates["USD"] = outputData.rates[toCurrency].rate_for_amount;
            resolve();
          });
        });
      });
    })
    .then(() => {
      https.get(urlGbp, (res) => {
        let outputData = "";

        if (res.statusCode !== 200) {
          console.log(`Something wrong: ${res}`);
          return;
        }

        res.on("data", (chunk) => {
          outputData += chunk;
        });

        res.on("end", () => {
          outputData = JSON.parse(outputData);
          outputRates["GBP"] = outputData.rates[toCurrency].rate_for_amount;
          console.log(outputRates);
          response.end(JSON.stringify(outputRates));
        });
      });
    });
}

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
