var express = require('express');
var router = express.Router();

//const testDataSync = require('../system/testData');
const { dataSync, dataAsync } = require('../system/testData');

router.use('/get-testdata-sync', function (req, res, next) {


    let data = dataSync();

    console.log('test data: ', data);

    res.send({ data: data});
});

router.use('/get-testdata-async', async function (req, res, next){
    let data = await dataAsync();

    res.send({ data: data });

});



module.exports = router;