const router = require("express").Router();
const valueindiController = require("../controllers/valueindiController");

router.post("/valueindices", valueindiController.create);
router.get('/valueindices/latest', valueindiController.getLatestByFonteId);
router.get('/last-updated', valueindiController.getLastUpdated);
router.get('/valueindices/fonte/:fonteId', valueindiController.getByFonteId);
router.get("/valueindices/:id", valueindiController.get);
router.delete("/valueindices/:id", valueindiController.delete);
router.delete("/valueindices", valueindiController.deleteAll); 
router.put("/valueindices/:id", valueindiController.update);

module.exports = router;
