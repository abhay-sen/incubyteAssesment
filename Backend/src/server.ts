import app from "./app";
import connectDB from "./config/db";

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "test") {
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch((err: Error) => {
      console.error("Failed to connect DB", err);
      process.exit(1);
    });
}
