const fs = require("fs").promises;
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const uploadFile = async (file, folder) => {
  console.log(file, folder);
  const fileExt = path.extname(file.name);
  const fileName = `${uuidv4()}.${fileExt}`;

  const filePath = path.join(__dirname, "..", "uploads", folder);
  await fs.mkdir(filePath, { recursive: true });

  await file.mv(path.join(filePath, fileName));

  return fileName;
};

module.exports = uploadFile;
