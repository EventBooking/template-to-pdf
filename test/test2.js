var htmlToPdf = require('../index.js'),
    fs = require("fs"),
    data = require('./test2.json');

htmlToPdf.convert(data, null, function (err, result) {
    if (err) {
        console.log(err);
        return;
    }

    var buffer = new Buffer(result.data, 'base64');
    console.log(buffer);
    fs.writeFileSync('./test/test2.pdf', buffer);

    console.log(`Done.`);
});
