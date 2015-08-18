var gulp = require('gulp');
var uncss = require('gulp-uncss');
var autoprefixer = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var htmlreplace = require('gulp-html-replace');
var concat = require('gulp-concat');
var closureCompiler = require('gulp-closure-compiler');
var minifyHTML = require('gulp-minify-html');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('css', function () {
	return gulp.src([
		'bower_components/normalize.css/normalize.css',
		'src/css/style.css'])
		.pipe(sourcemaps.init())
		.pipe(concat('style.css'))
		.pipe(uncss({
				  ignore: [/.slider */, /.slide */, '@*', '.fadeIn', '.show'],
				  html  : ['src/index.html']
			  }))
		.pipe(autoprefixer({
				  browsers: ['last 2 versions', 'ie >= 9'],
				  cascade : false
			  }))
		.pipe(minifyCSS())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./dist/css'));
});

gulp.task('script', function (cb) {
	var requirejs = require('requirejs');

	requirejs.optimize({
		'findNestedDependencies': true,
		'baseUrl'               : './src/app',
		'optimize'              : 'none',
		'name'                  : 'main',
		'out'                   : './dist/js/script.js',
		'onModuleBundleComplete': function (data) {
			var fs = require('fs'),
				amdclean = require('amdclean'),
				outputFile = data.path;

			fs.writeFileSync(outputFile, amdclean.clean({
				'filePath': outputFile
			}));

			cb();
		}
	})
});


gulp.task('script-minify', ['script'], function () {
	return gulp.src(['./dist/js/script.js'])
		.pipe(closureCompiler({
				  compilerPath : 'node_modules/google-closure-compiler/compiler.jar',
				  fileName     : 'dist/js/script.min.js',
				  compilerFlags: {
					  compilation_level: 'ADVANCED_OPTIMIZATIONS',
					  warning_level    : 'VERBOSE'
				  }
			  }));
});

gulp.task('html', function () {

	return gulp.src('./src/index.html')
		// Traces all modules and outputs them in the correct order.
		.pipe(htmlreplace({
				  'closest': 'js/polyfill/closest.js',
				  'classList': 'js/polyfill/classList.js',
				  'js'      : 'js/script.js'
			  }))
		.pipe(minifyHTML({
							 conditionals: true
						 }))
		.pipe(gulp.dest('./dist/'));
});

gulp.task('copy-polyfills', function () {
	return gulp.src('./src/app/polyfill/**')
		.pipe(gulp.dest('./dist/js/polyfill'));
});
gulp.task('copy-svg', function () {
	return gulp.src('./src/svg/**/**')
		.pipe(gulp.dest('./dist/svg'));
});

gulp.task('copy', ['copy-polyfills', 'copy-svg']);
gulp.task('default', ['css', 'script', 'script-minify', 'html', 'copy']);