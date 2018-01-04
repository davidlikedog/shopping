var fs = require('fs');
var _ = require('underscore');

function random(max, min) {
    return Math.random() * (max - min) + min;
}

function rendomAlpher() {
    var alpher = 'ABCDEFGHIJKLMNOPQRSTUVWSYZ';
    return alpher[parseInt(random(alpher.length, 0))];
}

function randomName() {
    var n = random(5, 2);
    var name = '';
    for (var i = 0; i < n; i++) {
        name += rendomAlpher();
    }
    return name;
}

function randomPrice() {
    return parseFloat(random(21, 5).toFixed(2));
}

function randomUnit() {
    var unit = ['个', '瓶', '罐', '袋', '包', '斤'];
    return unit[parseInt(random(unit.length, 0))];
}

function randomFourAlpher() {
    var fourAlpher = '';
    for (var i = 0; i < 4; i++) {
        fourAlpher += rendomAlpher();
    }
    return fourAlpher;
}

function randomEightNumber() {
    var number = '';
    for (var i = 0; i < 8; i++) {
        number += parseInt(random(10, 0)).toString();
    }
    return number;
}

function randomBarcode() {
    return randomFourAlpher() + randomEightNumber();
}

function isRepeat(goods, barcode) {
    for (var i = 0; i < goods.length; i++) {
        if (goods[i].barcode === barcode) {
            return true;
        }
    }
    return false;
}

function newBarcode(goods) {
    var barcode = randomBarcode();
    while (isRepeat(goods, barcode)) {
        barcode = randomBarcode();
    }
    return barcode;
}

function getAllgoods(n) {
    var goods = [];
    for (var i = 0; i < n; i++) {
        goods.push({
            name: randomName(),
            unit: randomUnit(),
            price: randomPrice(),
            barcode: newBarcode(goods)
        })
    }
    return goods;
}

function randomBuyingList(goods, n) {
    var buyingList = [];
    for (var i = 0; i < n; i++) {
        var s = parseInt(random(goods.length, 0));
        if (s < 2) {
            var number = random(5, 2).toFixed().toString();
            buyingList.push(goods[s].barcode + '-' + number);
        } else {
            buyingList.push(goods[s].barcode);
        }
    }
    return buyingList;
}

function randomFreeGoodsList(goods, n) {
    var type = ['TWO', 'THREE', 'FOUR', 'FIVE', 'SEX', 'SEVEN', 'EIGHT', 'NIGHT', 'TEN', 'ELEVEN'];
    var freeGoodsList = [];
    var newFreeGoodsList = [];
    n > goods.length ? n = goods.length : n = n;
    for (var i = 0; i < n; i++) {
        var m = parseInt(random(goods.length, 0));
        freeGoodsList.push({
            type: 'BUY_' + type[i] + '_GET_ONE',
            barcode: goods[m].barcode
        })
    }
    _.chain(freeGoodsList)
        .groupBy(function (item) {
            return item.barcode;
        }).map(function (value,key) {
            newFreeGoodsList.push({
                type: value[0].type,
                barcode: key
            });
        }).value();
    return newFreeGoodsList;
}

var goods = getAllgoods(5);

var buyingList = randomBuyingList(goods, 10);
var freeGoods = randomFreeGoodsList(goods, 8);


function goodsStr(goods) {
    return _.chain(goods)
        .map(function (value) {
            return value.name + ',' + value.unit + ',' + value.price + ',' + value.barcode;
        }).reduce(function (previousValue, nowValue) {
            return previousValue + '\n' + nowValue;
        }).value();
}

function buyingListStr(buyingStr) {
    return _.chain(buyingStr)
        .reduce(function (previous, now) {
            return previous + '\n' + now;
        }).value();
}

function freeGoodsStr(freeGoods) {
    return _.chain(freeGoods)
        .map(function (value) {
            return value.type + ',' + value.barcode;
        }).reduce(function (previousValue, now) {
            return previousValue + '\n' + now;
        }).value();
}


fs.writeFile('./goods.txt', goodsStr(goods), function (err) {
    if (err) {
        console.log('err');
    } else {
        console.log('OK');
    }
});

fs.writeFile('./buyingList.txt', buyingListStr(buyingList), function (err) {
    if (err) {
        console.log('err');
    } else {
        console.log('OK');
    }
});

fs.writeFile('./buyxxGetOne.txt', freeGoodsStr(freeGoods), function (err) {
    if (err) {
        console.log('err');
    } else {
        console.log('OK');
    }
});