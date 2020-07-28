let project_folder="dist";
let sources_folder="#src";

let path={
    build:{
        html:project_folder + "/",
        css: project_folder +"/css/",
        js: project_folder +"/js/",
        img: project_folder +"/img/",
        fonts: project_folder +"/fonts/",
        php: project_folder +"/php/",
    },
    src:{
        html: [sources_folder + "/*.html", "!" + sources_folder + "/_*.html"],
        css: sources_folder +"/scss/style.scss",
        js: sources_folder +"/js/custom.js",
        img: sources_folder +"/img/**/*.{jpg,png,svg,gif,ico,webp}",
        fonts: sources_folder +"/fonts/*.ttf",
        php: project_folder +"/php/*.php",
    },
    watch:{
        html:sources_folder + "/**/*.html",
        css: sources_folder +"/scss/**/*.scss",
        js: sources_folder +"/js/**/*.js",
        img: sources_folder +"/img/**/*.{jpg,png,svg,gif,ico,webp}"
    },
    clean: "./" + project_folder + "/"
}

let {src, dest} = require('gulp'),
    gulp = require('gulp'),
    browsersync = require('browser-sync').create(),
    fileinclude = require("gulp-file-include"),
    del = require("del"),
    scss = require("gulp-sass"),
    autoprefixer = require("gulp-autoprefixer"),
    group_media = require("gulp-group-css-media-queries"),
    clean_css = require("gulp-clean-css"),
    rename = require("gulp-rename"),
    uglify = require("gulp-uglify-es").default,
    imagemin = require("gulp-imagemin"),
    ttf2woff = require("gulp-ttf2woff"),
    ttf2woff2 = require("gulp-ttf2woff2"),
    fonter = require("gulp-fonter");



function browserSync(params) {
    browsersync.init({
        server: {
            baseDir:  "./" + project_folder + "/"
        },
        port: 3000,
        notify: false
    })
}

function clean(params) {
    return del(path.clean);
}

function watchFiles(params) {
    gulp.watch([path.watch.html],html);
    gulp.watch([path.watch.css],css);
    gulp.watch([path.watch.js],js);
    gulp.watch([path.watch.img],images);
}

function php() {
    return src(path.src.php)
        .pipe(dest(path.build.php))
        .pipe(browsersync.stream())
}

function html() {
    return src(path.src.html)
        .pipe(fileinclude())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream())
}

function css() {
    return src(path.src.css)
        .pipe(scss({
            outputStyle: "expanded"
        }))
        .pipe(
            group_media()
        )
        .pipe(
            autoprefixer({
                overrideBrowserslist: ["last 5 versions"],
                cascade: true
            })
        )
        .pipe(dest(path.build.css))
        .pipe(clean_css())
        .pipe(
            rename({
                extname: ".min.css"
            })
        )
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream())
}
function js() {
    return src(path.src.js)
        .pipe(fileinclude())
        .pipe(dest(path.build.js))
        .pipe(uglify())
        .pipe(
            rename({
                extname: ".min.js"
            })
        )
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream())
}

function images() {
    return src(path.src.img)
        .pipe(
            imagemin({
                progressive: true,
                svgoPlugins: [{removeViewBox: false}],
                interlaced: true,
                optimizationLevel: 3 // 0 to 7
            })
        )
        .pipe(fileinclude())
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream())
}

function fonts(param){
    src(path.src.fonts)
        .pipe(ttf2woff())
        .pipe(dest(path.build.fonts))
   return  src(path.src.fonts)
        .pipe(ttf2woff2())
        .pipe(dest(path.build.fonts))
}

// esli nugno
gulp.task('otf2ttf', function () {
    return src([sources_folder + '/fonts/*.otf'])
        .pipe(fonter({
            formats: ['ttf']
        }))
        .pipe(dest(sources_folder + '/fonts/'))
})

let build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts, php));
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.php = php;
exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;