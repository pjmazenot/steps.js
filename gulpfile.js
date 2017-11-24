'use strict';

// Including Gulp and plugins
let gulp = require('gulp');
let rename = require('gulp-rename');
let concat = require('gulp-concat');
let stripDebug = require('gulp-strip-debug');
let uglify = require('gulp-uglify-es').default;
let gutil = require('gulp-util');

// steps.js version
let stepsjsVersion = '1.0.0';

/* ######################### SCRIPTS ######################### */

// Creating a JavaScript build consisted of all the files specified in gulp.src
gulp.task('build:scripts', function () {
    return gulp.src(['src/**/*.js'])
        .pipe(concat('stepsjs-' + stepsjsVersion + '.js'))
        .pipe(gulp.dest('build'))
        .pipe(stripDebug())
        .pipe(uglify())
        .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('build'));
});

/* ######################### WATCHER ######################### */

// Watching src files changes and running appropriate commands to compile them
gulp.task('watch', function () {
    gulp.watch(['src/**/*.js'], ['build:scripts']);
});