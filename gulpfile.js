import gulp from 'gulp';
import gulpSass from 'gulp-sass';
import * as dartSass from 'sass';
import prefixer from 'gulp-autoprefixer';
import clean from 'gulp-clean-css';
import concat from 'gulp-concat';
import map from 'gulp-sourcemaps';
import browser from 'browser-sync';
import include from 'gulp-file-include';
// import uglify from 'gulp-uglify-es';

const sass = gulpSass(dartSass);

export const html = () => {
  return gulp.src('source/**/*.html').pipe(include()).pipe(gulp.dest('build')).pipe(browser.stream())
}

export const style = () => {
  return gulp.src('source/styles/styles.scss', { sourcemaps: true })
  .pipe(map.init())
  .pipe(sass({
      outputStyle: 'compressed'
  }).on('error', sass.logError))
  .pipe(prefixer({
    overrideBrowserslist: ['last 8 versions'],
    browsers: [
      'Android >= 4',
      'Chrome >= 20',
      'Firefox >= 24',
      'Explorer >= 11',
      'iOS >= 6',
      'Opera >= 12',
      'Safari >= 6',
    ],
  }))
  .pipe(clean({
    level: 2
  }))
  .pipe(concat('style.min.css'))
  .pipe(map.write('../sourcemaps/'))
  .pipe(gulp.dest('build/css/'))
  .pipe(browser.stream())
}

// export const devJs = () => {
//   return gulp.src('source/js/main.js')
//     .pipe(map.init())
//     .pipe(uglify.default())
//     .pipe(concat('main.min.js'))
//     .pipe(map.write('../sourcemaps'))
//     .pipe(gulp.dest('build/js/'))
//     .pipe(browser.stream())
// }

export const copy = (done) => {
  return gulp.src([
    "source/*.html",
    "source/images/**/*.svg",
    "source/js/**/*.js",
    "source/icons/**/*.svg",
  ], {base: "source"})
  .pipe(gulp.dest("build"))
}

export const server = () => {
  browser.init({
    server: {
      baseDir: 'build/',
      host: '192.168.0.9',
    },
    callback: {
      ready: (err, browser) => {
        browser.addMiddleware("*", (req, res) => {
          res.writeHead(302, {
            location: "404.html"
          });
          req.end("Reditecting!");
        });
      }
    },
	  logPrefix: 'BS-HTML:',
	  logLevel: 'info',
	  logConnections: true,
	  logFileChanges: true,
	  open: true
  })
}

export const watching = () => {
  gulp.watch('source/styles/**/*.scss', gulp.parallel('style'));
  gulp.watch('source/**/*.html', gulp.parallel('html'));
  // gulp.watch('source/js/**/*.js', gulp.parallel('devJs'));
}

export const build = gulp.series(
  style,
  copy,
)

export default gulp.series(
  style,
  copy,
  gulp.parallel(
    server,
    watching
  )
)
