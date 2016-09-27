var htmlToPdf = require('../index.js'),
    fs = require("fs"),
    Stopwatch = require("timer-stopwatch");

function convertHtml(name, cb) {
    fs.readFile('./test/' + name + '.html', 'utf8', function (err, data) {
        if (err) {
            console.log(err);
            return;
        }
        htmlToPdf.convert({
            base64: (new Buffer(data, 'utf8')).toString('base64')
        }, null, function (err, result) {
            if (err) {
                console.log(err);
                return;
            }

            var buffer = new Buffer(result.data, 'base64');
            console.log(buffer);
            fs.writeFileSync('./test/' + name + '.pdf', buffer);
            cb();
        });
    });
}

var timer = new Stopwatch(),
    timeSeconds = 8,
    totalTime = timeSeconds * 1000;

var $timeout = setTimeout(() => {
    console.log(`process timed out after ${timeSeconds}s`);
    process.exit(1);
}, totalTime);

timer.start();
convertHtml('proposal_1', function () {
    clearTimeout($timeout);
    timer.stop();
    console.log(`Done. ${timer.ms}ms`);
});