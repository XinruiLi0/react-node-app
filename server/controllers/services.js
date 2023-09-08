var express = require("express");
var router = express.Router();

// ------------------------------ Pages Configuration ------------------------------

router.get("/services", (req, res) => {
    /* New services page */
    res.render("pages-new/services");
});

router.get("/findadentist", (req, res) => {
    //Christina&Sanika
    res.render("pages/findadentist");
});

router.get("/emergency-locations", async (req, res) => {
    /* New emergency location */
    res.render("pages-new/emergency-locations");
});

// ------------------------------ APIs Configuration ------------------------------

module.exports = router;