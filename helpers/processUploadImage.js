const fs = require("fs").promises;
const path = require("path");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

const imageUploadPath = path.join(
  __dirname,
  "..",
  "uploads",
  "profilePictures"
);

const processAndSaveImage = async (imageBuffer) => {
  await fs.mkdir(imageUploadPath, { recursive: true });

  const image = sharp(imageBuffer);

  const imageMetadata = await image.metadata();

  if (imageMetadata.width > 1000) {
    image.resize(1000);
  }

  const imageFileName = `${uuidv4()}.${imageMetadata.format}`;

  await image.toFile(path.join(imageUploadPath, imageFileName));

  return imageFileName;
};

module.exports = processAndSaveImage;
