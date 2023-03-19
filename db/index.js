// require and re-export all files in this db directory (users, activities...)
// const { client } = require('./client')

const {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
} = require("./users");


const {
  createActivity,
  getAllActivities,
  getActivityById,
  updateActivity,
} = require("./activities");

const {
  createRoutine,
  getRoutinesWithoutActivities,
  getRoutineById,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  updateRoutine,
  destroyRoutine,
} = require("./routines");

const {
  getRoutineActivityById,
  addActivityToRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  getRoutineActivitiesByRoutine,
} = require("./routine_activities");

module.exports = {
  ...require('./users'),
  ...require('./routines'),
  ...require('./routine_activities'),
  ...require('./activities'),
};
