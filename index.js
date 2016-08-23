var wkhtmltopdf = require("wkhtmltopdf"),
    cheerio = require('cheerio'),
    fs = require("fs");

wkhtmltopdf.command = "./bin/wkhtmltopdf";

function getHtml($, $styles, section) {
    var $head = $('<head></head>')
        .append($styles);

    var $body = $('<body class="fr-view" style="margin:0; padding: 0;"></body>');

    var $section = $(section);
    if ($section.length > 0)
        $body.append($section);

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
        wkhtmltopdf(content, options, (error, stream) => {
            if (error) {
                reject(error);
                return;
            }

            var chunks = [];
            stream.on('data', data => {
                chunks.push(data);
            });

            stream.on('end', () => {
                var buffer = Buffer.concat(chunks);
                resolve(buffer);
            });

        });
    });
}

exports.convert = function (event, context, callback) {
    var $ = cheerio.load(event.html);

    var options = {
        headerHtml: "/tmp/header.html",
        footerHtml: "/tmp/footer.html",
        headerSpacing: 5,
        footerSpacing: 5,
        marginLeft: "10mm",
        marginRight: "10mm"
    };

    var $styles;

    Promise.all([
        readFile('styles.css', 'utf-8'),
        readFile('bower_components/froala-wysiwyg-editor/css/froala_style.css', 'utf8'),
        readFile('bower_components/angular-document/dist/angular-document.css', 'utf8')
    ]).then(styles => {
        $styles = $('<style type="text/css"></style>').text(styles.join(';'));
        var header = getHtml($, $styles, 'header');
        var footer = getHtml($, $styles, 'footer');
        return Promise.all([
            writeFile(options.footerHtml, footer),
            writeFile(options.headerHtml, header)
        ]);
    }).then(() => {
        var content = getHtml($, $styles, 'content');
        return render(content, options);
    }).then(buffer => {
        var base64 = buffer.toString('base64');
        callback(null, { data: base64 });
    }).catch(error => {
        callback(error);
    });
}