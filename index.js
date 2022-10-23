const express = require("express");
const app = express();
const saveAndGetConvertRate = require("./saveAndGetConvertRate");
const saveAndGetRatesInCache = require("./saveAndGetRatesInCache.js");
const port = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const inputCurrency = req.query;
  console.log("пришло на бэк с главной стр", inputCurrency);
  saveAndGetConvertRate.getRateFromCache(inputCurrency, res);
});

app.get("/rates", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const toCurrency = req.query.to;
  saveAndGetRatesInCache.getRateFromCache(toCurrency, res);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
