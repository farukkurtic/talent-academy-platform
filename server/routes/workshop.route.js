const express = require('express');
const { workshopController } = require('../controllers');
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.get('/:workshopId', workshopController.getWorkshop);
router.post('/', upload.single("coverImage"), workshopController.createWorkshop);
router.get('/', workshopController.getAllWorkshops);
router.get('/:createdBy', workshopController.getAllUserWorkshops);
router.delete('/:workshopId', workshopController.deleteWorkshop);
router.put('/', upload.single("coverImage"), workshopController.updateWorkshop);
router.post('/:workshopId/attend', workshopController.attendWorkshop);

module.exports = router;