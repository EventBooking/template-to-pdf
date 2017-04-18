var path = require('path'),
    uniqueFilename = require("unique-filename"),
    utils = require("./utils.js"),
    cheerio = require("cheerio");

async function convert(encodedHtml, options) {
    const _options = {
        headerHtml: uniqueFilename("/tmp", "header") + ".html",
        footerHtml: uniqueFilename("/tmp", "footer") + ".html",
        headerSpacing: 5,
        footerSpacing: 5,
        marginLeft: "10mm",
        marginRight: "10mm",
        orientation: options.orientation,
        pageSize: options.pageSize,
        debug: options.debug
    };

    try {
        var html = utils.decodeHtml(encodedHtml),
            $ = cheerio.load(html);

        var _styles = await Promise.all([
            utils.readFile(path.join(__dirname, 'styles.css'), 'utf-8'),
            utils.readFile(path.join(__dirname, 'bower_components/froala-wysiwyg-editor/css/froala_style.css'), 'utf8'),
            utils.readFile(path.join(__dirname, 'bower_components/angular-document/dist/angular-document.css'), 'utf8')
        ]);

        var _scripts = await Promise.all([
            utils.readFile(path.join(__dirname, 'scripts.js'), 'utf-8')
        ]);

        var header = utils.getSection($, _styles, _scripts, 'header');
        var footer = utils.getSection($, _styles, _scripts, 'footer');

        await Promise.all([
            utils.writeFile(_options.footerHtml, footer),
            utils.writeFile(_options.headerHtml, header)
        ]);

        var content = utils.getSection($, _styles, _scripts, 'content');
        var buffer = await utils.render(content, _options);

        var base64 = buffer.toString('base64');
        return base64;
    } finally {
        await Promise.all([
            utils.removeFile(_options.footerHtml),
            utils.removeFile(_options.headerHtml)
        ]);
    }
}

exports.convert = convert;