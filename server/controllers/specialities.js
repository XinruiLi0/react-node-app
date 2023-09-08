var express = require("express");
var router = express.Router();

// ------------------------------ Pages Configuration ------------------------------

router.get("/specialities", (req, res) => {
    res.render("pages-new/specialities");
});

// ------------------------------ APIs Configuration ------------------------------


module.exports = router;