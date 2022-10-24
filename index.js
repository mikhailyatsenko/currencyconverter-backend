const express = require("express");
const app = express();
const saveAndGetConvertRate = require("./saveAndGetConvertRate");
const saveAndGetRates = require("./saveAndGetRates.js");
const port = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const inputCurrency = req.query;
  saveAndGetConvertRate.getRateFromCache(inputCurrency, res);
});

app.get("/rates", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const toCurrency = req.query.to;
  saveAndGetRates.getRateFromCache(toCurrency, res);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
