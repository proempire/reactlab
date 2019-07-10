const fs = require('fs');
const path = require('path');
require('dotenv/config');
const express = require('express');
const bodyParser = require('body-parser');
const csv = require('fast-csv');
const { connectDb, models } = require('./models/index');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', process.env.PORT || 3001);

app.get('/', (req, res) => {
    res.send('Hello world!');
})

app.use((req, res, next) => {
    req.context = {
        models
    };
    next();
});

app.get('/api/grid/:timeSpan/:date', async (req, res) => {
    const { timeSpan, date } = req.params;
    // abandon underscore format, directly concatenate date and timeSpan
    const grid = await req.context.models.Grid.findById(`${date}${timeSpan}`);
    res.json(grid);
})

app.get('/api/road/:timeSpan/:date', async (req, res) => {
    const { timeSpan, date } = req.params;
    const road = await req.context.models.Road.findById(`${date}${timeSpan}`);
    res.json(road);
})

app.get('/api/grid/prediction/:timeSpan/:date', async (req, res) => {
    const { timeSpan, date } = req.params;
    const grid = await req.context.models.GridPrediction.findById(`${date}${timeSpan}`);
    res.json(grid);
})

const eraseDatabaseOnSync = true;
let num = 0;

connectDb().then(async () => {
    if (eraseDatabaseOnSync) {
        // await models.Grid.deleteMany({});
        // await models.Road.deleteMany({});
        // await models.GridPrediction.deleteMany({});
    }

    // readFiles('result/', 'Grid');
    // readFiles('roadResult1/', 'Road');
    // readFiles('GridPrediction/', 'GridPrediction');

    app.listen(app.get('port'), () => {
        console.log(`Find the server at: http://localhost:${app.get('port')}/`);
    });
});

const readFile = function (dirname, filename, modelName, objs) {
    const filePath = path.join(dirname, filename);
    const obj = new models[modelName]();
    obj.set('id', filename.replace(/-|_/g, '').split('.')[0]);
    obj.set('data', []);
    return new Promise((resolve, reject) => {
        csv
            .fromPath(filePath, { headers: true })
            .on('data', function (data) {
                // console.log(data);
                const objData = {};

                Object.keys(data).forEach(function (key) {
                    const val = data[key];

                    if (val !== '')
                        objData[key] = val;
                });

                obj.data.push(objData);
            })
            .on('end', function () {
                // concurrent save lead to etimeout, try insertMany()
                // obj.save(function (err) {
                //     if (err)
                //         console.log(err);
                // });
                objs.push(obj)
                resolve();

                num++;
                console.log(`${num} items read`);
            });
    });
};

const readFiles = function (dirname, modelName, onError) {
    fs.readdir(dirname, function (err, filenames) {
        if (err) {
            onError && onError(err);
            return;
        }
        const objs = [], readOprs = [];
        filenames.forEach(function (filename) {
            if (/\.txt$/.test(filename)) {
                readOprs.push(readFile(dirname, filename, modelName, objs));
            }
        });
        Promise.all(readOprs).then(() => {
            console.log('read finished');
            return models[modelName].insertMany(objs);
        }).then(() => {
            console.log('ok');
        }).catch((err) => {
            console.error(err);
        });
    });
};
