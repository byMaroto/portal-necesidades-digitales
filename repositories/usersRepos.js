const getPool = require("../database/getPool");
const pool = getPool();

const selectUserByEmail = async (email) => {
  const [[user]] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);

  return user;
};

const insertUser = async ({
  name,
  email,
  encryptedPassword,
  bio,
  pictureName,
  registrationCode,
}) => {
  const [{ insertId }] = await pool.query(
    "INSERT INTO users (name, email, password, bio, picture, registrationCode) VALUES (?, ?, ?, ?, ?, ?)",
    [name, email, encryptedPassword, bio, pictureName, registrationCode]
  );
  return insertId;
};

const selectUserByActivationCode = async (registrationCode) => {
  const [[user]] = await pool.query(
    "SELECT * FROM users WHERE registrationCode = ?",
    [registrationCode]
  );

  return user;
};

const deleteRegistrationCode = async (userId) => {
  const pool = getPool();

  const [{ affectedRows }] = await pool.query(
    "UPDATE users SET registrationCode = NULL WHERE id = ?",
    [userId]
  );

  return affectedRows;
};

const selectUserInfoById = async (userId) => {
  const [[data]] = await pool.query(`SELECT * FROM users WHERE id=?;`, [
    userId,
  ]);
  console.log(data);
  return data;
};

module.exports = {
  selectUserByEmail,
  insertUser,
  selectUserByActivationCode,
  deleteRegistrationCode,
  selectUserInfoById,
};
