const express = require('express'); 
const pug = require('pug');
const bodyParser = require("body-parser");
const fs = require('fs');
const crypto = require('crypto');

const settings = require('./settings');

const app = express(); 
const port = 3000; //определили порт для соединения с приложением
const host = 'localhost'; 

// парсер для данных формы application/x-www-form-urlencoded
const urlencodedParser = bodyParser.urlencoded();

function sussions(url){
    
}

app.get('/', (req, res) => { // запрос email    
    const compiledFunction = pug.compileFile(settings.dirs.TEMPLATES + 'index.pug');
    const resp = compiledFunction();
    res.send(resp);
}); 

app.post('/', urlencodedParser, (req, res) => {
    //получим значение email  из тела запроса
    const email = req.body.email;
    //выведем в лог
    console.log(email);
    //сгенерируем имя файла
    const hash_id = crypto.createHash('md5').update(email).digest('hex');
    const fn = hash_id + '.dat';
    const fn_path = settings.dirs.BASE + 'data/' + fn; //полный путь
    if (fs.existsSync(fn_path)){
        //если файл создан, значит это не первый заход на сайт
        //прочитаем данные из файла
        data = JSON.parse( fs.readFileSync(fn_path) );
        if (!data.complete){
            //перенаправим на текущию страницу
            res.redirect('/quest' + (data.current + 1));
        } else {
            //или на страницу с результатами
            res.redirect('/results');
        }        
        return;
    }
    data = {email: email, //емайл пользователя
            answers: [false, false, false, false, false, false, false, false, false, false], //правильность ответов
            current: 0, //текущий вопрос
            complete: 0, //признак завершенности
            summary: 0 //количество верных ответов
        };    
    fs.writeFileSync(fn_path, JSON.stringify(data), {flag: 'w'});
    res.redirect('/quest1');
})

app.get('/quest:num', (req, res) => { //     
    let num = parseInt(req.params.num); //приведем к целому
    num = num <= 10 && num >=1 ? num : 1; //ограничим от 1 до 10
    const compiledFunction = pug.compileFile(`${settings.dirs.TEMPLATES}quest_${num}.pug`);
    const resp = compiledFunction();
    res.send(resp);
}); 

// запускаем сервер на прослушивание порта
app.listen(port, host, () => { 
    //Выводим в консоле сообщение о запуске сервера
    console.log(`Сервер запущен по адресу http://${host}:${port}/`); 
});

