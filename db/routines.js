const { getActivityById } = require("./activities");
const { client } = require("./client");
const { getRoutineActivitiesByRoutine } = require("./routine_activities");

const { getUserByUsername, getUserById } = require("./users");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
      INSERT INTO routines("creatorId", "isPublic", name, goal)
      VALUES($1, $2, $3, $4)
      ON CONFLICT (name) DO NOTHING
      RETURNING *;    
      `,
      [creatorId, isPublic, name, goal]
    );

    return routine;
  } catch (error) {
    throw error;
  }
}

async function getRoutineById(id) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
        SELECT * from routines
        WHERE id = $1;
        `,
      [id]
    );
    console.log(routine, "This is line 38")
    return routine;
  } catch (error) { }
}

async function getRoutinesWithoutActivities() {
  try {
    const { rows: routines } = await client.query(`
    SELECT * FROM routines;  
    `);
    return routines;
  } catch (error) {
    throw error;
  }
}

async function addActivitytoRoutines(routines) {

  try {
    for (const routine of routines) {
      const { username } = await getUserById(routine.creatorId);
      console.log(username, routine.creatorId, "This is line 59")
      const creatorId = routine.creatorId;
      const routineId = routine.id;
      console.log(creatorId, routineId, "This is line 62 - creatorId/routineID")
      routine.creatorName = username;
      routine.activities = [];

      console.log(routine, "This is the routine passed into getRoutineActivitiesbyRoutine")

      const activityIds = await getRoutineActivitiesByRoutine(routine);
      console.log(activityIds, "These are the activityId's, line 67");

      for (const activity of activityIds) {
        const { activityId } = activity;
        console.log(activityId, "This is the activityId, line 73");
        const fetchedActivity = await getActivityById(activityId);
        console.log(fetchedActivity, "This is line 77 - fetchedActivity")

        const { rows: [{ duration, count }] } = await client.query(`
        SELECT duration, count from routine_activities
        WHERE "routineId"=${routineId} and "activityId"=${activityId}`);

        console.log(activityId, "This is line 77 - ActivityId")

        fetchedActivity.duration = duration;
        fetchedActivity.count = count;
        routine.activities.push(fetchedActivity);
      }
      console.log(routines, "This is line 76 ")
      return routines;
    };
  } catch (error) {
    throw error;
  }
}

async function getAllRoutines() {

  try {
    const { rows: routines } = await client.query(
      `SELECT * FROM routines;`);
    console.log("This is line 90", routines);

    const routinesWithData = await addActivitytoRoutines(routines);
    console.log(routinesWithData, "this is line 93")
    return routinesWithData;
  } catch (error) { }
}

async function getAllPublicRoutines() {
  try {
    const { rows: routines } = await client.query(`
    SELECT * FROM routines
    WHERE "isPublic" = true;   
    `);
    const updatedRoutines = await addActivitytoRoutines(routines)
    console.log(updatedRoutines, "This is line 115,the public routines w/Activities")
    return updatedRoutines;
  } catch (error) { }
}

async function getAllRoutinesByUser({ id }) {
  try {

    const { rows: routines } = await client.query(`
    SELECT * from routines
    WHERE "creatorId"=${id}`);

    const updatedRoutines = await addActivitytoRoutines(routines)

    console.log(updatedRoutines, "the user list of routines - line 129");

    return updatedRoutines;
  } catch (error) { }
}

async function getPublicRoutinesByUser({ id }) {
  try {
    const { rows: routines } = await client.query(`
    SELECT * from routines
    WHERE "creatorId"=${id}
    and "isPublic"=true;`);

    console.log(routines, "This is line 142")

    const updatedPublicRoutines = await addActivitytoRoutines(routines);

    console.log(updatedPublicRoutines, "This is line 146");


    return updatedPublicRoutines;
  } catch (error) { }
}

async function getPublicRoutinesByActivity({ id }) {
  try {
    const { rows: routineId } = await client.query(`
    SELECT * from routine_activities
    WHERE "activityId"=${id};`)

    console.log(id, "This is the passed in ActivityId", routineId, "This is the routineId selected - line 159")

    const routineIdArray = routineId.map((routine) => routine.routineId);

    console.log(routineIdArray, "This is the routineArrayWithACt ID - This is line 163")

    const { rows: routines } = await client.query(`
    SELECT * from routines
    WHERE id IN (${routineIdArray})
    AND "isPublic" = true;`)

    console.log(routines, "This is the public routine - Line 170")

    const routinesReturnedWithData = await addActivitytoRoutines(routines)

    console.log(routinesReturnedWithData, "This is the routines returned w/Activity by ACt ID line 174")
    return routinesReturnedWithData;
  } catch (error) { }
}

async function updateRoutine(routineToUpdate) {

  const { id } = routineToUpdate;
  console.log(id, "Routine to update -- line 182")

  const setString = Object.keys(routineToUpdate).map(
    (key, index) => `"${key}" = $${index + 1}`
  ).join(',');

  console.log(setString, "This is line 188")

  if (setString.length === 0) {
    return;
  }

  try {
    const {
      rows: [activity],
    } = await client.query(
      `UPDATE routines 
       SET ${setString}
       WHERE id = ${id}
       RETURNING *;`,
      Object.values(routineToUpdate)
    );

    console.log(activity, "This is line 202")

    return activity;
  } catch (error) {
    throw error;
  }
}

async function destroyRoutine(id) {
  try {
    await client.query(
      `
        DELETE from routine_activities
        where "routineId" = $1        
        `,
      [id]
    );

    await client.query(
      `
        DELETE FROM routines
        WHERE id = $1;
        `,
      [id]
    );
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
