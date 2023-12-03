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
    database : 'postgres',
    password : process.env.POSTGRES_PASSWORD,
    port : process.env.POSTGRES_PORT
});

client.connect();

app.post('/login', (req, res) => {
    const query = {
        text : 'select id from wordmember where id = $1 and password = $2',
        values : [req.body.data.id, req.body.data.pwd]
    }
    client.query(query)
        .then((response) => {
            if(response.rows.length === 0){
                return res.send('login fail');
            }
            return res.send(response.rows[0]);
        })
})

app.post('/duplic', (req, res) => {
    const query = {
        text : 'select * from wordmember where id = $1',
        values : [req.body.data.id]
    }
    client.query(query)
        .then((response) => {
            if(response.rows.length > 0){
                return res.send('duplic')
            }
            return res.send('sucess')
        })
})

app.post('/sign', (req, res) => {
    const query = {
        text : 'insert into wordmember values($1, $2, $3)',
        values : [req.body.data.id, req.body.data.pwd, req.body.data.email]
    }
    client.query(query)
        .then((response) => {
            res.send('sucess');
        })
        .catch((e) => { console.error(e.stack) })
})

app.post('/load', (req, res) => {
    const query = {
        text : req.body.data.text,
        values : [req.body.data.id]
    };
    client.query(query)
        .then((response) => {
            res.send(response.rows);
        })
        .catch((e) => { console.error(e.stack) });
    });

app.post('/selectWord', (req, res) => {
    const query = {
        text : 'select * from wordlist where mid = $1 and word = $2',
        values : [req.body.data.id, req.body.data.word]
    }
    client.query(query)
        .then((response) => {
            if(response.rows.length > 0){
                return res.send(response.rows[0]);
            }
            return res.send('sucess');
        })
        .catch((e) => {console.error(e.stack)});
})

app.post('/profile', (req, res) => {
    const query = {
        text : 'select * from wordmember where id = $1',
        values : [req.body.data.id] 
    }
    client.query(query)
        .then((response) => {
            return res.send(response.rows);
        })
        .catch((e) => {console.log(e.stack)});
})

app.post('/passwordCheck', (req, res) => {
    const query = {
        text : 'select * from wordmember where id = $1 and password = $2',
        values : [req.body.data.id, req.body.data.psw]
    }

    client.query(query)
        .then((response) => {
            if(response.rows.length === 1){
                return res.send('sucess')
            }
            return res.send('fail')
        }).catch((e) => {console.error(e.stack); res.send('fail')})
        
})

app.post('/updateProfile', (req, res) => {
    const query = {
        text : 'update wordmember set password = $1, email = $2 where id = $3',
        values : [req.body.data.psw, req.body.data.email, req.body.data.id]
    }

    client.query(query)
        .then((response) => {
            res.send('sucess');
        })
        .catch((e) => {console.error(e.stack); res.send('fail')})
})

app.post('/addWord', (req, res) => {
    const query = {
        text : 'insert into wordlist values($1, default, $2, $3)',
        values : [req.body.data.id, req.body.data.word, req.body.data.mean]
    }
    client.query(query)
        .then((response) => {
            res.send();
        })
        .catch((e) => {console.error(e.stack)});
})

app.post('/updateWord', (req, res) => {
    const query = {
        text : 'update wordlist set word = $1, mean = $2 where mid = $3 and num = $4',
        values : [req.body.data.word, req.body.data.mean, req.body.data.mid, req.body.data.num]
    }
    client.query(query)
        .then((response) => {

        })
        .catch((e) => {console.error(e.stack)})
});

app.post('/delete', (req, res) => {
    const query = {
        text : 'delete from wordlist where mid = $1 and num = $2',
        values : [req.body.data.id, req.body.data.num]
    };
    client.query(query)
        .then((response) => {
            res.send();
        })
        .catch((e) => {console.error(e.stack)});

})

app.post('/deleteWords', (req, res) => {
    let deletes = req.body.data.deletes;
    for(let i = 0; i < deletes.length; i++){
        const query = {
            text : 'delete from wordlist where mid = $1 and num = $2',
            values : [req.body.data.id, deletes[i]]
        }
        client.query(query)
            .then((response) => {

            })
            .catch((e) => {console.error(e.stack)})
    }
});

app.post('/updateWords', (req, res) => {
    let checkUpdate = req.body.data.checkUpdate;
    for(let i = 0; i < checkUpdate.length; i++){
        const query = {
            text : 'update wordlist set word = $1, mean = $2 where mid = $3 and num = $4',
            values : [checkUpdate[i].word, checkUpdate[i].mean, req.body.data.id, checkUpdate[i].num]
        }
        client.query(query)
            .then((response) => {

            })
            .catch((e) => {console.error(e.stack)})
    }
});




app.listen(PORT, ()=>console.log(`${PORT} Listenling!`));