const getPool = require("../database/getPool");
const pool = getPool();

const selectUserById = async (userId) => {
  const [[userDB]] = await pool.query("SELECT * FROM users WHERE id = ?", [
    userId,
  ]);
  console.log(userDB);
  return userDB;
};
const updateEmail = async (email, registrationCode, id) => {
  const [{ affectedRows }] = await pool.query(
    "UPDATE users SET email = ?, registrationCode =? WHERE id = ?;",
    [email, registrationCode, id]
  );
  return affectedRows;
};

const updateUserData = async ({ name, email, password, bio, picture, id }) => {
  const [{ affectedRows }] = await pool.query(
    "UPDATE users SET name = ?, email = ?, password = ?, bio = ?, picture = ? WHERE id = ?;",
    [name, email, password, bio, picture, id]
  );

  return affectedRows;
};

const removeUser = async (user_id) => {
  const [{ affectedRows }] = await pool.query(
    "DELETE FROM users WHERE id = ?",
    [user_id]
  );

  return affectedRows;
};
module.exports = { selectUserById, updateEmail, updateUserData, removeUser };
