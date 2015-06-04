var gulp = require('gulp'),
    sass = require('gulp-sass'),
    minifycss = require('gulp-minify-css'),
    autoprefixer = require('gulp-autoprefixer'),
    livereload = require('gulp-livereload'),
    connect = require('gulp-connect');

gulp.task('connect', function() {
  connect.server({
    root: '',
    livereload: true
  });
});

gulp.task('sass', function () {
  gulp.src('scss/style.scss')
    .pipe(sass()
    .on('error', sass.logError))
    .pipe(autoprefixer(
      'last 2 versions',
      '> 1%',
      'ie 9'
      ))
    //.pipe(minifycss())
    .pipe(gulp.dest('css/'))
    .pipe(connect.reload());
});

gulp.task('html', function() {
  gulp.src('*.html')
     .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch('scss/**/*.scss', ['sass']);
  //gulp.watch('js/*.js', ['js']);
  gulp.watch('*.html', ['html']);

});


gulp.task('default', ['connect', 'html', 'sass', 'watch']);