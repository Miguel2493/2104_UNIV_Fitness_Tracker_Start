// // create an api router
const express = require('express');
const apiRouter = express.Router();
require('dotenv').config();

// const { encodedData, decodedData } = require('./jwt');

// encodedData('original message');
const usersRouter = require('./users');
apiRouter.use("/users", usersRouter);
// // attach other routers from files in this api directory (users, activities...)
// // export the api router

// apiRouter.get('/health', (req, res) => {
//     res.send({ message: "App Health is up and running" })
// });
// apiRouter.use((req, res, next) => {
//     console.log(req.originalUrl);
//     next();
// })
apiRouter.get('/health', function (req, res, send) {
    res.send({ message: "This app is up and running, wee woo!! - This is line 20" })
});

// apiRouter.post('/sayHello', (req, res, next) => {
//     res.send({ message: "Hello im ALIVE" })
// });

// apiRouter.get('/', async (req, res) => {
//     console.log('/ route requested')
//     res.send("hello world")
// })
//apiRouter.use('/routines', routinesRouter);
apiRouter.use('/userRouter', usersRouter);


apiRouter.use((error, req, res, next) => {
    res.send(error);
});

module.exports = apiRouter;
