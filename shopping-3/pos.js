var fs = require('fs');
var _ = require('underscore');

fs.readFile('./products.txt', function (err, data) {
    if (err) {
        console.log('err');
    } else {
        data = data.toString();
        var lines = data.split('\n');
        var products = _.chain(lines)
            .map(function (value) {
                var fields = value.split(',');
                return {
                    name: fields[0],
                    price: parseFloat(fields[1]),
                    unit: fields[2],
                    barcode: fields[3]
                }
            }).value();
        fs.readFile('./buying_items.txt', function (err, data) {
            data = data.toString();
            var lines = data.split('\n');
            var buyingItems = _.chain(lines)
                .map(function (value) {
                    var fields = value.split(',');
                    return {
                        barcode: fields[0],
                        count: parseInt(fields[1])
                    }
                }).value();

            function getListMap(buyingItem) {
                var newGoodsList = {};
                _.chain(buyingItem)
                    .map(function (value) {
                        newGoodsList[value.barcode] = value.count;
                    }).value();
                return newGoodsList;
            }

            function getGoodsDetail(products) {
                var newGoodsDetail = {};
                _.map(products, function (value) {
                    newGoodsDetail[value.barcode] = value;
                });
                return newGoodsDetail;
            }

            function printGoods(buyingMap, productsMap) {
                var printGoodsList = [];
                var totalPrice=0;
                _.map(buyingMap, function (value, key) {
                    var name = productsMap[key].name;
                    var count = value;
                    var unit = productsMap[key].unit;
                    var price = productsMap[key].price;
                    var newTotalPrice=parseFloat((count * price).toFixed(2));
                    printGoodsList.push('商品名称：' + name + ' 商品数量：' + count + ' ' + unit + ' 商品单价：' + price + ' 元' + ' 总价：' + newTotalPrice + ' 元');
                    totalPrice += newTotalPrice;
                });
                printGoodsList.push('总价为：'+totalPrice+' 元');
                return _.reduce(printGoodsList, function (previousValue, nowValue) {
                    return previousValue + '\n' + nowValue;
                });
            }

            function printBuyingList(products, buyingItem) {
                var buyingMap = getListMap(buyingItem);
                var productsMap = getGoodsDetail(products);
                var printList = printGoods(buyingMap, productsMap);
                console.log(printList);
            }

            printBuyingList(products, buyingItems);
        });
    }
});
