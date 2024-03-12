const express = require("express");

const {
    moveandgetlocation,
    getlocationplaceId,
    getlocationplaceName,
    getDirectionFromTo
}=require('../services/mapServices');

const router = express.Router();

router.route("/move").get(moveandgetlocation);
router.route("/placeid").get(getlocationplaceId);
router.route("/nameplace").get(getlocationplaceName);
router.route("/direction").get(getDirectionFromTo);

module.exports = router;