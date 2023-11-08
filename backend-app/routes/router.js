const router = require("express").Router();

const valueindicesRouter = require("./valueindices");
const fonteRouter = require("./fontes");
const movideskRouter = require("./movidesk");
const capacityRouter = require("./capacity");

router.use("/", valueindicesRouter);
router.use("/", fonteRouter);
router.use("/", capacityRouter)
router.use("/movidesk", movideskRouter);


module.exports = router;
