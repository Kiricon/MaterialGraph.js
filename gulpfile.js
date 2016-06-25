const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const fs = require('fs');


gulp.task('convertjs', function(){
  return gulp.src('./src/**/*.js')
          //.pipe(cache('js'))
          .pipe(gulp.dest('./demo/js'))
          .pipe(concat('MaterialGraph.js'))
          .pipe(gulp.dest('./dist'))
          .pipe(uglify())
          .pipe(rename('MaterialGraph.min.js'))
          .pipe(gulp.dest('./dist'));
});

gulp.task('watchjs', ['convertjs'], function(){
  browserSync.reload();
});

gulp.task('browser-sync', function(){
  browserSync.init({
    server: {
      baseDir: "./demo"
    }
  });
});

gulp.task('watch', function(){
  gulp.watch('./src/**/*.js', ['watchjs']);
});

gulp.task('run', ['browser-sync', 'watch']);
