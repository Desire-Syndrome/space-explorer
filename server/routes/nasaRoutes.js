const router = require('express').Router();

const { 
	getEPIC, getAPOD, getRovers, getMaxSol, getEpicLatestDate
} = require('../controllers/nasaController.js');


router.get("/epic", getEPIC); 
router.get("/epic/latest-date", getEpicLatestDate);
router.get("/apod", getAPOD);
router.get("/rovers", getRovers);
router.get("/rovers/max-sol", getMaxSol); 


module.exports = router;