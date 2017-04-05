var converter = require('../index.js'),
    fs = require("fs"),
    Stopwatch = require("timer-stopwatch"),
    path = require('path');

function convertHtml(name) {
    return new Promise((resove, reject) => {
        fs.readFile(path.join(__dirname, `${name}.html`), 'utf8', function (err, data) {
            if (err) {
                console.log(err);
                return;
            }

            var buffer = new Buffer(data, 'utf8');
            var encodedHtml = buffer.toString('base64');

            converter.convert(encodedHtml, {}).then(result => {
                var buffer = new Buffer(result, 'base64');
                fs.writeFileSync(path.join(__dirname, `${name}.pdf`), buffer);
                resove(buffer);
            }).catch(err => {
                reject(err);
            });
        });
    });
}

var timer = new Stopwatch();
timer.start();
convertHtml('test').then(buffer => {
    timer.stop();
    console.log(buffer);
    console.log(`Done. ${timer.ms}ms`);
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});