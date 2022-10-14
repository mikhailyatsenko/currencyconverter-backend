const express = require("express");
const https = require("https");
const app = express();
const port = process.env.PORT || 3001;
let inputCurrency;
const outputCurrency = "";

app.get("/", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");

  inputCurrency = req.query;
  convert(inputCurrency, res);
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
      console.log(outputCurrency);
      response.end(JSON.stringify(outputCurrency));
    });
  });
}

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
