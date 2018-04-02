var wkhtmltopdf = require("wkhtmltopdf"),
    fs = require("fs"),
    path = require('path');

wkhtmltopdf.command = path.join(__dirname, "./bin/wkhtmltopdf");

function getSection($, styles, scripts, section) {
    var $styles = styles.map(x => $('<style type="text/css"></style>').text(x));
    var $head = $('<head></head>')
        .append($styles);

    var $body = $('<body class="fr-view fr-print" style="margin:0; padding: 0;"></body>');

    var $section = $(section);
    if ($section.length > 0) {
        var sectionHtml = $.html($section);
        sectionHtml = sectionHtml.replace('[page]', `<span id="page"></span>`);
        sectionHtml = sectionHtml.replace('[toPage]', `<span id="topage"></span>`);
        $body.append(sectionHtml);
    }

    var $scripts = scripts.map(x => $('<script></script>').text(x));
    $body.append($scripts);

    return '<!DOCTYPE html><html>' + $.html($head) + $.html($body) + '</html>';
}

function getBuffer(stream) {
    return new Promise((resolve, reject) => {
        fs.writeFile(name, content, error => {
            if (error) {
                reject(error);
                return;
            }
            resolve(name);
        });
    });
}

function readFile(name, type) {
    return new Promise((resolve, reject) => {
        fs.readFile(name, type, (error, content) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(content);
        });
    });
}

function writeFile(name, content) {
    return new Promise((resolve, reject) => {
        fs.writeFile(name, content, error => {
            if (error) {
                reject(error);
                return;
            }
            resolve(name);
        });
    });
}

function render(content, options) {
    return new Promise((resolve, reject) => {
        try {
            var stream = wkhtmltopdf(content, options);

            var chunks = [];
            stream.on('data', data => {
                chunks.push(data);
            });

            stream.on('end', () => {
                var buffer = Buffer.concat(chunks);
                resolve(buffer);
            });
        } catch (ex) {
            reject(ex);
        }
    });
}

function decodeHtml(base64) {
    var buffer = new Buffer(base64, 'base64');
    var utf8 = buffer.toString('utf8');
    return utf8;
}

function removeFile(name) {
    return new Promise((resolve, reject) => {
        fs.exists(name, exists => {
            if (!exists) {
                console.log(`${name} not found.`);
                resolve();
                return;
            }

            fs.unlink(name, err => {
                if (err) {
                    reject(err);
                    return;
                }

                console.log(`${name} removed.`);
                resolve();
            });
        })
    });
}

module.exports = {
    getSection: getSection,
    getBuffer: getBuffer,
    readFile: readFile,
    writeFile: writeFile,
    render: render,
    decodeHtml: decodeHtml,
    removeFile: removeFile
}