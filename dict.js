const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const { Client } = require('pg');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

const client = new Client({
    user : process.env.POSTGRES_USER,
    host : process.env.POSTGRES_HOST,
    database : 'postgresql',
    password : process.env.POSTGRES_PASSWORD,
    port : process.env.POSTGRES_PORT
});

client.connect();

const query = {
    text : 'select * from wordlist where mid = \'manager\''
};

client.query(query)
.then((response) => {
    let dict = response.rows;
    for(let i = 0; i < dict.length; i++){
        fs.appendFile('englishDict.txt', `insert into wordlist values(\'manager\', default, \'${dict[i].word}\', \'${dict[i].mean}\');\n`, function (err) {
            if (err) throw err;
        })
    }
})
.catch((e) => { console.error(e.stack) });