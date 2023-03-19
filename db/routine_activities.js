const { client } = require("./client");

async function getRoutineActivityById(id) {
  try {
    const {
      rows: [routineActivity],
    } = await client.query(
      `SELECT * FROM routine_activities
        WHERE "routineId" =${id}`
    );
    console.log(routineActivity, "This is line 12")
    return routineActivity;
  } catch (error) {
    throw error;
  }
}

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {
    const {
      rows: [routineActivity],
    } = await client.query(
      `INSERT INTO routine_activities("routineId", "activityId", count, duration)
        VALUES($1, $2, $3, $4)
        RETURNING *;`,
      [routineId, activityId, count, duration]
    );

    return routineActivity;
  } catch (error) {
    throw error;
  }
}

async function updateRoutineActivity(routineActivityToUpdate) {
  console.log(routineActivityToUpdate, "This is the data to update count/duration - line 42")

  const id = routineActivityToUpdate.id;
  const setString = Object.keys(routineActivityToUpdate).map(
    (key, index) => `"${key}" = $${index + 1}`
  ).join(',');

  if (setString.length === 0) {
    return;
  }
  console.log(setString, "This is the setString - line 51")

  try {
    const {
      rows: [routine],
    } = await client.query(
      `UPDATE routine_activities
        SET ${setString}
        WHERE id = ${id}
        RETURNING *;`, Object.values(routineActivityToUpdate)
    );
    console.log(routine, "This is line 62 - suppopsed to update routine Activity");
    return routine;
  } catch (error) {
    throw error;
  }
}

async function destroyRoutineActivity(id) {
  console.log(id, "This is the routine Activity to Delete")

  try {
    const {
      rows: [routineActivityDeleted],
    } = await client.query(
      `DELETE FROM routine_activities
       WHERE id = ${id}
       Returning *`,
    );
    console.log(routineActivityDeleted, "Deleted Routine Activity")
    return routineActivityDeleted;
  } catch (error) {
    throw error;
  }
}

async function getRoutineActivitiesByRoutine({ id: routineId }) {
  try {
    const { rows } = await client.query(
      `SELECT "activityId" FROM routine_activities
        WHERE "routineId" = ${routineId};`
    );
    // console.log(routineActivity.id, "This is line id - 79", routineActivity.duration, "This is actitivityID")

    // const returnedRoutineActivityId = routineActivity.id;
    // console.log(returnedRoutineActivityId, "This is line id - 82", routineActivity.duration, "This is actitivityID")

    console.log(rows, "This is line 84 - rows")
    return rows;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  getRoutineActivitiesByRoutine,
};
