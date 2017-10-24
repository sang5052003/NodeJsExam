//event module 사용
var events = require('events');

//EventEmitter 객체 생성
var eventEmitter = new events.EventEmitter();

//이벤트 핸들러 함수 생성
var connectHandler = function () {
    console.log("connection success");

    //data_receive 이벤트 발생시키기
    eventEmitter.emit('data_receive');
    
}

//connection 이벤트 등록, 이벤트 핸들러 바인드
eventEmitter.on('connection', connectHandler);

//data_receive 이벤트 등록, 이벤트 핸들러 바인드(익명함수로)
eventEmitter.on('data_receive', function () {
    console.log('data receive success');
})

//connection 이벤트 발생시키기
eventEmitter.emit('connection');

console.log('program end');