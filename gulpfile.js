require("regenerator/runtime");
var gulp = require("gulp");
var gutil = require("gulp-util");
var plumber = require("gulp-plumber");
var jshint = require("gulp-jshint");
var stylish = require("jshint-stylish");
var esnext = require("gulp-esnext");
var del = require("del");
var _ = require("lodash");

var compile = function() {
    return gulp.src("src/**/*.js")
    .pipe(plumber())
    .pipe(esnext())
    .pipe(gulp.dest("dist"));
};

var lint = function() {
    return gulp.src("src/**/*.js")
    .pipe(plumber())
    .pipe(jshint({
        esnext: true,
        globals: {
            Promise: true,
        },
    }))
    .pipe(jshint.reporter(stylish));
};

var clean = function() {
    del(["dist"]);
};

gulp.task("lint", lint);
gulp.task("compile", ["lint"], compile);

gulp.task("default", ["compile"]);
gulp.task("clean", clean);
