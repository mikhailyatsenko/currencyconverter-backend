const { response } = require("express");
const convert = require("./convert");

const cacheConvertRates = {};

function getRateFromCache(inputCurrency, res) {
  let convertKeyName = inputCurrency.from + inputCurrency.to;

  if (!cacheConvertRates[convertKeyName]) {
    console.log("закешированного значения не найдено, идём на API");
    return convert(inputCurrency, res);
  }

  if (Date.now() > cacheConvertRates[convertKeyName].ttl) {
    cacheConvertRates[convertKeyName] = "";
    console.log("закешированное значение устарело, идём на API");

    return convert(inputCurrency, res);
  }
  console.log("взято из кэша", cacheConvertRates[convertKeyName]);

  return res.end(JSON.stringify(cacheConvertRates[convertKeyName]));
}

function saveRateToCache(from, to, outputCurrency) {
  let convertKeyName = from + to;
  let rateToSave = Object.assign({}, outputCurrency);
  cacheConvertRates[convertKeyName] = rateToSave;
  cacheConvertRates[convertKeyName].ttl = Date.now() + 3600000; //saving rate in LS for an hour
  console.log("сохранено в кэше", cacheConvertRates[convertKeyName].rate);
}

module.exports.getRateFromCache = getRateFromCache;
module.exports.saveRateToCache = saveRateToCache;
