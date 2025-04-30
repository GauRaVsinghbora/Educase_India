import "dotenv/config";
import connectDB from "./db/index.js";
import { app } from "./app.js";
import schoolRoutes from "./routes/educase.routes.js";

const startServer = async () => {
const db = await connectDB();
app.locals.db = db;

app.use("/api/v1/", schoolRoutes);

app.listen(process.env.PORT || 8000, () => {
    console.log(`Server running on port ${process.env.PORT || 8000}`);
});
};

startServer();
