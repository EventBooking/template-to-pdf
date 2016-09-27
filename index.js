var wkhtmltopdf = require("wkhtmltopdf"),
    cheerio = require('cheerio'),
    fs = require("fs");

wkhtmltopdf.command = "./bin/wkhtmltopdf";

function getSection($, $styles, section) {
    var $head = $('<head></head>')
        .append($styles);

    var $body = $('<body class="fr-view fr-print" style="margin:0; padding: 0;"></body>');

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
        var outputFile = options.output;
        wkhtmltopdf(content, options, (error, stream) => {
            if (error) {
                reject(error);
                return;
            }

            fs.readFile(outputFile, (error, data) => {
                if (error) {
                    reject(error);
                    return;
                }

                var buffer = new Buffer(data);
                resolve(buffer);
            });

        });
    });
}

function decodeHtml(base64) {
    var buffer = new Buffer(base64, 'base64');
    var utf8 = buffer.toString('utf8');
    console.log(`${utf8.substr(0, 100)}...${utf8.substr(utf8.length - 100, 100)}`);
    return utf8;
}

function getHtml(event) {
    var html = event.base64 ? decodeHtml(event.base64) : event.html;
    var $ = cheerio.load(html);
    return $;
}

function convert(event, context, callback) {
    var $ = getHtml(event);

    var options = {
        headerHtml: "/tmp/_header.html",
        footerHtml: "/tmp/_footer.html",
        headerSpacing: 5,
        footerSpacing: 5,
        marginLeft: "10mm",
        marginRight: "10mm",
        debug: true,
        output: "/tmp/_output.pdf"
    };

    var $styles;

    Promise.all([
        readFile('styles.css', 'utf-8'),
        readFile('bower_components/froala-wysiwyg-editor/css/froala_style.css', 'utf8'),
        readFile('bower_components/angular-document/dist/angular-document.css', 'utf8')
    ]).then(styles => {
        $styles = $('<style type="text/css"></style>').text(styles.join(';'));
        var header = getSection($, $styles, 'header');
        var footer = getSection($, $styles, 'footer');
        return Promise.all([
            writeFile(options.footerHtml, footer),
            writeFile(options.headerHtml, header)
        ]);
    }).then(() => {
        var content = getSection($, $styles, 'content');
        return render(content, options);
    }).then(buffer => {
        var base64 = buffer.toString('base64');
        callback(null, { data: base64 });
    }).catch(error => {
        console.error(error);
        callback(error);
    });
}

exports.convert = function (event, context, callback) {
    try {
        console.log("covert");
        return convert(event, context, callback)
    } catch (ex) {
        console.error(ex);
    }
}