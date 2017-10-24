var http = require('http');

// HTTPRequest 옵션 설정
var options = {
    host: 'localhost',
    port: '8081',
    path: '/index.html'
};

// response는 EventEmitter를 상속한 객체
// 콜백함수로 Response를 받아온다
var callback = function (response) {

    // response 이벤트가 감지 되면 데이터를 body에 받아온다
    var body = '';
    response.on('data', function (data) {
        body += data;
    });

    // end 이벤트가 감지되면 데이터 수신을 종료하고 내용을 출력한다
    response.on('end', function () {

        //데이터 수신완료
        console.log("end 이벤트 발생\n " + body);
    });
}

// 서버에 HTTP Request 를 날림
var req = http.request(options,  callback);
req.end();