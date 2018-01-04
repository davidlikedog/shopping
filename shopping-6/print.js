var fs = require('fs');
var _ = require('underscore');

fs.readFile('./goods.txt', function (err, data) {
    if (err) {
        console.log('err');
    } else {
        var goodsStr = data.toString();
        var newgoods = goodsStr.split('\n');
        var newGoodsObj = {};
        _.chain(newgoods)
            .map(function (value) {
                var singleOne = value.split(',');
                return {
                    name: singleOne[0],
                    unit: singleOne[1],
                    price: singleOne[2],
                    barcode: singleOne[3]
                };
            }).map(function (value) {
            return newGoodsObj[value.barcode] = value;
        }).value();
        fs.readFile('./buyingList.txt', function (err, data) {
            if (err) {
                console.log('err');
            } else {
                var buyingListStr = data.toString();
                var buyingList = buyingListStr.split('\n');

                var newBuyingList = [];
                var buyingListObj = {};
                _.map(buyingList, function (value) {
                    if (value.indexOf('-') === -1) {
                        newBuyingList.push(value);
                    } else if (value.indexOf('-') !== -1) {
                        var s = value.split('-');
                        for (var i = 0; i < s[1]; i++) {
                            newBuyingList.push(s[0]);
                        }
                    }
                });
                _.chain(newBuyingList)
                    .groupBy(function (item) {
                        return item
                    }).map(function (value) {
                    buyingListObj[value[0]] = value.length;
                }).value();

                fs.readFile('./buyxxGetOne.txt', function (err, data) {
                    if (err) {
                        console.log('err');
                    } else {
                        var freeGoods = data.toString();
                        var arrFreeGoods = freeGoods.split('\n');
                        var newFreeGoods = {};
                        _.map(arrFreeGoods, function (value) {
                            var arrOne = value.split(',');
                            newFreeGoods[arrOne[1]] = arrOne[0];
                        });

                        var getFreeGoods = [];

                        function pushFreeGoods(getFreeGoods, a,item,keyFreeGoods) {
                            getFreeGoods.push({
                                name: a.name,
                                count: item,
                                type: keyFreeGoods,
                                price: a.price
                            });
                        }

                        _.map(buyingListObj, function (item, key) {
                            var a = newGoodsObj[key];
                            if (newFreeGoods[key] === undefined) {
                                newFreeGoods[key] = 'meiyou';
                                pushFreeGoods(getFreeGoods, a, item,newFreeGoods[key]);
                            } else {
                                pushFreeGoods(getFreeGoods, a, item,newFreeGoods[key]);
                            }
                        });

                        var printGoodsList = _.chain(buyingListObj)
                            .map(function (value, index) {
                                var currentGoods = newGoodsObj[index];

                                return 'name: ' + currentGoods.name + ' count: ' + parseInt(value) + ' ' + currentGoods.unit + ' price: $' + (parseFloat(currentGoods.price)).toFixed(2);
                            }).reduce(function (previousValue, currentValue) {
                                return previousValue + '\n' + currentValue;
                            }).value();
                        console.log(printGoodsList);
                        console.log('------gifts------');

                        var printFreeGoods = _.chain(getFreeGoods)
                            .map(function (value) {
                                var type = value.type;
                                var typeNum = 38;
                                var arr = [];
                                var str = '';
                                if (type === 'BUY_TWO_GET_ONE') {
                                    typeNum = 2;
                                } else if (type === 'BUY_THREE_GET_ONE') {
                                    typeNum = 3;
                                } else if (type === 'BUY_FOUR_GET_ONE') {
                                    typeNum = 4;
                                } else if (type === 'BUY_FIVE_GET_ONE') {
                                    typeNum = 5;
                                } else if (type === 'BUY_SIX_GET_ONE') {
                                    typeNum = 6;
                                } else if (type === 'BUY_SEVEN_GET_ONE') {
                                    typeNum = 7;
                                } else if (type === 'BUY_EIGHT_GET_ONE') {
                                    typeNum = 8;
                                } else if (type === 'BUY_NIGHT_GET_ONE') {
                                    typeNum = 9;
                                } else if (type === 'BUY_TEN_GET_ONE') {
                                    typeNum = 10;
                                } else if (type === 'BUY_ELEVEN_GET_ONE') {
                                    typeNum = 11;
                                } else if (type === 'meiyou') {
                                    typeNum = 1000;
                                }
                                var count = parseInt(value.count);
                                if (count >= typeNum) {
                                    str += 'name: ' + value.name + ' count:1 ';
                                    arr.push(str);
                                    return arr;
                                } else {
                                    return '';
                                }
                            }).reduce(function (previousValue, currentValue) {
                                return previousValue + currentValue
                            }).value();
                        console.log(printFreeGoods);
                    }
                });
            }
        })
    }
});