module.exports = function (app, fs) {
    // app.get('/', function (req, res) {
    //     res.render('index.html');
    // });
    // app.get('/about', function (req, res) {
    //     res.render('about.html')
    // })

    app.get('/', function (req, res) {

        var sess = req.session;

        res.render('index', {
            title: 'MY HOMEPAGE',
            length: 5,
            name: sess.name,
            username: sess.username
        });
    });

// JSON 데이터를 render 메소드의 두번째 인자로 전달
// 함으로서 페이지에서 데이터를 사용가능
// index.ejs 에서 title, length 사용

    // ./ 현재 폴더
    // /../ 상위 폴더 접근
    app.get('/list', function (req, res) {
        fs.readFile(__dirname + '/../data/' + 'user.json', 'utf8', function (err, data) {
            console.log(data);
            res.end(data);
        });
    });

    app.get('/getUser/:username', function (req, res) {
        fs.readFile(__dirname + "/../data/user.json", 'utf8', function (err, data) {

            var users = JSON.parse(data); //json 형식의 텍스트 형태 -> json 파일로..

            console.log(req.params.username);        // :username url 로 넘어온 값
            console.log(users[req.params.username]); // 값의 json객체

            res.json(users[req.params.username]);
        });
    });

    app.post('/addUser/:username', function (req, res) {

        var result = {};
        var username = req.params.username;

        //check req 유효한지
        if (!req.body["password"] || !req.body["name"]){
            result["success"] = 0;
            result["error"] = "invalid request";
            res.json(result);
            return;
        }

        //이미 존재하는 데이터인지 체크
        fs.readFile(__dirname + "/../data/user.json", "utf8", function (err, data) {
            var users = JSON.parse(data);
            if (users[username]){

                result["success"] = 0;
                result["error"] = "duplicate";
                res.json(result);
                return;
            }

            //데이터를 쓰고            
            users[username] = req.body;

            //데이터 저장
            fs.writeFile(__dirname + "/../data/user.json",
                JSON.stringify(users, null, '\t'), //json의 pretty-print를 위함
                "utf8", function (err, data) {
                    result = {"success": 1};
                    res.json(result);
                })
        })
    });

    // PUT API 는 idempotent 해야 합니다,
    // 쉽게말하자면 즉 요청을 몇번 수행하더라도, 같은 결과를 보장해야합니다.
    app.put('/updateUser/:username', function (req,res) {

        var result = {};
        var username = req.params.username;

        if (!req.body["password"] || !req.body["name"]){
            result["success"] = 0;
            result["error"] = "invalid request";
            res.json(result);
            return;
        }

        fs.readFile(__dirname + "/../data/user.json", "utf8", function (err, data) {
            var users = JSON.parse(data);
            users[username] = req.body;

            fs.writeFile(__dirname + "/../data/user.json",
                JSON.stringify(users, null, '\t'), "utf8", function (err, data) {
                    result = {"success": 1};
                    res.json(result);
                })
        })
    });

    app.delete('/deleteUser/:username', function (req, res) {
        var result = {};

        fs.readFile(__dirname + "/../data/user.json", "utf8", function (err, data) {
            var users = JSON.parse(data);

            if (!users[req.params.username]){
                result["success"] = 0;
                result["error"] = "not found";
                res.json(result);
                return;
            }

            delete users[req.params.username];
            fs.writeFile(__dirname + "/../data/user.json",
                JSON.stringify(users, null, '\t'), "utf8", function (err, data) {
                    result["success"] = 0;
                    res.json(result);
                    return;
                })
        })
    });

    //session
    app.get('/login/:username/:password', function (req, res) {
        var sess = req.session;

        fs.readFile(__dirname + "/../data/user.json", "utf8", function (err,data) {

            var users = JSON.parse(data);
            var username = req.params.username;
            var password = req.params.password;
            var result = {};

            //username에 해당하는 json객체 가 없는 경우
            if (!users[username]){
                result["success"] = 0;
                result["error"] = "not found";
                res.json(result);
                return;
            }

            //password 맞으면
            if (users[username]["password"] == password){
                result["success"] = 1;
                //session 에 username 과 name 을 저장
                sess.username = username;
                sess.name = users[username]["name"];
                res.json(result);
            }else{
                result["success"] = 0;
                result["error"] = "incorrect";
                res.json(result);
            }
        })
    });
    
    app.get("/logout", function (req, res) {
        sess = req.session;
        //session 에 username 이 저장되어 있다면
        if (sess.username){
            req.session.destroy(function (err) {
                if (err){
                    console.log(err);
                }else{
                    res.redirect('/');
                }
            })
        }else{
            res.redirect('/');
        }
    })
}
