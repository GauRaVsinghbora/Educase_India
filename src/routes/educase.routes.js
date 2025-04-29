import Router from "express";

import { createSchoolHandler, getSchoolsHandler, listSchoolsByProximity } from "../controllers/schoolController.js";

const router = Router();

router.post("/schools", createSchoolHandler);
router.get("/schools", getSchoolsHandler);
router.get("/listSchools", listSchoolsByProximity);

export default router;


