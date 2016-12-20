Building
`docker-compose build`

Testing
`docker-compose run -d test`

Packaging and Uploading to S3
* update the version in `package.json`
* run `docker-compose run -d package`
* run `npm run upload:dev` or `npm run upload:prod`
  * (dev drops into venueops.packages.dev)
  * (prod drops into venueops.package)
* log into AWS, and update the lambda service (template-to-pdf) from the proper S3 url
