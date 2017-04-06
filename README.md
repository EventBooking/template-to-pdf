# Template to Pdf

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