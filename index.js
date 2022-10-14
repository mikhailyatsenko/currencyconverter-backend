const express = require("express");
const https = require("https");
const app = express();
const port = 3001;
const outputCurrency = "";

app.get("/", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type, Authorization");
  res.end("hello");
  const inputCurrency = req.query;
  convert(inputCurrency, res);
});

function convert(inputCurrency, response) {
  const url = `https://api.getgeoapi.com/v2/currency/convert?api_key=904feae0b722e7df9827cc79d154b91a6975cffc&from=${inputCurrency.from}&to=${inputCurrency.to}&amount=${inputCurrency.amount}&format=json`;

  https.get(url, (res) => {
    let output = "";
    if (res.statusCode !== 200) {
      console.log(`Status code: ${res}`);
      return;
    }

    res.on("data", (chunk) => {
      output += chunk;
    });

    res.on("end", () => {
      console.log(output);
      response.end(output);
    });
  });
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
