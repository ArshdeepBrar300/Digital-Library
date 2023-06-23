const http = require("http");
const fs = require("fs");
const mysql = require("mysql");
const qs = require("querystring");
const hostname = "127.0.0.1";
const port = 3000;

function onRequest(req, res) {
  res.statusCode = 200;

  res.setHeader("Content-Type", "text/HTML");
  if (req.url == "/") {
    index(req, res);
  } else if (req.url == "/signin") {
    showsignin(req, res);
  } else if (req.url == "/dosignin") {
    dosignin(req, res);
  } else if (req.url == "/signup") {
    showsignup(req, res);
  } else if (req.url == "/dosignup") {
    dosignup(req, res);
  } else {
    res.writeHead(404, {
      "Content-Type": "text/html",
    });
    return res.end("404 Not Found");
  }
}

function showsignup(req, res) {
  fs.readFile("../layouts/signup/signup.html", "utf8", (err, data) => {
    res.write(data);
    return res.end();
  });
}

function dosignup(req, res) {
  var body = "";
  req.on("data", function (data) {
    body += data;
    console.log("Partial body: " + body);
  });
  req.on("end", function () {
    console.log("Body: " + body);
    var qs = new URLSearchParams(body);
    var username = qs.get("username");
    var passwd = qs.get("passwd");
    var confpasswd = qs.get("confpasswd");
    if (passwd != confpasswd) {
      res.write("<h1>Password Mismatch</h1>");
      return res.end();
    }
    var con = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "gold0000",
      database: "mydb",
    });
    con.connect(function (err) {
      if (err) throw err;
      console.log("Connected!");
      var sql = "INSERT INTO user (name, password) VALUES (?,?)";
      con.query(sql, [username, passwd], function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        res.write("<h1>Congratulations! You have signed up successfully");
        res.end();
      });
    });
  });
}

function dosignin(req, res) {
  var body = "";
  req.on("data", function (data) {
    body += data;
    console.log("Partial body: " + body);
  });
  req.on("end", function () {
    console.log("Body: " + body);
    var qs = new URLSearchParams(body);
    var username = qs.get("username");
    var passwd = qs.get("passwd");
    var con = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "gold0000",
      database: "mydb",
    });
    con.connect(function (err) {
      if (err) throw err;
      con.query(
        "SELECT * FROM user where name=? and password=?",
        [username, passwd],
        function (err, result, fields) {
          if (err) throw err;
          console.log(result);
          if (result.length == 1) {
            res.write("<h1>Sign-In Successful</h1>");
            res.end();
          } else {
            res.write("<h1>Sign-in Failed</h1>");
            res.end();
          }
        }
      );
    });
  });
}

function showsignin(req, res) {
  fs.readFile("../layouts/signin/signin.html", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    res.write(data);
    console.log(data);

    func(req, res);

    return res.end();
  });
}

function func(req, res) {
  fs.readFile("../layouts/signin/signin-illus.svg", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    res.write(data);
    console.log(data);
  });
}

function index(req, res) {
  fs.readFile("../layouts/signin/signin.html", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(data);

    res.write(data);
    return res.end();
  });
}
const server = http.createServer((req, res) => {
  onRequest(req, res);
});
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

// server static files
