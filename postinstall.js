const path = require('path')
    exec = require('child_process').execSync;

exec(`bower install`);

var LD_LIBRARY_PATH = '/tmp/fontconfig/usr/lib/';
exec(`export LD_LIBRARY_PATH="${LD_LIBRARY_PATH}"`);

var wkhtmltopdf = path.join(__dirname, "./bin/wkhtmltopdf");
exec(`chmod +x ${wkhtmltopdf}`);

const fontconfig = path.join(__dirname, "./fontconfig");
exec(`cp -r ${fontconfig} /tmp`);
exec('chmod +x /tmp/fontconfig/usr/bin/fc-cache');
exec('/tmp/fontconfig/usr/bin/fc-cache');