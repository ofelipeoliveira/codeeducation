const express = require("express");
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
const config = {
    host: "db",
    user: "root",
    password: "root",
    database: "nodedb"
};
const mysql = require("mysql");
const conn = mysql.createConnection(config);

const initDatabase = () => {
    var createDatabase = `CREATE TABLE IF NOT EXISTS people(
        id int not null auto_increment,
        name varchar(255),
        primary key(id)
     )`;
    conn.query(createDatabase);

    conn.query("DELETE FROM people;");
    conn.query("INSERT INTO people(name) values ('Felipe');");
    conn.query("INSERT INTO people(name) values ('Maria');");
    conn.query("INSERT INTO people(name) values ('João');");
};

const printHtml = (peoples) => {
    var response = "<h1>Full Cycle Rocks!</h1><br />";
    response += "<ul>";
    peoples.forEach(p => {
        console.log(p);
        response += "<li>" + p.name + "</li>";
    });
    response += "</ul>";
    return response;
};

//Inicializa o banco com 3 nomes
initDatabase();

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    conn.query("SELECT * FROM people", function (err, peoples, fields) {
        if (err) throw err;
        const resultHtml = printHtml(peoples);
        res.send(resultHtml)
    });
});

app.post("/", (req, res) => {
    conn.query("INSERT INTO people(name) values ('" + req?.body?.nome + "');");
    res.send("Pessoa inserida: " + req?.body?.nome);
});

app.listen(port, () => {
    console.log("Rodando na porta " + port);
});