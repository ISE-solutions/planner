'use strict';

const fs = require('fs')
const build = require('@microsoft/sp-build-web');
const gulp = require('gulp')

build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

var getTasks = build.rig.getTasks;
build.rig.getTasks = function () {
  var result = getTasks.call(build.rig);

  result.set('serve', result.get('serve-deprecated'));

  return result;
};

const path = require('path');
build.configureWebpack.mergeConfig({
  additionalConfiguration: (generatedConfiguration) => {
    if(!generatedConfiguration.resolve.alias){
      generatedConfiguration.resolve.alias = {};
    }

    // shared components
    generatedConfiguration.resolve.alias['~/hooks'] = path.resolve( __dirname, 'lib/hooks/')
    generatedConfiguration.resolve.alias['~/config'] = path.resolve( __dirname, 'lib/config/')
    generatedConfiguration.resolve.alias['~/components'] = path.resolve( __dirname, 'lib/components/')
    generatedConfiguration.resolve.alias['~/providers'] = path.resolve( __dirname, 'lib/providers/')
    generatedConfiguration.resolve.alias['~/utils'] = path.resolve( __dirname, 'lib/utils/')
    generatedConfiguration.resolve.alias['~/webparts'] = path.resolve( __dirname, 'lib/webparts/')
    generatedConfiguration.resolve.alias['~/store'] = path.resolve( __dirname, 'lib/store/')
    generatedConfiguration.resolve.alias['~/services'] = path.resolve( __dirname, 'lib/services/')

    return generatedConfiguration;
  }
});

/* fast-serve */
const { addFastServe } = require("spfx-fast-serve-helpers");
addFastServe(build);
/* end of fast-serve */

gulp.task('set-prod-node-env', function() {
  return process.env.NODE_ENV = 'production';
});

if (process.env.NODE_ENV !== 'production') {
  let reactDomServerContent = '';

  build.rig.addPreBuildTask({
    name: 'react-dom-server-prebuild',
    execute: async () => {
      try {
        reactDomServerContent = fs.readFileSync('./node_modules/react-dom/server.browser.js', 'utf8');
        fs.writeFileSync('./node_modules/react-dom/server.browser.js',
          `'use strict';
    module.exports = require('./cjs/react-dom-server.browser.production.min.js');
    `);
      } catch (e) {
        console.log(e);
      }
    }
  });

  build.rig.addPostBundleTask({
    name: 'react-dom-server-postbuild',
    execute: async () => {
      fs.writeFileSync('./node_modules/react-dom/server.browser.js', reactDomServerContent);
    }
  });
}
build.tslintCmd.enabled = false;
build.initialize(gulp);