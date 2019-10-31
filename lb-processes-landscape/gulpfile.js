'use strict';

const gulp = require('gulp');
const gulpSequence =  require('gulp-sequence');
const build = require('@microsoft/sp-build-web');

build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

// Register the task with gulp command line



gulp.task('dist', gulpSequence('clean', 'bundle', 'package-solution'));

 build.initialize(gulp);