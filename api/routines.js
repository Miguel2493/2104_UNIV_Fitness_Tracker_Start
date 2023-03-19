const routinesRouter = require('express').Router();

const {
    getRoutineById,
    getRoutinesWithoutActivities,
    getAllRoutines,
    getAllPublicRoutines,
    getAllRoutinesByUser,
    getPublicRoutinesByUser,
    getPublicRoutinesByActivity,
    createRoutine,
    updateRoutine,
    destroyRoutine
} = require('../db');

routinesRouter.get('/', async (req, res, next) => {
    console.log("I AM ALIVE")
    res.send(`
    <html>
    <head>
    <title>Puppies and Kittens Site</title>
    </head>
    <body>
    <h1>Puppies and Kittens Galore</h1>
    </body>
    </html>
    `)
    // try {
    //     const routines = await getAllRoutines();
    //     res.send(routines);
    // } catch (error) {
    //     next(error)
    // }
});

module.exports = routinesRouter;