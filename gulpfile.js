/* eslint-env node */

'use strict';

const Fiber = require('fibers');
const autoprefixer = require('gulp-autoprefixer');
const beeper = require('beeper');
const chalk = require('chalk');
const cleanCSS = require('gulp-clean-css');
const del = require('del');
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const log = require('fancy-log');
const prettier = require('gulp-prettier-plugin');
const sass = require('gulp-sass');
const sassdoc = require('sassdoc');
const sasslint = require('gulp-stylelint');
const sourcemaps = require('gulp-sourcemaps');
const { spawn } = require('child_process');

sass.compiler = require('sass');

const paths = {
  SASS_DIR: './src/scss/',
  CSS_DIR: './assets/css/',
  IMG_SRC_DIR: './src/images/',
  IMG_DEST_DIR: './assets/images/',
  OUTPUT_DIR: './docs/',
  IGNORE: ['!**/.#*', '!**/flycheck_*'],
  init: function() {
    this.SASS = [this.SASS_DIR + '**/*.scss'].concat(this.IGNORE);
    return this;
  },
}.init();

// Try to ensure that all processes are killed on exit
const spawned = [];
process.on('exit', () => {
  spawned.forEach(pcs => {
    pcs.kill();
  });
});

const spawnTask = function(command, args, cb) {
  spawned.push(
    spawn(command, args, { stdio: 'inherit' })
      .on('error', err => {
        beeper();
        return cb(err);
      })
      .on('exit', cb),
  );
};

gulp.task('imagemin', () =>
  gulp
    .src(`${paths.IMG_SRC_DIR}**/*`)
    .pipe(
      imagemin([
        imagemin.gifsicle(),
        imagemin.jpegtran(),
        imagemin.optipng(),
        imagemin.svgo(),
      ]),
    )
    .pipe(gulp.dest(paths.IMG_DEST_DIR)),
);

gulp.task('sass', () => {
  return gulp
    .src(paths.SASS_DIR + '**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({ fiber: Fiber }))
    .pipe(
      autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false,
      }),
    )
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.CSS_DIR));
});

const onError = function(err) {
  log.error(chalk.red(err.message));
  beeper();
  this.emit('end');
};

const sasslintTask = (src, failOnError, shouldLog) => {
  if (shouldLog) {
    const cmd = `sasslint ${src}`;
    log('Running', `'${chalk.cyan(cmd)}'...`);
  }
  const stream = gulp.src(src).pipe(
    sasslint({
      reporters: [{ formatter: 'string', console: true }],
      failAfterError: failOnError,
    }),
  );
  if (!failOnError) {
    stream.on('error', onError);
  }
  return stream;
};

gulp.task('sasslint', () => sasslintTask(paths.SASS, true));

gulp.task('sasslint-nofail', () => sasslintTask(paths.SASS));

const prettierTask = (src, shouldLog) => {
  if (shouldLog) {
    const cmd = `prettier ${src}`;
    log('Running', `'${chalk.cyan(cmd)}'...`);
  }
  return gulp
    .src(src, { base: './' })
    .pipe(prettier({ singleQuote: true, trailingComma: 'all' }))
    .pipe(gulp.dest('./'))
    .on('error', onError);
};

gulp.task('prettier', () => prettierTask(paths.SASS));

gulp.task(
  'sassdoc',
  gulp.series('sass', () => {
    const stream = sassdoc();

    gulp.src(paths.SASS).pipe(stream);

    return stream.promise;
  }),
);

gulp.task('watch', cb => {
  gulp.watch(paths.SASS, gulp.parallel(['sasslint', 'sassdoc']));
  gulp.watch(paths.IMG_SRC_DIR, gulp.parallel('imagemin'));

  // lint all scss when rules change
  gulp.watch('**/.stylelintrc.yml', gulp.parallel('sasslint-nofail'));

  cb();
});

gulp.task('build-assets', gulp.parallel('imagemin', 'sassdoc'));

gulp.task('build-clean', () => del([`${paths.OUTPUT_DIR}**`]));

gulp.task(
  'build',
  gulp.series(gulp.parallel('build-assets', 'build-clean'), cb =>
    spawnTask('yarn', ['eleventy'], cb),
  ),
);

gulp.task(
  'serve',
  gulp.series(gulp.parallel('build-assets', 'build-clean'), cb =>
    spawnTask('yarn', ['eleventy', '--serve'], cb),
  ),
);

gulp.task('default', gulp.parallel('watch', 'serve'));
