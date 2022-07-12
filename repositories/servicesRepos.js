const getPool = require("../database/getPool");
const pool = getPool();

const selectServices = async () => {
  const [services] = await pool.query(
    `SELECT s.*, u.name serviceAuthor from services s LEFT JOIN users u ON s.user_id=u.id`
  );
  return services;
};

const insertNewService = async ({ userId, title, description, fileName }) => {
  const [{ insertId }] = await pool.query(
    `INSERT INTO services (user_id, title, description, service_file) VALUES (?,?,?,?)`,
    [userId, title, description, fileName]
  );
  return insertId;
};

const selectServiceByServiceId = async (serviceId) => {
  const [[data]] = await pool.query(
    `SELECT S.*, u.name serviceAuthor FROM services s LEFT JOIN users u ON s.user_id = u.id WHERE s.id=?;`,
    [serviceId]
  );
  console.log(data);
  return data;
};

const updateServiceStatus = async (serviceId, userId) => {
  const [{ affectedRows }] = await pool.query(
    `UPDATE services SET status=1 WHERE id=? AND user_id=?;`,
    [serviceId, userId]
  );
  console.log(affectedRows);
  return affectedRows;
};

const selectServicesByUserId = async (userId) => {
  const [services] = await pool.query(
    `SELECT s.*, u.name serviceAuthor from services s LEFT JOIN users u ON s.user_id=u.id WHERE u.id=?`,
    [userId]
  );
  console.log(services);
  return services;
};

module.exports = {
  selectServices,
  insertNewService,
  updateServiceStatus,
  selectServiceByServiceId,
  selectServicesByUserId,
};
