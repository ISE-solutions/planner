const fs = require('fs');

fs.copyFile('./config/config.hml.json', './config/config.json', function (err) {
  if (err) console.log('ERROR: ' + err);
});

fs.copyFile(
  './config/package-solution.hml.json',
  './config/package-solution.json',
  function (err) {
    if (err) console.log('ERROR: ' + err);
  }
);

fs.copyFile(
  './src/config/constants.hml.ts',
  './src/config/constants.ts',
  function (err) {
    if (err) console.log('ERROR: ' + err);
  }
);
