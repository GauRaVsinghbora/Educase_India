import express from 'express';
import { addSchool, listSchoolsByProximity} from '../controllers/schoolController.js';

const router = express.Router();

router.post('/addSchool', addSchool);
router.get('/listSchools',listSchoolsByProximity)

export default router;
