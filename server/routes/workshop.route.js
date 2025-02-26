const express = require('express');
const { workshopController } = require('../controllers')

const router = express.Router();

router.get('/:workshopId', workshopController.getWorkshop);
router.post('/', workshopController.createWorkshop);
router.get('/', workshopController.getAllWorkshops)
router.get('/user/:createdBy', workshopController.getAllUserWorkshops)
router.delete('/:workshopId', workshopController.deleteWorkshop);
router.put('/', workshopController.updateWorkshop);


module.exports = router;
