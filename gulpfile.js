// gulp.js 設定
let
  // モジュール
  gulp = require('gulp'), //gulp
  runSequence = require('run-sequence'), //直列処理のためのやつ
  del = require('del'), //ファイル削除
  newer = require('gulp-newer'), //更新されたやつだけ通す
  plumber = require('gulp-plumber'), //watch中にエラー起きても続ける
  notify = require('gulp-notify'), //通知
  imagemin = require('gulp-imagemin'), //画像圧縮
  htmlclean = require('gulp-htmlclean'), //HTML圧縮
  babel = require('gulp-babel'), //ES6をES5に変換
  uglify = require('gulp-uglify'), //Javascrupt圧縮
  cleancss = require('gulp-clean-css'), //CSS圧縮
  sass = require('gulp-sass'), //SASS
  autoprefixer = require('gulp-autoprefixer'), //CSSのプレフィックスつけるやつ

  // フォルダーの設定
  folder = {
    source: './public_source/',
    build: './public/'
  }
;





//ビルドフォルダ内の全てのファイルを削除
gulp.task('delete', function(cb){
  return del([folder.build + '**/**/*'], cb);
});

//ソースフォルダ内の全てのファイルを構造をそのままにコピー
gulp.task('copy', function(){
  return gulp.src([folder.source + '**/**/*', '!' + folder.source + '**/**/*.pug', '!' + folder.source + '**/**/*.scss'], { base: folder.source })
    .pipe(newer(folder.build))
    .pipe(gulp.dest(folder.build));
});





// 画像圧縮タスク
gulp.task('image-minify', function() {
  return gulp.src([folder.source + '**/**/*.png', folder.source + '**/**/*.jpg'], { base: folder.source })
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>") //<-
    }))
    .pipe(newer(folder.build))
    .pipe(imagemin({ optimizationLevel: 5 }).on('error', function(e){
      console.log(e);
    }))
    .pipe(gulp.dest(folder.build));
});

// HTML圧縮タスク
gulp.task('html-minify', function(){
  return gulp.src(folder.source + '**/**/*.html', { base: folder.source })
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>") //<-
    }))
    .pipe(newer(folder.build))
    .pipe(htmlclean().on('error', function(e){
      console.log(e);
    }))
    .pipe(gulp.dest(folder.build));
});

// Javascript圧縮タスク
gulp.task('js-minify', function(){
  return gulp.src([folder.source + '**/**/*.js', '!' + folder.source + '**/**/_*.js'], { base: folder.source })
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>") //<-
    }))
    .pipe(newer(folder.build))
    .pipe(babel())
    .pipe(uglify().on('error', function(e){
      console.log(e);
    }))
    .pipe(gulp.dest(folder.build));
});

// CSS圧縮タスク
gulp.task('css-minify', function(){
  return gulp.src(folder.source + '**/**/*.css', { base: folder.source })
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>") //<-
    }))
    .pipe(newer(folder.build))
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(autoprefixer({
      browsers: ["last 2 versions", "ie >= 11"],
      cascade: false
    }))
    .pipe(cleancss().on('error', function(e){
      console.log(e);
    }))
    .pipe(gulp.dest(folder.build));
});





// SASSコンパイルタスク
gulp.task('sass', function(){
  return gulp.src([folder.source + '**/**/*.sass', folder.source + '**/**/*.scss', '!' + folder.source + '**/**/_*.*'], { base: folder.source })
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>") //<-
    }))
    .pipe(newer(folder.build))
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(autoprefixer({
      browsers: ["last 2 versions", "ie >= 11"],
      cascade: false
    }))
    .pipe(gulp.dest(folder.build));
});




// Herokuデプロイ用
// gulp.task('deploy', function(){
//   console.log('####### ALL-MINIFYが実行されました #######');
//   runSequence('image-minify', 'html-minify', 'css-minify', 'js-minify', 'copy');
// });

// 画像, HTML, CSS, Javascriptを圧縮
gulp.task('minify', function(){
  console.log('####### ALL-MINIFYが実行されました #######');
  runSequence('delete', 'image-minify', 'html-minify', 'css-minify', 'js-minify', 'copy');
});

//ビルド
gulp.task('build', function(){
  console.log('####### BUILDが実行されました #######');
  runSequence('sass', 'copy');
});

//再ビルド
gulp.task('rebuild', function(){
  console.log('####### BUILDが実行されました #######');
  runSequence('delete',　'build');
});

//全てのファイルを再ビルド
//gulp.task('all-rebuild', ['all-delete', 'build'], function(){});

// watch sourceフォルダ内のファイルが更新されたら all-minify を実行
gulp.task('default', function(){
  runSequence('rebuild', 'watch');
});

gulp.task('watch', function(){
  gulp.watch(folder.source + '**/**/*', ['build']);
});
