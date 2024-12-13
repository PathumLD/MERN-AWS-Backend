import express from 'express';
import { createStudent, deleteStudent, getAllStudents, getStudentById, updateStudent } from '../controllers/student.controller.js';
// import { authenticateUser } from '../utils/verifyUser.js';
import { protect } from '../middleware/authMiddleware.js';


const router = express.Router();

router.post('/post', createStudent);
router.get('/get', getAllStudents);
router.get('/getStudentById/:studentId', getStudentById);
router.put('/updateStudent/:studentId', updateStudent)
router.put('/delete/:studentId', deleteStudent)

export default router;