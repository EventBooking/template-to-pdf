var express = require("express")
    bodyParser = require("body-parser")
    wkhtmltopdf = require("wkhtmltopdf"),
    cheerio = require('cheerio'),
    fs = require("fs")
    uniqueFilename = require("unique-filename");

var _exec = require('child_process').execSync;
var exec = cmd => {
    console.log(`Executing: ${cmd}`);
    _exec(cmd, {});
};
wkhtmltopdf.command = "./bin/wkhtmltopdf";

var app = express();
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));
app.use(bodyParser.json({ limit: "50mb" }));

app.post('/', function(req, res) {
    res.setTimeout(0);

    convert(req.body).then(result => {
        res.send({ data: result });
    }).catch(result => {
        res.status(500);
        res.send();
    });
});

var server = app.listen(80);

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

function removeFile(name) {
    exec(`rm ${name}`);
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

function convert(event) {
    var $ = getHtml(event),
        headerFile = uniqueFilename("/tmp", "header") + ".html",
        footerFile = uniqueFilename("/tmp", "footer") + ".html",
        outputFile = uniqueFilename("/tmp", "output") + ".pdf";

    var options = {
        headerHtml: headerFile,
        footerHtml: footerFile,
        headerSpacing: 5,
        footerSpacing: 5,
        marginLeft: "10mm",
        marginRight: "10mm",
        debug: true,
        output: outputFile
    };

    var _styles, _scripts;

    return new Promise((resolve, reject) => {
        Promise.all([
            readFile('styles.css', 'utf-8'),
            readFile('bower_components/froala-wysiwyg-editor/css/froala_style.css', 'utf8'),
            readFile('bower_components/angular-document/dist/angular-document.css', 'utf8')
        ]).then(styles => {
            _styles = styles;
            return Promise.all([
                readFile('scripts.js', 'utf-8')
            ]);
        }).then(scripts => {
            _scripts = scripts;
            var header = getSection($, _styles, _scripts, 'header');
            var footer = getSection($, _styles, _scripts, 'footer');
            return Promise.all([
                writeFile(footerFile, footer),
                writeFile(headerFile, header)
            ]);
        }).then(() => {
            var content = getSection($, _styles, _scripts, 'content');
            return render(content, options);
        }).then(buffer => {
            var base64 = buffer.toString('base64');
            resolve(base64);
        }).catch(error => {
            console.error(error);
            reject(error);
        }).then(() => {
            removeFile(footerFile);
            removeFile(headerFile);
            removeFile(outputFile);
        });
    });
}