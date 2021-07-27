const { src, dest, watch, series, parallel } = require('gulp'),
      plumber = require('gulp-plumber'),
      sourcemaps = require('gulp-sourcemaps'),
      rename = require('gulp-rename'),
      del = require('del'),
      stylus = require('gulp-stylus'),
      sass = require('gulp-sass')(require('sass')),
      shorthand = require('gulp-shorthand'),
      postcss = require('gulp-postcss'),
      purgecss = require('gulp-purgecss'),
      autoprefixer = require('autoprefixer'),
      cssnano = require('cssnano'),
      eslint = require('gulp-eslint'),
      babel = require('gulp-babel'),
      terser = require('gulp-terser'),
      cscript = require('gulp-coffee'),
      tscript = require('gulp-typescript'),
      concat = require('gulp-concat'),
      pug = require('gulp-pug'),
      imagemin = require('gulp-imagemin'),
      browserSync = require('browser-sync').create()
//reload = browserSync.reload // buggy! Function below fixes this.

// Paths
const es6Path = 'scripts/es6'
const coffeePath = 'scripts/coffee'
const tsPath = 'scripts/ts'
const scriptsPath = 'scripts/js'
const jsPath = 'scripts/js'
const stylusPath = 'styles/stylus'
const cssPath = 'styles/css'
const scssPath = 'styles/scss'
const pugPath = 'pug'
const imgPath = 'static/img/**/*.*'
const fontsPath = 'static/fonts/**/*.*'
//const srcPath = './'
const destPath = 'dist'

// styles
const plugins = [autoprefixer(), cssnano()]

function styl() {
  return src(`${stylusPath}/*.styl`)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(stylus())
    .pipe(shorthand())
    .pipe(postcss(plugins))
    .pipe(sourcemaps.write('maps'))
    .pipe(dest(`${destPath}/css`))
}

function scss(done) {
  src(`${scssPath}/{*.scss,*.sass}`)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(shorthand())
    .pipe(postcss(plugins))
    .pipe(sourcemaps.write('maps'))
    .pipe(dest(`${destPath}/css`))
  done()
}

function cssLibs(done) {
  src(`${cssPath}/**/*.css`)
    .pipe(plumber())
    .pipe(
      purgecss({
        content: [`${pugPath}/**/*.pug`],
      })
    )
    .pipe(sourcemaps.init())
    .pipe(shorthand())
    .pipe(postcss(plugins))
    .pipe(concat('libs.css'))
    .pipe(
      rename({
        extname: '.min.css',
      })
    )
    .pipe(sourcemaps.write('maps'))
    .pipe(dest(`${destPath}/css`))
  done()
}

// scripts
function es6(done) {
  src(`${es6Path}/*.js`)
    .pipe(plumber())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(
      babel({
        presets: ['@babel/env'],
      })
    )
    .pipe(dest(jsPath))
  done()
}

function coffee() {
  return src(`${coffeePath}/*.coffee`)
    .pipe(plumber())
    .pipe(
      cscript({
        bare: false,
      })
    )
}

function ts() {
  return src(`${tsPath}/*.ts`)
    .pipe(plumber())
    .pipe(
      tscript({
        noImplicitAny: false,
        noLib: false,
        outFile: 'typescript.js',
      })
    )
    .pipe(dest(jsPath))
}

function scripts() {
  return src(`${scriptsPath}/*.js`)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ['@babel/env'],
      })
    )
    .pipe(terser())
    .pipe(concat('app.js'))
    .pipe(
      rename({
        extname: '.min.js',
      })
    )
    .pipe(sourcemaps.write('maps'))
    .pipe(dest(`${destPath}/js`))
}

// Pug
function pages() {
  return src(`${pugPath}/{index.pug,pages/*.pug}`, {
    cwdbase: false,
  })
    .pipe(plumber())
    .pipe(
      pug({
        // Your options in here.
        // https://pugjs.org/api/reference.html
        // opts (Object): Any options from Pug's API in addition to pug's own options.
        // opts.locals (Object): Locals to compile the Pug with. You can also provide locals through the data field of the file object, e.g. with gulp-data. They will be merged with opts.locals.
        // opts.data (Object): Same as opts.locals.
        // opts.client (Boolean): Compile Pug to JavaScript code.
        // opts.pug: A custom instance of Pug for gulp-pug to use.
        // opts.verbose: display name of file from stream that is being compiled.
      })
    )
    .pipe(dest(destPath))
}
// images
function images() {
  return src(imgPath)
    .pipe(
      imagemin([
        // imagemin.gifsicle({ interlaced: true }), //- out of order
        imagemin.mozjpeg({
          quality: 75,
          progressive: true,
        }),
        imagemin.optipng({
          optimizationLevel: 5,
        }),
        imagemin.svgo({
          plugins: [{
            removeViewBox: true,
          },
          {
            cleanupIDs: false,
          },
          ],
        }),
      ])
    )
    .pipe(dest(`${destPath}/img`))
}

function favicon() {
  return src(`static/img/icon/favicon.ico`).pipe(
    imagemin([
      // imagemin.gifsicle({ interlaced: true }),// - out of order
      imagemin.mozjpeg({
        quality: 75,
        progressive: true,
      }),
      imagemin.optipng({
        optimizationLevel: 5,
      }),
      imagemin.svgo({
        plugins: [{
          removeViewBox: true,
        },
        {
          cleanupIDs: false,
        },
        ],
      }),
    ])
  )
    .pipe(dest(`${destPath}/`))
}
// fonts
function fonts() {
  return src(fontsPath).pipe(dest(`${destPath}/fonts`))
}

// Watch for changes
function watchSrc() {
  watch(tsPath, ts)
  watch(coffeePath, coffee)
  watch(es6Path, es6)
  watch(jsPath, series(scripts, reload))
  watch(stylusPath, series(styl, reload))
  watch(scssPath, series(scss, reload))
  watch(cssPath, series(cssLibs, reload))
  watch(imgPath, images, favicon).on('change', browserSync.reload)
  watch(fontsPath, fonts).on('change', browserSync.reload)
  watch(pugPath, series(pages, reload))
}

function deleteDest() {
  return del(destPath)
}
// Server
function serve() {
  browserSync.init({
    server: {
      baseDir: destPath,
      injectChanges: true,
      reloadDelay: 50,
    },
  })
}

function reload(done) {
  browserSync.reload()
  done()
}

// Gulp tasks

// exports.styles = parallel(styl, scss)
// exports.pages = pages
// exports.jss = scripts
// exports.css = series(exports.styles,cssLibs)
exports.jsPlus = parallel(es6, coffee, ts)
exports.js = series(exports.jsPlus, scripts)
exports.build = parallel(exports.js, styl, scss, cssLibs, pages, images, favicon, fonts)
exports.watch = parallel(serve, watchSrc)
exports.default = series(deleteDest, exports.build, exports.watch)