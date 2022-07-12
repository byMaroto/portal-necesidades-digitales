const getPool = require("../database/getPool");
const pool = getPool();

const selectServiceById = async (serviceId) => {
  const [[service]] = await pool.query("SELECT * FROM services WHERE id = ?", [
    serviceId,
  ]);

  return service;
};

const insertCommentsFile = async ({
  comment,
  solvedFile,
  userId,
  serviceId,
}) => {
  const [{ insertId }] = await pool.query(
    `INSERT INTO comments (comment, solved_file, user_id, service_id) VALUES (?,?,?,?);`,
    [comment, solvedFile, userId, serviceId]
  );
  return insertId;
};

const selectCommentbyCommentId = async (commentId) => {
  const [[newCommentInfo]] = await pool.query(
    `SELECT c.*, u.name author FROM comments c LEFT JOIN users u ON c.user_id = u.id WHERE c.id=?;`,
    [commentId]
  );
  console.log("newCommentInfo: ", newCommentInfo);
  return newCommentInfo;
};

const selectServiceByServiceId = async (serviceId) => {
  const [[data]] = await pool.query(
    `SELECT S.*, u.name serviceAuthor FROM services s LEFT JOIN users u ON s.user_id = u.id WHERE s.id=?;`,
    [serviceId]
  );
  console.log(data);
  return data;
};

const selectCommentsbyServiceId = async (serviceId) => {
  const [commentsInfo] = await pool.query(
    `SELECT c.*, u.name author FROM comments c LEFT JOIN users u ON c.user_id = u.id WHERE service_id=?;`,
    [serviceId]
  );
  console.log("commentsInfo: ", commentsInfo);
  return commentsInfo;
};

module.exports = {
  selectServiceById,
  insertCommentsFile,
  selectCommentbyCommentId,
  selectServiceByServiceId,
  selectCommentsbyServiceId,
};
