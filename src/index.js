const express = require('express');
const app = express();
const router = express.Router();

const asyncHandler = require('express-async-handler')
const serverless = require("serverless-http");

const bb = require('../indicators/bollinger_band.js')
const ema = require('../indicators/ema.js')
const ichimokuCloud = require('../indicators/ichimoku.js')
const macd = require('../indicators/macd.js')
const mfi = require('../indicators/mfi.js')
const obv = require('../indicators/obv.js')
const rsi = require('../indicators/rsi.js')
const sma = require('../indicators/sma.js')
const stochasticRSI = require('../indicators/stochasticrsi.js')
const ticker = require('../indicators/ticker.js')
const wma = require('../indicators/wma.js')
const alerts = require('../alerts')
module.exports = {
    alerts: alerts,
    bb: bb,
    ema: ema,
    ichimokuCloud: ichimokuCloud,
    macd: macd,
    mfi: mfi,
    obv: obv,
    rsi: rsi,
    sma: sma,
    stochasticRSI: stochasticRSI,
    ticker: ticker,
    wma: wma,
}
const EXCHANGE = 'binance';

router.get('/', function (req, res) {
    res.send('App on');
});

router.get('/stochasticRSI/:base_symbol/:quote_symbol/:interval', asyncHandler(async (req, res, next) => {
    let symbol = setSymbol(req.params.base_symbol, req.params.quote_symbol);
    const data = await stochasticRSI(3, 3, 14, 14, 'close', EXCHANGE, symbol, req.params.interval, false);
    res.send(data);
}));

router.get('/sma/:base_symbol/:quote_symbol/:interval/:sma_length?', asyncHandler(async (req, res, next) => {
    let symbol = setSymbol(req.params.base_symbol, req.params.quote_symbol);
    let smaLength = req.params.sma_length !== undefined ? req.params.sma_length : 50;
    let data = await sma(smaLength, "close", EXCHANGE, symbol, req.params.interval, true);
    res.send(data);
}));

router.get('/rsi/:base_symbol/:quote_symbol/:interval', asyncHandler(async (req, res, next) => {
    let symbol = setSymbol(req.params.base_symbol, req.params.quote_symbol);
    let data = await rsi(14, "close", EXCHANGE, symbol, req.params.interval, true);
    res.send(data);
}));

router.get('/bb/:base_symbol/:quote_symbol/:interval', asyncHandler(async (req, res, next) => {
    let symbol = setSymbol(req.params.base_symbol, req.params.quote_symbol);
    const data = await bb(50, 2, "close", EXCHANGE, symbol, req.params.interval, true);
    res.send(data);
}));

router.get('/macd/:base_symbol/:quote_symbol/:interval', asyncHandler(async (req, res, next) => {
    let symbol = setSymbol(req.params.base_symbol, req.params.quote_symbol);
    const data = await macd(12, 26, 9, "close", EXCHANGE, symbol, req.params.interval, true);
    res.send(data);
}));

router.get('/ichimokuCloud/:base_symbol/:quote_symbol/:interval', asyncHandler(async (req, res, next) => {
    let symbol = setSymbol(req.params.base_symbol, req.params.quote_symbol);
    const data = await ichimokuCloud(9, 26, 52, 26, EXCHANGE, symbol, req.params.interval, true);
    res.send(data);
}));

router.get('/goldenCross/:base_symbol/:quote_symbol/:interval', asyncHandler(async (req, res, next) => {
    let symbol = setSymbol(req.params.base_symbol, req.params.quote_symbol);
    const data = await alerts.goldenCross(50, 200, EXCHANGE, symbol, req.params.interval, true);
    res.send(data);
}));

router.get('/maCross/:base_symbol/:quote_symbol/:interval', asyncHandler(async (req, res, next) => {
    let symbol = setSymbol(req.params.base_symbol, req.params.quote_symbol);
    const data = await alerts.maCross(50, 200, EXCHANGE, symbol, req.params.interval, true);
    res.send(data);
}));

router.get('/rsiCheck/:base_symbol/:quote_symbol/:interval', asyncHandler(async (req, res, next) => {
    let symbol = setSymbol(req.params.base_symbol, req.params.quote_symbol);
    const data = alerts.rsiCheck(14, 75, 25, EXCHANGE, symbol, req.params.interval, true);
    res.send(data);
}));

router.get('/priceCrossSMA/:base_symbol/:quote_symbol/:interval', asyncHandler(async (req, res, next) => {
    let symbol = setSymbol(req.params.base_symbol, req.params.quote_symbol);
    const data = await alerts.priceCrossSMA(14, EXCHANGE, symbol, req.params.interval, true);
    res.send(data);
}));

router.get('/priceCrossEMA/:base_symbol/:quote_symbol/:interval', asyncHandler(async (req, res, next) => {
    let symbol = setSymbol(req.params.base_symbol, req.params.quote_symbol);
    const data = await alerts.priceCrossEMA(14, EXCHANGE, symbol, req.params.interval, true);
    res.send(data);
}));

router.get('/bbCheck/:base_symbol/:quote_symbol/:interval', asyncHandler(async (req, res, next) => {
    let symbol = setSymbol(req.params.base_symbol, req.params.quote_symbol);
    const data = awaitalerts.bbCheck(50, 2, EXCHANGE, symbol, req.params.interval, true);
    res.send(data);
}));


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});

app.use('/.netlify/functions/indicators', router);

module.exports = app;
module.exports.handler = serverless(app);


function setSymbol(base, quote) {
    return base + '/' + quote;
}
