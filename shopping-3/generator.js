var fs = require('fs');
var _ = require('underscore');

//  list
//  增删改查

function randomGet(sequence) {
    return sequence[Math.floor(Math.random() * sequence.length)];
}

function randomAlpha() {
    return randomGet('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
}

function randomUnit() {
    return randomGet(['kg', 'ge', 'he']);
}

function randomDigit() {
    return Math.floor(Math.random() * 10);
}

function randomName() {
    var s = '';
    var len = Math.floor(Math.random() * 10 + 1);
    for (var i = 0; i < len; i++) {
        s += randomAlpha();
    }
    return s;
}


function randomBarcode() {
    var barcode = '';
    for (var i = 0; i < 4; i++) {
        barcode += randomAlpha();
    }
    for (var j = 0; j < 8; j++) {
        barcode += randomDigit();
    }
    return barcode;
}

function randomPrice() {
    // [1, 20)
    return (Math.random() * 19 + 1).toFixed(2);
}

function buildRandomProducts(n) {
    var randomProducts = [];

    //  true/false
    function isRepeat(barcode) {
        for (var s = 0; s < randomProducts.length; s++) {
            if (randomProducts[s].barcode === barcode) {
                return true;
            }
        }
        return false;
    }

    function randNewBarcode() {
        var barcode = randomBarcode();
        while (isRepeat(barcode)) {
            barcode = randomBarcode();
        }
        return barcode;
    }

    for (var i = 0; i < n; i++) {
        randomProducts.push({
            name: randomName(),
            unit: randomUnit(),
            price: parseFloat(randomPrice()),
            barcode: randNewBarcode()
        });
    }

    return randomProducts;
}

function buildProductString(product) {
    return product.name + ',' + product.price + ',' + product.unit + ',' + product.barcode;
}

function buildRandomBuyingItems(products, n) {
    var buyingItems = [];
    for (var i = 0; i < n; i++) {
        buyingItems.push({
            barcode: randomGet(products).barcode,
            count: Math.floor(Math.random() * 9 + 1)
        });
    }
    return buyingItems;
}

var products = buildRandomProducts(20);
var buyingItems = buildRandomBuyingItems(products, 30);
var productsString = _.chain(products)
    .map(buildProductString)
    .reduce(function (previousValue, newItem) {
        return previousValue + '\n' + newItem;
    }).value();
var buyingString = _.chain(buyingItems)
    .map(function (value) {
        return value.barcode + ',' + value.count;
    })
    .reduce(function (previousValue, newItem) {
        return previousValue + '\n' + newItem;
    });
fs.writeFile('./products.txt', productsString, function (err) {
    if (err) {
        console.log('写入失败');
    } else {
        console.log('写入成功');
    }
});
fs.writeFile('./buying_items.txt', buyingString, function (err) {
    if (err) {
        console.log('写入失败');
    } else {
        console.log('写入成功');
    }
});
