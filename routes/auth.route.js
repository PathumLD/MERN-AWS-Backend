import express from 'express';
import { google, signin, signup, signout, facebook } from '../controllers/auth.controller.js';

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post('/google', google);
router.post('/facebook', facebook);
router.get('/signout', signout);
export default router;