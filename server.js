require('dotenv/config');
const express = require('express');
const bodyParser = require('body-parser');
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

connectDb().then(async () => {
    app.listen(app.get('port'), () => {
        console.log(`Find the server at: http://localhost:${app.get('port')}/`);
    });
});
