"use strict";

var gulp = require("gulp");
var del = require("del");
var webpack = require("webpack");
var assign = require("object-assign");

const TerserPlugin = require("terser-webpack-plugin");

gulp.task("clean", function () {
  return del(["./build/*"]);
});

gulp.task("copy", function () {
  gulp.src("./docs/index.html").pipe(gulp.dest("./build"));
  gulp.src("./docs/docs.css").pipe(gulp.dest("./build"));
  gulp.src("./docs/slick.css").pipe(gulp.dest("./build"));
  gulp.src("./docs/slick-theme.css").pipe(gulp.dest("./build"));
  gulp.src("./docs/img/**/*").pipe(gulp.dest("./build/img"));
  gulp
    .src("./node_modules/slick-carousel/slick/fonts/*")
    .pipe(gulp.dest("./build/fonts"));
  return gulp
    .src("./node_modules/slick-carousel/slick/ajax-loader.gif")
    .pipe(gulp.dest("./build"));
});

gulp.task(
  "watch",
  gulp.series(["copy"], function (done) {
    gulp.watch(["./docs/index.html"], gulp.parallel(["copy"]));
    gulp.watch(["./docs/docs.css"], gulp.parallel(["copy"]));
    gulp.watch(["./docs/slick.css"], gulp.parallel(["copy"]));
    gulp.watch(["./docs/slick-theme.css"], gulp.parallel(["copy"]));
    done();
  })
);

// gulp tasks for building dist files
gulp.task("dist-clean", function () {
  return del(["./dist/*"]);
});

var distConfig = require("./webpack.config.dist.js");
gulp.task("dist-unmin", function (cb) {
  var unminConfig = assign({}, distConfig);
  unminConfig.output.filename = "react-slick.js";
  unminConfig.mode = "none";
  return webpack(unminConfig, function (err, stat) {
    console.error(err);
    cb();
  });
});

gulp.task("dist-min", function (cb) {
  var minConfig = assign({}, distConfig);
  minConfig.output.filename = "react-slick.min.js";

  minConfig.plugins = minConfig.plugins.concat(
    new TerserPlugin({
      parallel: true,
      minify: TerserPlugin.uglifyJsMinify,
      terserOptions: {
        compress: true,
        sourceMap: true
      }
    })
  );
  return webpack(minConfig, function (err, stat) {
    console.error(err);
    cb();
  });
});

gulp.task(
  "dist",
  gulp.series(["dist-clean", "dist-unmin", "dist-min"], function (done) {
    done();
  })
);
