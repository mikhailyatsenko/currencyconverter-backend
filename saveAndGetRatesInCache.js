const getRates = require("./getRates");
const cacheRates = {};

function getRateFromCache(toCurrency, res) {
  if (!cacheRates[toCurrency]) {
    console.log("не найдено закеширровнного значения, идем на хероку");
    return getRates(toCurrency, res);
  }
  if (Date.now() > cacheRates[toCurrency].ttl) {
    console.log("закешированное значение устарело, идем на хероку");

    cacheRates[toCurrency] = "";
    return getRates(toCurrency, res);
  }
  console.log("получаем курсы валют из кєша", cacheRates[toCurrency]);
  return res.end(JSON.stringify(cacheRates[toCurrency]));
}

function saveRatesToCache(toCurrency, response) {
  console.log("ответ хероку", response);
  cacheRates[response.toCurrency] = response;
  cacheRates[response.toCurrency].ttl = Date.now() + 3600000; //saving rate in LS for an hour
  console.log("закешировано", cacheRates[response.toCurrency]);
}

module.exports.getRateFromCache = getRateFromCache;
module.exports.saveRatesToCache = saveRatesToCache;
