const getPool = require("../database/getPool");
const pool = getPool();

const selectServices = async () => {
  const [services] = await pool.query(`SELECT * from services`);
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
  const [[algo]] = await pool.query(`SELECT * FROM services WHERE id=?`, [
    serviceId,
  ]);
  console.log(algo);
  return algo;
};

const updateServiceStatus = async (serviceId, userId) => {
  const [{ affectedRows }] = await pool.query(
    `UPDATE services SET status=1 WHERE id=? AND user_id=?;`,
    [serviceId, userId]
  );
  console.log(affectedRows);
  return affectedRows;
};
module.exports = {
  selectServices,
  insertNewService,
  selectServiceByServiceId,
  updateServiceStatus,
};
