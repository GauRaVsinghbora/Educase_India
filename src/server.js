import connectDB from "./db/index.js";
import "dotenv/config";
import { app } from "./app.js";

connectDB()
    .then((connection) => {
        app.locals.db = connection; 

        app.on("error", (error) => {
        console.log("Server error:", error);
        });

        app.listen(process.env.PORT || 8000, () => {
        console.log(`📡 Server running at port ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.log("MySQL connection failed ", error);
    });
