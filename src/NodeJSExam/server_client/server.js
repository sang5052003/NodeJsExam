var http = require('http');
var fs = require('fs');
var url = require('url');

http.createServer( function (request, response) {

    //URL 뒤에 있는 디렉토리/파일이름 파싱
    var pathname = url.parse(request.url).pathname;

    console.log('Request for ' + pathname + ' received');

    //파일 이름이 비어있으면 index로
    if (pathname == '/'){
        pathname = '/index.html';
    }

    // 앞에 '/'를 빼고 index.html 로 만듬
    console.log(pathname.substr(1));

    //index.html 파일을 읽는다
    fs.readFile(pathname.substr(1), function (err, data) {
        if (err){
            console.log(err);

            //페이지 못찾으면 404
            response.writeHead(404, {'Content-Type': 'text/html'});
        }else{
            
            //헤드작성
            //페이지 찾은 경우
            response.writeHead(200, {'Content-Type': 'text/html'});

            //파일을 읽어와서 responseBody 에 작성
            response.write(data.toString());
        }

        //responseBody 전송
        response.end();
    });
}).listen(8081);

// 클라이언트에서 서버에 접속하면
// URL에서 열고자 하는 파일을 파싱하여 열어준다

console.log('server running at 8081');