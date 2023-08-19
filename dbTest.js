// client.query("select now()", (err, res) => {
//     console.log(err, res);
//     client.end();
// })

// 입력
// const query = {
//     text : 'insert into member values($1, $2)',
//     values : [1, '홍길동']
// };

// client.query(query)
//     .then((res)=>{
//         console.log(res);
//         client.end();
//     })
//     .catch((e) => {console.error(e.stack)});

// 조회
// const query = {
//     text : 'select * from member'
// };

// client.query(query)
//     .then((res)=>{
//         console.log(res.rows[0]);
//         client.end();
//     })
//     .catch((e) => {console.error(e.stack)});
// res.rows은 [ { id: 1, name: '홍길동' } ]처럼 배열안에 조회 결과가 dict형태로 들어가 있다.
// 그래서 res.rows[0]을 하면 { id: 1, name: '홍길동' } 첫 번째 행의 결과를 가져올 수 있다.

// 삭제
// const query = {
//     text : 'delete from member where id = $1',
//     values : [1],
// }

// client.query(query)
//     .then(((res) => {
//         console.log(res);
//         client.end();
//     }))
//     .catch((e) => { console.error(e.stack) });

const { Client } = require('pg');
require('dotenv').config();
const fs = require('fs');
const client = new Client({
    user : process.env.POSTGRES_USER,
    host : process.env.POSTGRES_HOST,
    database : 'postgres',
    password : process.env.POSTGRES_PASSWORD,
    port : process.env.POSTGRES_PORT
});


let text = null;
client.connect();
text = fs.readFileSync('./englishDict.txt', { encoding : 'utf8', flag : 'r' }).split('\r\n');

for(let i = 0; i < text.length; i++){
    let word = text[i].split("|");
    let query = {
        text : 'insert into wordlist(mid, word, mean) values($1, $2, $3)',
        values : ['manager', word[0], word[1]]
    }
    client.query(query)
        .then((res) => {

        }).catch((e) => {console.log(e.stack)})
}
// client.query(query)
//     .then((res)=>{
//         console.log(res);
//         client.end();
//     })
//     .catch((e) => {console.error(e.stack)});