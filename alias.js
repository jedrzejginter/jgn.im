const {readFileSync, writeFileSync, fstat} = require('fs');
const {join} = require('path');

const redirectsFilePath = join(__dirname, '_redirects');
const redirectsContents = readFileSync(redirectsFilePath, 'utf-8');

const redirects = redirectsContents
  .match(/^\/.+/mg)
  .filter(Boolean)
  .map((record) => record.split(" "));

const newAlias = process.argv[2];
const newUrl = process.argv[3];

if (!newAlias || !newUrl) {
  throw new Error("Alias and url required");
}

if (redirects.find(([alias]) => alias === newAlias)) {
  throw new Error(`Alias for ${newAlias} is already registered`);
}

if (!newUrl.startsWith('http')) {
  throw new Error('Url must use http or https');
}

redirects.push([`/${newAlias}`, newUrl]);

const newRedirectsContents = redirects
  .map(([alias, url]) => `${alias} ${url}`)
  .join('\n')
  .concat('\n'); // add empty line to the end of the file

writeFileSync(redirectsFilePath, newRedirectsContents, 'utf-8');
