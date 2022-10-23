const axios = require("axios");
const saveAndGetConvertRate = require("./saveAndGetConvertRate");

async function convert(inputCurrency, response) {
  const url = `https://api.getgeoapi.com/v2/currency/convert?api_key=904feae0b722e7df9827cc79d154b91a6975cffc&from=${inputCurrency.from}&to=${inputCurrency.to}&amount=1&format=json`;
  let outputCurrency = {};
  try {
    const res = await axios.get(url);

    console.log("ответ от сервера", res.data);

    outputCurrency.from = inputCurrency.from;
    outputCurrency.to = inputCurrency.to;
    outputCurrency.rate = res.data.rates[inputCurrency.to].rate;
    saveAndGetConvertRate.saveRateToCache(outputCurrency.from, outputCurrency.to, outputCurrency);

    console.log("получем курс с API", outputCurrency);

    response.end(JSON.stringify(outputCurrency));
  } catch (err) {
    console.error(err);
  }
}

module.exports = convert;
