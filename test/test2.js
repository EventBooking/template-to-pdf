var htmlToPdf = require('../index.js'),
    fs = require("fs"),
    data = require('./test3.json');

htmlToPdf.convert(data.base64, {debug: true}).then(function (result) {
    var buffer = new Buffer(result, 'base64');
    //console.log(buffer);
    fs.writeFileSync('./test/test2.pdf', buffer);

    console.log(`Done.`);
}).catch(function(err) {
    console.log(err);
});
