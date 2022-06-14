require("dotenv").config();
const getPool = require("./getPool");

const populateDB = async () => {
  try {
    const pool = getPool();

    console.log("Adding new data...");

    await pool.query(
      `INSERT INTO users (name, email, password, bio, picture, registrationCode) VALUES 
        ("Pepe", "pepe@outlook.com", "akjd-agA", "Front end developer", "profile_picture.png", "-"), 
        ("Juan", "juan@gmail.com", "aAGPOE92", "Back end developer", "pictureprofile.com", "-");`
    );

    await pool.query(
      `INSERT INTO services (user_id, title, description, service_file, status) VALUES 
        (1, "New web", "I need a new web for my company", "service.pdf", false), 
        (2, "Text transcription", "I need to transcribe an interview", "interview.mp3", false);`
    );

    await pool.query(
      `INSERT INTO comments (comment, solved_file, user_id, service_id) VALUES 
        ("Web done", "web_finished.pdf", 2, 1), 
        ("Transcription done", "interview_transcription.pdf", 1, 2);`
    );

    console.log("Data added!");
  } catch (error) {
    console.error(error);
  } finally {
    process.exit();
  }
};

populateDB();
