var path = require('path');
var fs = require('fs');

var minimist = require('minimist');
var webpack = require('webpack');
var gulp = require('gulp');

var gutil = require('gulp-util');
var del = require('del');

{
  var DIST_FOLDER = 'output';

  var webpackLog = function(err, stats) {
    if (err) throw new gutil.PluginError('webpack', err);

    // Get json of stats and prepare it for toString by setting second parameter
    // to |true|, so it will color entires as per stats.toString
    var jsonStats = stats.toJson(null, true);
    var toString = stats.constructor.jsonToString;

    jsonStats.warnings = jsonStats.warnings.filter(function(warn) {
      return warn.indexOf('This seems to be a pre-built javascript file') === -1;
    });

    gutil.log('[webpack]', toString(jsonStats, true));
  };

  var webpackConfig = require('./webpack.config.builder.js')({
    production: false,
    env: {
      folder: DIST_FOLDER
    }
  });
}

gulp.task('clean-dist', function() {
  return del([DIST_FOLDER + '/**/*']);
});

gulp.task('webpack', function(callback) {
  var compiler = webpack(webpackConfig);

  compiler.run(function(err, stats) {
    webpackLog(err, stats);
    callback();
  });
});

gulp.task('webpack-watch', function(callback) {
  var compiler = webpack(webpackConfig);

  compiler.watch({}, function(err, stats) {
    webpackLog(err, stats);
  });

  callback();
});

gulp.task('build', gulp.series('webpack'));
gulp.task('watch', gulp.series('clean-dist', 'webpack-watch'));
gulp.task('default', gulp.series('clean-dist', 'build'));