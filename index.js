var wkhtmltopdf = require("wkhtmltopdf"),
    cheerio = require('cheerio'),
    fs = require("fs"),
    froala_css = './bower_components/froala-wysiwyg-editor/css/froala_style.css';

function getHtml($, $styles, section) {
    var $section = $(section);
    if ($section.length == 0)
        return;

    var $head = $('<head></head>')
        .append($styles);

    var $body = $('<body class="fr-view" style="margin:0; padding: 0;"></body>')
        .append($.html($section));

    return '<!DOCTYPE html><html>' + $.html($head) + $.html($body) + '</html>';
}

function getBuffer(stream) {
    return new Promise((resolve, reject) => {
        var buffer;
        stream.on('data', function (data) {
            buffer = data;
        });
        stream.on('end', function () {
            resolve(buffer);
        });
    });
}

exports.convert = function (event, context, callback) {
    var $ = cheerio.load(event.html);

    fs.readFile(froala_css, 'utf8', function (err, css) {
        var additionalCss = "";//"html{zoom:0.53;}";
        var $styles = $('<style type="text/css"></style>').text(additionalCss + css);

        var header = getHtml($, $styles, 'header');
        var content = getHtml($, $styles, 'content');
        var footer = getHtml($, $styles, 'footer');

        fs.writeFile('header.html', header);
        var options = {
            headerHtml: 'header.html',
            headerSpacing: "2"
        };

        wkhtmltopdf.command = "C:/Program Files/wkhtmltopdf/bin/wkhtmltopdf.exe";

        wkhtmltopdf(content, options, (err, stream) => {
            if (!callback)
                return;

            getBuffer(stream).then(buffer => {
                var base64 = buffer.toString('base64');
                callback(err, { data: base64 });
            });
        });

    });
}