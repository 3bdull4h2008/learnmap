import express from 'express';
import {
  getUniversities,
  getUniversity,
  getUniversityMatcher,
  getFields,
  getCities,
  getGroupedMajors,
  getAllMajorsList
} from '../controllers/universityController.js';
import {
  validateUniversityQuery,
  validateMatch,
  validateUniversityId
} from '../middleware/validate.js';

const router = express.Router();

router.get('/', validateUniversityQuery, getUniversities);
router.get('/fields', getFields);
router.get('/cities', getCities);
router.get('/majors/grouped', getGroupedMajors);
router.get('/majors/all', getAllMajorsList);
router.post('/match', validateMatch, getUniversityMatcher);
router.get('/:id', validateUniversityId, getUniversity);

export default router;
