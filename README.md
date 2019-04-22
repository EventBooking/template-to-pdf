# Template to Pdf
Node: 8.16.0
Running Debian 9 (stretch) amd64
WkHtmlToPDF 0.12.5 (with patched qt)\

## Usage
``` 
const templateToPdf = require('template-to-pdf');
templateToPdf.convert(encodedHtml, options).then(result => {
    console.log(result);
}).catch( error => {
    console.error(error);
});
```

## Options
```
{
    orientation: "landscape",
    pageSize: "letter"
}
```

## Building docker environment
```docker-compose build```

## Starting docker environment
```docker-compose run --rm --service-ports start```

## Running test
```docker-compose run --rm --service-ports start npm test```

## Debugging test
```docker-compose run --rm --service-ports start npm run debug```

...then attach vscode debugger