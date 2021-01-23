const express = require("express")
const mysql = require('mysql2/promise');

const fs = require("fs")
const app = express();
const Loga = async(text) => {
    let date = new Date()
    fs.appendFile(`./logs/${date.toDateString()}.log`, `${date.toTimeString()} : ${text}\n`, (e) => {

    })
};
(async function() {
    let connection = await mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: '4818115a',
        database: "WandJ"
    });

    app.use(function(req, res, next) {
        console.log(`[IP] ${req.ip.match(/[0-9.]+/g)[0]} [Method] ${req.method} [Status] ${res.statusCode} [Url] ${req.url} `)
        Loga(`[IP] ${req.ip.match(/[0-9.]+/g)[0]} [Method] ${req.method} [Status] ${res.statusCode} [Url] ${req.url} `)
        try {
            decodeURIComponent(req.path)
            next();
        } catch (e) {
            Loga(`Error : ${e}`)
            console.error(e)
            res.status(503).send("好像出錯了?")
        }

    })
    app.use(express.static("C:\\Users\\young\\OneDrive\\文件\\Code\\web server\\W and J\\frontend\\vite-recipe-book\\dist"))
    app.use(express.static("./public"))


    await connection.execute("CREATE TABLE IF NOT EXISTS WandJ (Author Text, Time Text, Title Text, Content Text, File TEXT,Id Int)")

    app.all("*", function(req, res, next) {
        //设置允许跨域的域名，*代表允许任意域名跨域
        res.header("Access-Control-Allow-Origin", "*");
        //允许的header类型
        res.header("Access-Control-Allow-Headers", "*");
        //跨域允许的请求方式 
        res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
        next();
    })

    app.get("/", function(req, res) {
        res.sendFile("C:\\Users\\young\\OneDrive\\文件\\Code\\web server\\W and J\\frontend\\vite-recipe-book\\dist\\index.html")
    });

    app.post("/api/add-paste", async(req, res) => {
        if (req.query.title.length > 10) {
            res.send({ code: false, message: "title字太多了優" })
            return
        }

        if (req.query.content.length > 2000) {
            res.send({ code: false, message: "Content字太多了優" })
            return
        }
        let filename = null
        console.log(req.query.filename)

        if (req.query.filename !== undefined &&
            req.query.filename !== null &&
            req.query.filename !== 'null') {
            filename = req.query.filename
            let vice = filename.split(".")
            let vicename = vice[vice.length - 1]
            console.log(vicename)
            while (1) {
                console.log(filename)
                let [rows, fields] = await connection.execute(`SELECT * FROM WandJ WHERE File=(\"${filename}\")`)

                if (rows.length === 0) {
                    let writeStream = fs.createWriteStream(`./public/img/${filename}`)
                    let pipe = req.pipe(writeStream)
                    pipe.on("close", async() => {
                        console.log("sdad")
                        if ((req.query.title && req.query.content && req.query.author) !== undefined) {
                            let [rows, fields] = await connection
                                .execute(`SELECT COUNT(Title) FROM WandJ`)
                            let pastenumber = Number(rows[0]["COUNT(Title)"]) + 1
                            await connection.execute(
                                "INSERT INTO WandJ(Author, Time, Title, Content, File, Id) VALUES(?,?,?,?,?,?)", [req.query.author, new Date().getTime(), req.query.title, req.query.content, filename, pastenumber])
                            res.send({ code: true, file: filename })
                        } else {
                            res.send({ code: false, message: "很像少打東西優" })
                        }
                    })
                    break
                } else {
                    let stringlist = []
                    for (let i = 0; i < 64; i++) {
                        let g = Math.floor(
                            (Math.random() * (122 - 48 + 1)) + 48
                        )
                        if (!((g < 64) && (g > 58)) && (g < 91 && g > 60)) {
                            stringlist.push(g)
                        }
                    }
                    filename = `${String.fromCharCode(...stringlist)}.${vicename}`
                }
            }
        }
        console.log(filename)
        if (filename === 'null' || filename === null) {
            if ((req.query.title && req.query.content && req.query.author) !== undefined) {
                let [rows, fields] = await connection
                    .execute(`SELECT COUNT(Title) FROM WandJ`)
                let pastenumber = Number(rows[0]["COUNT(Title)"]) + 1
                await connection.execute(
                    "INSERT INTO WandJ(Author, Time, Title, Content, File, Id) VALUES(?,?,?,?,?,?)", [req.query.author, new Date().getTime(), req.query.title, req.query.content, filename, pastenumber])
                res.send({ code: true, file: filename })
            } else {
                res.send({ code: false, message: "很像少打東西優" })
            }
        }

    });

    app.get("/api/all-paste", async(req, res) => {
        if (req.query.q !== undefined && !isNaN(Number(req.query.q))) {
            let amount = (!isNaN(Number(req.query.a))) ? req.query.a : 10
            let [rows, fields] = await connection
                .execute(`SELECT * FROM WandJ ORDER BY Id DESC Limit ${req.query.q*10},${amount}`)
            res.send(rows)
        } else {
            res.send({ code: "Error", message: "Not parameter a" })
        }
    })

    app.get("/api/paste-quantity", async(req, res) => {
        let [rows, fields] = await connection
            .execute(`SELECT COUNT(Title) FROM WandJ`)
        res.send({ "paste-quantity": rows[0]["COUNT(Title)"] })
    })

    app.get("*", function(req, res) {
        res.status(404).sendFile('C:\\Users\\young\\OneDrive\\文件\\Code\\web server\\W and J\\backend\\public\\html\\404.html')
    })


    app.listen(3000)

})().catch(console.error)