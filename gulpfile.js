
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

var execSync = require('child_process').execSync;

gulp.task('build-all', function() {
  try {
    execSync('mkdir uncompressed');
  } catch(e) {
    // long hair, don't care
    console.log('./uncompressed exists');
  }
  execSync('browserify --standalone Duel -r duel > uncompressed/duel.js');
  execSync('browserify --standalone FFA -r ffa > uncompressed/ffa.js');
  execSync('browserify --standalone GroupStage -r groupstage > uncompressed/groupstage.js');
  execSync('browserify --standalone Tiebreaker -r tiebreaker > uncompressed/tiebreaker.js');
  execSync('browserify --standalone Tournament -r duel -r ffa -r groupstage -r tiebreaker > uncompressed/all.js');
});

gulp.task('uglify-all', ['build-all'], function() {
  return gulp.src('uncompressed/*.js')
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist'));
});
