    var gulp = require('gulp');
    var minifycss = require('gulp-minify-css');
    var uglify = require('gulp-uglify');
    var htmlmin = require('gulp-htmlmin');
    var htmlclean = require('gulp-htmlclean');
    rename = require('gulp-rename');

    // 获取 gulp-imagemin 模块
    var imagemin = require('gulp-imagemin')


    //语法检查
    //gulp.task('jshint',function () {
    //    return gulp.src('./source/js/Vateral.js')
    //        .pipe(jshint())
    //       .pipe(jshint.reporter('default'));
    //});

    //压缩css
    gulp.task('minifycss', function() {
        return gulp.src('./source/css/Vateral.css')    //需要操作的文件
            .pipe(rename({suffix: '.min'}))   //rename压缩后的文件名
            .pipe(minifycss())   //执行压缩
            .pipe(gulp.dest('./source/css'));   //输出文件夹
    });

    //压缩，合并 js
    gulp.task('uglify',function() {
        return gulp.src('./source/js/Vateral.js')      //需要操作的文件
            //.pipe(concat('main.js'))    //合并所有js到main.js
            //.pipe(gulp.dest('js'))       //输出到文件夹
            .pipe(rename({suffix: '.min'}))   //rename压缩后的文件名
            .pipe(uglify())    //压缩
            .pipe(gulp.dest('./source/js'));  //输出
    });

　　//默认命令，在cmd中输入gulp后，执行的就是这个任务(压缩js需要在检查js之后操作)
    gulp.task('default', [
        'minifycss','uglify'
    ]);