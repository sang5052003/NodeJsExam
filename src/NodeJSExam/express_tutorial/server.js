//express 서버 생성
var express = require('express');
var app = express();

//브라우저에서 Request가 왔을 대 서버에서 어떤 작업을 할지 Router를 통하여 설정
var router = require('./router/main')(app);

// __dirname
// The directory name of the current module
// This the same as the path.dirname() of the __filename
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.static('public'));

var server = app.listen(3000, function () {

    console.log('Express server ahs started on 3000 port');
});

//split
//
// app.get('/', function (req, res) {
//     res.send('hellow');
// });