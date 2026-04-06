const app = require("./src/app");
const initializeDatabase = require("./src/db/init");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    }).on("error", (err) => {
      console.error("Server failed to start:", err.message);
    });
  } catch (error) {
    console.error("Database initialization failed:", error.message);
    process.exit(1);
  }
};

startServer();
