var express = require("express");
var router = express.Router();
var mysql = require("../models/dbConnection");

var sql = "";

// ------------------------------ Pages Configuration ------------------------------

router.get("/labtest", (req, res) => {
    //Christina&Sanika
    res.render("pages/labtest");
});

router.get("/labapp", (req, res) => {
    //Christina&Sanika
    res.render("pages/labapp");
});

router.get("/vitaminform", (req, res) => {
    //Christina&Sanika
    res.render("pages/vitaminform");
});

router.get("/lipidform", (req, res) => {
    //Christina&Sanika
    res.render("pages/lipidform");
});

router.get("/uform", (req, res) => {
    //Christina&Sanika
    res.render("pages/uform");
});

router.get("/bmpform", (req, res) => {
    //Christina&Sanika
    res.render("pages/bmpform");
});

router.get("/cmpform", (req, res) => {
    //Christina&Sanika
    res.render("pages/cmpform");
});

router.get("/cbcform", (req, res) => {
    //Christina&Sanika
    res.render("pages/cbcform");
});

router.get("/thyroidform", (req, res) => {
    //Christina&Sanika
    res.render("pages/thyroidform");
});

// ------------------------------ APIs Configuration ------------------------------

/* LAB TEST APPOINTMENT FORM, backend api code started for adding route to register (Team-member1-Christina, Team-member2-Sanika), BMG5109H, 2nd term-1stYear */
// Get a list of available labs
router.get("/get_availableLabs", (req, res) => {
    sql = "SELECT Lab_Name, Email_Id, Location1, Location2, PostalCode, City, Province, Country, uuid FROM lab_admin WHERE verification = 1 ORDER BY Lab_Name";
    let sqlDB = mysql.connect();
    sqlDB.query(sql, (error, result) => {
        if (error) {
            res.send({ error: "Something wrong in MySQL." });
            console.log(error);
            return;
        }
        res.send(result);
    });
    sqlDB.end();
});

// Get the appointment schedule of the specific lab
router.post("/get_appointmentList", (req, res) => {
    const uuid = req.body.id;

    if (!uuid) {
        res.send({ error: "Missing lab uuid." });
        return;
    }

    let today = new Date();
    const offset = today.getTimezoneOffset();
    today = new Date(today.getTime() - offset * 60 * 1000);

    let sqlDB = mysql.connect();
    sql = `SELECT appointmentDate, slot
    FROM lab_admin join lab_appointment ON lab_admin.id = lab_appointment.lab_id
    WHERE lab_admin.uuid = "${uuid}" AND appointmentDate = "${today.toISOString().slice(0, 10)}";`;
    console.log(sql);
    sqlDB.query(sql, (error, result) => {
        if (error) {
            res.send({ error: "Something wrong in MySQL." });
            console.log(error);
            return;
        }
        res.send(result);
    });
    sqlDB.end();
});

