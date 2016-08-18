var conversion = require("phantom-html-to-pdf")(),
    phantomjs = require("phantomjs-prebuilt"),
    cheerio = require('cheerio'),
    fs = require("fs"),
    froala_css = './bower_components/froala-wysiwyg-editor/css/froala_style.css';

function getHtml($, $styles, section) {
    var $section = $(section);
    if ($section.length == 0)
        return;

    var $head = $('<head></head>')
        .append($styles);

    var $body = $('<body class="fr-view"></body>')
        .append($.html($section));
    
    return '<DOCTYPE html><html>' + $.html($head) + $.html($body) + '</html>';
}

function getBuffer(stream, callback) {
    var buffer;
    stream.on('data', function (data) {
        buffer = data;
    });
    stream.on('end', function () {
        callback(buffer);
    });
}

exports.convert = function (event, context, callback) {
    var $ = cheerio.load(event.html);

    fs.readFile(froala_css, 'utf8', function (err, css) {
        var additionalCss = "html{zoom:0.53;}";
        var $styles = $('<style type="text/css"></style>').text(additionalCss + css);

        var options = {
            header: getHtml($, $styles, 'header'),
            html: getHtml($, $styles, 'content'),
            footer: getHtml($, $styles, 'footer'),
            phantomPath: phantomjs.path,
            paperSize: {
                
            }
        }

        // see: https://www.npmjs.com/package/phantom-html-to-pdf#image-in-header
        if (options.header) {
            // options.paperSize.headerHeight = '5.5cm';
            var imgs = $("img", options.header).clone();
            imgs.css("display","none");
            var html = $(options.html).append(imgs);
            options.html = $.html(html);
        }

        conversion(options, function (err, pdf) {
            getBuffer(pdf.stream, function (buffer) {
                if (callback) {
                    var base64 = buffer.toString('base64');
                    callback(err, {
                        data: base64
                    });
                }
            })

            conversion.kill();
        });
    });
}