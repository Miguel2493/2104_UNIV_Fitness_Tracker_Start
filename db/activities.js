const { client } = require("./client");

async function createActivity({ name, description }) {
  try {
    const {
      rows: [activity],
    } = await client.query(
      ` INSERT INTO activities(name, description)
        VALUES($1, $2)
        ON CONFLICT (name) DO NOTHING
        RETURNING *;`,
      [name, description]
    );
    return activity;
  } catch (error) {
    throw error;
  }
}

async function getAllActivities() {
  try {
    const { rows: activities } = await client.query(`SELECT * FROM activities`);
    return activities;
  } catch (error) {
    throw error;
  }
}

async function getActivityById(id) {
  try {
    const {
      rows: [activity],
    } = await client.query(
      `SELECT * FROM activities 
       WHERE id = $1;`,
      [id]
    );
    console.log(activity, "This is line 38")
    return activity;
  } catch (error) {
    throw error;
  }
}

async function updateActivity(activityToUpdate) {

  const id = activityToUpdate.id;
  const setString = Object.keys(activityToUpdate).map(
    (key, index) => `"${key}" = $${index + 1}`
  ).join(',');

  if (setString.length === 0) {
    return;
  }

  try {

    const {
      rows: [activity],
    } = await client.query(
      `UPDATE activities 
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
      `, Object.values(activityToUpdate)
    );
    return activity;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getActivityById,
  getAllActivities,
  createActivity,
  updateActivity,
};
