var fs = require('fs');
var _ = require('underscore');

function random(max, min) {
    return Math.random() * (max - min) + min;
}

function randonAlpher() {
    var alpher = 'ABCDEFGHIJKLMNOPQRSTUVWSYZ';
    return alpher[parseInt(random(alpher.length,0))];
}

function randomName() {
    var n = parseInt(random(9,2));
    var name = '';
    for (var i = 0; i < n; i++) {
        name += randonAlpher();
    }
    return name;
}

function randomUnit() {
    var unit=['瓶','个','袋','包'];
    return unit[parseInt(random(unit.length,0))];
}

function randomPrice() {
    return parseFloat((random(21,2)).toFixed(2));
}

function randomNumTypeStr(max, min) {
    return parseInt(random(max, min)).toString();
}

function randomFourAlpher() {
    var fourAlpher = '';
    for(var i=0;i<4;i++) {
        fourAlpher += randonAlpher();
    }
    return fourAlpher;
}

function randonEightNumber() {
    var eightNumber = '';
    for(var i=0;i<8;i++) {
        eightNumber += randomNumTypeStr(10,0);
    }
    return eightNumber;
}

function randomBarcode() {
    return randomFourAlpher() + randonEightNumber();
}

function isRepeat(allbarcode,barcode) {
    for(var i=0;i<allbarcode.length;i++) {
        if(allbarcode[i].barcode===barcode) {
            return true;
        }
    }
    return false
}

function newRandomBarcode(allBarcode) {
    var barcode = randomBarcode();
    while(isRepeat(allBarcode,barcode)) {
        barcode = randomBarcode();
    }
    return barcode;
}

function getGoodsDetail(n) {
    var goodsDetail = [];
    for(var i=0;i<n;i++) {
        goodsDetail.push({
            name: randomName(),
            unit: randomUnit(),
            price: randomPrice(),
            barcode: newRandomBarcode(goodsDetail)
        });
    }
    return goodsDetail;
}

function getBuyingList(goodsList,n) {
    var buyingList = [];
    for(var i=0;i<n;i++) {
        var s=parseInt(random(goodsList.length,0));
        buyingList.push(goodsList[s].barcode);
    }
    return buyingList;
}

var goodsList = getGoodsDetail(10);
var buyingList = getBuyingList(goodsList, 20);

function goodsListTypeStr() {
    return  _.chain(goodsList)
        .map(function (value) {
            var goodsStr = [];
            goodsStr.push(value.name + ',' + value.unit + ',' + value.price + ',' + value.barcode);
            return goodsStr;
        }).reduce(function (previousValue, nowValue) {
            return previousValue + '\n' + nowValue;
        }).value();
}

function buyingListTypeStr() {
    return _.chain(buyingList)
        .reduce(function (first, second) {
            return first + '\n' + second;
        }).value();
}

fs.writeFile('./goodsList.txt',goodsListTypeStr(),function (err) {
    if(err) {
        console.log('err');
    }else{
        console.log('OK');
    }
});
fs.writeFile('./buyingList.txt',buyingListTypeStr(),function (err) {
    if(err) {
        console.log('err');
    }else{
        console.log('OK');
    }
});


//名字
//单位
//价格
//barcode


// fs.writeFile('./goodsList.txt','hello word',function (err) {
//     if(err) {
//         console.log('err');
//     }else {
//         console.log('OK');
//     }
// });