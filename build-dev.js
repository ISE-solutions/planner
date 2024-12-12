const fs = require('fs');

fs.copyFile('./config/config.prd.json', './config/config.json', function (err) {
  if (err) console.log('ERROR: ' + err);
});

fs.copyFile(
  './config/package-solution.prd.json',
  './config/package-solution.json',
  function (err) {
    if (err) console.log('ERROR: ' + err);
  }
);

fs.copyFile(
  './src/config/constants.dev.ts',
  './src/config/constants.ts',
  function (err) {
    if (err) console.log('ERROR: ' + err);
  }
);
