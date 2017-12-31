var fs = require('fs');
var _ = require('underscore');
fs.readFile('./goodsList.txt',function (err, data) {
    if(err) {
        console.log('err');
    }else{
        var data1 = data.toString();
        var newData = data1.split('\n');
        var allGoods = [];
        _.chain(newData)
            .map(function (value) {
                var oneLine = value.split(',');
                allGoods.push({
                    name:oneLine[0],
                    unit:oneLine[1],
                    price:oneLine[2],
                    barcode:oneLine[3]
                })
            });
        fs.readFile('./buyingList.txt',function (err, data) {
            if(err){
                console.log('err');
            }else{
                var buyingList = data.toString();
                var newbuyingList = buyingList.split('\n');
                var goodsObj = {};
                _.chain(allGoods)
                    .map(function (value) {
                        goodsObj[value.barcode] = value;
                    }).value();

                var total = 0;
                var printGoodsList=_.chain(newbuyingList)
                    .groupBy(function (item) {
                        return item;
                    }).map(function (value) {
                        return {
                            barcode:value[0],
                            count:value.length
                        }
                    }).map(function (value) {
                        var realGoods = goodsObj[value.barcode];
                        total += parseFloat(realGoods.price) * parseFloat(value.count);
                        return 'name: '+realGoods.name+'count: '+value.count+' '+realGoods.unit+' price: $'+(parseFloat(realGoods.price).toFixed(2))+' cost: $'+(realGoods.price*value.count).toFixed(2);
                    }).reduce(function (previousValue,second) {
                        return previousValue + '\n' + second;
                    }).value();
                console.log(printGoodsList);
                console.log('allSpend: $' + total.toFixed(2));
            }
        })
    }
});