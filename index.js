const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 5000;
let file = null;
let fileAddr = null;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

app.post('/upload', (req, res) => {
    file = req.body.data.file;
    fileAddr = req.body.data.fileAddr;
    console.log(file);
    console.log(fileAddr);
})

app.post('/addWord', (req, res) => {
    console.log(file);
    console.log(fileAddr);
    fs.writeFile(fileAddr, req.body.data.text, 'utf8', function(err) {
        console.log('비동기적 파일 쓰기 완료');
    });
    res.send();
})

app.listen(PORT, ()=>console.log(`${PORT} Listenling!`));