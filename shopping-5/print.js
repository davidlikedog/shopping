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
        fs.readFile('./buyingList.txt',function (err, data) {
            if(err) {
                console.log('err');
            }else{
                var buyingListStr = data.toString();
                var buyingList = buyingListStr.split('\n');
                var allCoast = 0;
                var newBuyingList=_.chain(buyingList)
                    .groupBy(function (item) {
                        return item;
                    }).map(function (value) {
                        return {
                            barcode: value[0],
                            count: value.length
                        };
                    }).map(function (value) {
                        var whiceOne = newGoodsObj[value.barcode];
                        var total =parseFloat((parseFloat(whiceOne.price) * (parseInt(value.count))).toFixed(2));
                        allCoast += total;
                        return 'name: ' + whiceOne.name + ' count: ' + value.count+' '+whiceOne.unit+' price: $'+(parseFloat(whiceOne.price)).toFixed(2)+' coast: $'+total.toFixed(2);
                    }).reduce(function (previousValue,now) {
                        return previousValue + '\n' + now;
                    }).value();
                console.log(newBuyingList);
                console.log('allSpend: $' + allCoast);
            }
        })
    }
});