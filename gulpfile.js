const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify');
//const cache = require('gulp-cached');
const concat = require('gulp-concat');
const fs = require('fs');


gulp.task('convertjs', function(){
  return gulp.src('./src/**/*.js')
          //.pipe(cache('js'))
          .pipe(gulp.dest('./demo/js'))
          .pipe(concat('MaterialGraph.min.js'))
          .pipe(uglify());
          .pipe(gulp.dest('./dist'));
});

gulp.task('watchjs', ['convertjs'], browserSync.reload());

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
