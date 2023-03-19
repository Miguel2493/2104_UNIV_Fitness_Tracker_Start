// create the express server here
const express = require("express");
const cors = require('cors');
const morgan = require('morgan');

const bodyParser = require('body-parser');

const apiRouter = require('./api');
const { client } = require('./db');
const userRouter = require("./api/users");

const PORT = 3000;

const app = express();
app.use(cors());
app.use(morgan('dev'));

//const apiRouter = require("./api");
//const { client } = require("./db/client");
//client.connect();
//server.use('/api', apiRouter);


app.use(bodyParser.json());



app.use((req, res, next) => {
    console.log("Body is now - This is line 26", req.body);
    // res.send("This is main")
    next();
})

app.use('/api', apiRouter);
app.use('/api', userRouter);
// app.get('/health', function (req, res, next) {
//     res.json({ msg: 'This is CORS-enabled for all origins!' })
// });

// server.get('/', async (req, res) => {
//     console.log('/ route requested')
//     res.send("hello world")
// })

// server.listen(PORT, () => {
//     console.log("The server is up on port", PORT);
// });

// app.use((error, req, res, next) => {
//     res.send(error)
// });



app.listen(PORT, async () => {
    try {
        await client.connect();
        console.log('connected to db');
        console.log('The server is up and running on', PORT)

    } catch (error) {
        console.error(error)

    }
});