// Get the appointment schedule of the specific lab
router.post("/update_appointment", (req, res) => {
    const lab_uuid = req.body.lab_id;
    const uuid = req.body.id;
    const password = req.body.password;
    const date = req.body.date;
    const slot = req.body.slot;
    console.log(uuid);
    console.log(password);
    console.log(date);
    console.log(slot);

    if (!lab_uuid || !uuid || !password) {
        res.send({ error: "Missing lab uuid, patient uuid, or patient password." });
        return;
    }
    if (!date || !slot) {
        res.send({ error: "Missing appointment date or slot." });
        return;
    }

    let sqlDB = mysql.connect();
    sql = "SELECT * FROM `patients_registration` WHERE uuid = ? AND verification = ?";
    console.log(sql);
    sqlDB.query(sql, [uuid, true], (error, result) => {
        if (error) {
            res.send({ error: "Something wrong in MySQL." });
            console.log(error);
            return;
        }
        if (result.length == 0) {
            res.send({
                error: "Either ID or Password is wrong or your account is not verified. Please Check.",
            });
            return;
        } else {
            if (result[0].uuid === uuid && result[0].password === password) {
                // Correct patients
                const patient_id = result[0].id;
                sql = `SELECT id FROM lab_admin WHERE uuid = "${lab_uuid}" AND verification = true`;
                let sqlDB = mysql.connect();
                sqlDB.query(sql, (error, result) => {
                    if (error) {
                        res.send({ error: "Something wrong in MySQL." });
                        console.log(error);
                        return;
                    }
                    if (result.length == 0) {
                        res.send({ error: "No valid lab match in the database." });
                        return;
                    } else {
                        sql = `INSERT INTO lab_appointment (lab_id, patient_id, appointmentDate, slot)  VALUES (${result[0].id}, ${patient_id}, "${date}", ${slot})`;
                        let sqlDB = mysql.connect();
                        sqlDB.query(sql, (error, result) => {
                            if (error) {
                                res.send({ error: "Something wrong in MySQL." });
                                console.log(error);
                                return;
                            }
                            if (result.affectedRows == 1) {
                                res.send({ success: "Appointment scheduled." });
                            } else {
                                res.send({ error: "Something goes wrong in the database." });
                            }
                        });
                        sqlDB.end();
                    }
                });
                sqlDB.end();
            } else {
                res.send({
                    error: "Either ID or Password is wrong or your account is not verified. Please Check.",
                });
                return;
            }
        }
    });
    sqlDB.end();
});
/* LAB TEST APPOINTMENT FORM, backend api code ended for adding route to register (Team-member1-Christina, Team-member2-Sanika), BMG5109H, 2nd term-1stYear */

// Get the appointment list and the lab info for the specific patient
router.post("/check_patientAppointment", (req, res) => {
    const uuid = req.body.id;

    if (!uuid) {
        res.send({ error: "Missing patient uuid." });
        return;
    }

    let today = new Date();
    const offset = today.getTimezoneOffset();
    today = new Date(today.getTime() - offset * 60 * 1000);

    let sqlDB = mysql.connect();
    sql = `SELECT lab_admin.Lab_Name, lab_admin.Email_Id, lab_admin.Location1, lab_admin.Location2, lab_admin.City, lab_admin.Province, lab_admin.Country, appointmentDate, slot
    FROM lab_admin JOIN lab_appointment JOIN patients_registration 
    ON lab_admin.id = lab_appointment.lab_id AND patients_registration.id = lab_appointment.patient_id
    WHERE patients_registration.uuid = "${uuid}" AND appointmentDate = "${today.toISOString().slice(0, 10)}";`;
    console.log(sql);
    sqlDB.query(sql, (error, result) => {
        if (error) {
            res.send({ error: "Something wrong in MySQL." });
            console.log(error);
            return;
        }
        res.send(result);
    });
    sqlDB.end();
});

// Get the appointment list and the patient info for the specific lab
router.post("/check_labAppointment", (req, res) => {
    const uuid = req.body.id;

    if (!uuid) {
        res.send({ error: "Missing lab uuid." });
        return;
    }

    let today = new Date();
    const offset = today.getTimezoneOffset();
    today = new Date(today.getTime() - offset * 60 * 1000);

    let sqlDB = mysql.connect();
    sql = `SELECT patients_registration.FName, patients_registration.MName, patients_registration.LName, patients_registration.MobileNumber, appointmentDate, slot
    FROM lab_admin JOIN lab_appointment JOIN patients_registration 
    ON lab_admin.id = lab_appointment.lab_id AND patients_registration.id = lab_appointment.patient_id
    WHERE lab_admin.uuid = "${uuid}" AND appointmentDate = "${today.toISOString().slice(0, 10)}";`;
    console.log(sql);
    sqlDB.query(sql, (error, result) => {
        if (error) {
            res.send({ error: "Something wrong in MySQL." });
            console.log(error);
            return;
        }
        res.send(result);
    });
    sqlDB.end();
});

module.exports = router;