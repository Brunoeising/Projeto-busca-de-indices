const router = require("express").Router();
const fonteController = require("../controllers/fonteController");

router.post("/fontes", fonteController.create);
router.get("/fontes", fonteController.getAll);
router.get("/fontes/:id", fonteController.get);
router.delete("/fontes/:id", fonteController.delete);
router.put("/fontes/:id", fonteController.update);

module.exports = router;
