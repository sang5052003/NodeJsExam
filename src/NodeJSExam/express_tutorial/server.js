//express 서버 생성
var express = require('express');
var app = express();

//추가 모듈 부르기
var bodyParser = require('body-parser');
var session = require('express-session');
var fs = require('fs'); //node js 내장 모듈, 파일 열기
// Express 의 이전 버전에서는 cookie-parser 모듈도 불러와야했지만,
// 이젠 express-session 모듈이 직접 쿠키에 접근하므로 cookie-parser 를 더이상 사용 할 필요가 없다

// __dirname
// The directory name of the current module
// This the same as the path.dirname() of the __filename
app.set('views', __dirname + '/views'); //서버가 읽을 수 있도록 HTML 의 위치를 정의
//서버가 HTML 랜더링을 할 때, EJS 엔진을 사용하도록 설정
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

var server = app.listen(3000, function () {
    console.log('Express server ahs started on 3000 port');
});

// 정적파일(Static files) : HTML 에서 사용되는 .js 파일, css 파일, image 파일 등
app.use(express.static('public')); //css dir 위치가 public에 있다

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(session({
    secret: '@#@$MYSIGN#@$#$', //쿠키를 임의로 변조하는것을 방지하기 위한 sign 값. 원하는 값을 넣으면 된다
    resave: false, //세션을 언제나 저장할 지 (변경되지 않아도) 정하는 값
    saveUninitialized: true // 세션이 저장되기 전에 uninitialized 상태로 미리 만들어서 저장
}));

//브라우저에서 Request 가 왔을 대 서버에서 어떤 작업을 할지 Router 를 통하여 설정
//router 모듈 불러서 app 에 전달
var router = require('./router/main')(app, fs); //router 에서 fs를 사용할 수 있도록 추가

//split - router 로 split 시킴
//
// app.get('/', function (req, res) {
//     res.send('hellow');
// });