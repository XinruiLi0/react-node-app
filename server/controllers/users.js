var express = require("express");
var router = express.Router();
var mysql = require("../models/dbConnection");
var models = require('../models/commonMethod');
var nodemailer = require("nodemailer");
var crypto = require("crypto");

var sql = "";

// ------------------------------ Pages Configuration ------------------------------

router.get("/Login", (req, res) => {
    errorMessage = "";
    res.render("pages/logina8b9", {
        error: errorMessage,
    });
});

router.get("/register", (req, res) => {
    /* New register page*/
    res.render("pages-new/register");
});

router.get("/signin", (req, res) => {
    /* New signin page*/
    res.render("pages-new/signin");
});

router.get("/doctorpasswordchange", (req, res) => {
    errorMessage = "";
    res.render("pages/doctorpasswordchange");
});

router.get("/patientLogin", (req, res) => {
    errorMessage = "";
    res.render("pages/patientLogin", {
        error: errorMessage,
    });
});

router.get("/doctorLogin", (req, res) => {
    errorMessage = "";
    res.render("pages/doctorLogin", {
        error: errorMessage,
    });
});

router.get("/hospitalLogin", (req, res) => {
    errorMessage = "";
    res.render("pages/hospitalLogin", {
        error: errorMessage,
    });
});

router.get("/create-account", (req, res) => {
    res.render("pages/create-account");
});

router.get("/patientRegister", (req, res) => {
    res.render("pages/patient");
});

router.get("/DoctorRegister", (req, res) => {
    res.render("pages/doctorRegister");
});

router.get("/hospital", (req, res) => {
    res.render("pages/hospital");
});

router.get("/lab", (req, res) => {
    res.render("pages/lab");
});

router.get("/HealthCare_DashBoard", (req, res) => {
    res.render("pages/Dashboard/HealthCare_DashBoard");
});

router.get("/patientpasswordchange", (req, res) => {
    errorMessage = "";
    res.render("pages/doctorpasswordchange");
});
router.get("/hospitalpasswordchange", (req, res) => {
    errorMessage = "";
    res.render("pages/hospitalpasswordchange");
});
router.get("/passwordresetmessage", (req, res) => {
    errorMessage = "";
    res.render("pages/passwordresetmessage");
});

// ------------------------------ APIs Configuration ------------------------------

router.post("/passwordreset", (req, res) => {
    // Check the user cookies
    const cookie = req.cookies["e-hospital"];
    if (cookie == null) {
        console.log("Cookie expired.");
        res.redirect("signin");
    }
    // Refresh the valid time
    res.cookie("e-hospital", cookie, {
        maxAge: 10 * 60 * 1000,
        httpOnly: true,
        overwrite: true,
        sameSite: "lax",
    });

    const newpassword = req.body.newpassword;
    const oldpassword = req.body.oldpassword;

    if (cookie.account_type == 1) {
        sql = "UPDATE patients_registration SET password = ? WHERE password = ? AND id = ?";
    } else if (cookie.account_type == 2) {
        sql = "UPDATE doctors_registration SET password = ? WHERE password = ? AND id = ?";
    } else if (cookie.account_type == 3) {
        sql = "UPDATE hospital_admin SET password = ? WHERE password = ? AND id = ?";
    }

    let sqlDB = mysql.connect();
    sqlDB.query(sql, [newpassword, oldpassword, cookie.id], (error, result) => {
        res.render("pages/passwordresetmessage");
    });
    sqlDB.end();
});

router.get("/logout", (req, res) => {
    const cookie = req.cookies["e-hospital"];
    // Set the valid time to zero
    res.cookie("e-hospital", null, {
        maxAge: 0,
        httpOnly: true,
        overwrite: true,
        sameSite: "lax",
    });

    res.redirect("signin");
});

router.post("/Hospital_DashBoard", (req, res) => {
    // For the Admin Credentials:  (Admin , Admin)
    const uuid = req.body.email;
    const password = req.body.password;

    let sqlDB = mysql.connect();
    sql = "SELECT * FROM `hospital_admin` WHERE uuid = ? AND verification = ?";
    sqlDB.query(sql, [uuid, true], (error, result) => {
        if (result.length == 0) {
            var errorMessage = "Either ID or Password is wrong or your account is not verified. Please Check";
            // res.render('pages/hospitalLogin', {
            res.render("pages-new/signin", {
                // New login page

                error: errorMessage,
            });
        } else {
            var hospital_data = result[0];
            if (error) {
                var errorMessage = "Issue with initiating a request. Check the credentials . Please Try again Later";
                console.log(errorMessage);
                res.redirect("signin");
            }
            if (result[0].uuid === uuid && result[0].password === password) {
                // Attach cookie in response
                res.cookie(
                    "e-hospital",
                    { id: result[0].id, account_type: 2 },
                    {
                        // the account type 3 represent the hospital
                        maxAge: 10 * 60 * 1000, // expired in 10 minutes
                        // secure: true,
                        httpOnly: true,
                        overwrite: true,
                        sameSite: "lax",
                    }
                );
                var patients_data;
                var doctors_data;
                sql = "SELECT * FROM `doctors_registration` WHERE 1";
                let sqlDB = mysql.connect();
                sqlDB.query(sql, (error, result) => {
                    if (error) throw error;
                    doctors_data = result;
                    sql = "SELECT * FROM `patients_registration` WHERE 1";
                    let sqlDB = mysql.connect();
                    sqlDB.query(sql, (error, result) => {
                        patients_data = result;

                        if (error) throw error;
                        res.render("pages/Dashboard/HospitalDashBoard", {
                            patients: patients_data,
                            doctors: doctors_data,
                            hospital: hospital_data,
                        });
                    });
                    sqlDB.end();
                });
                sqlDB.end();
            } else {
                var errorMessage = "Either ID or Password is wrong or your account is not verified. Please Check";
                res.render("pages/hospitalLogin", {
                    error: errorMessage,
                });
            }
        }
    });
    sqlDB.end();
});

router.post("/DoctorDashBoard", async (req, res) => {
    const uuid = req.body.email;
    const password = req.body.password;

    // Check parameters
    if (!uuid || !password) {
        res.send({ error: "Missing doctor credential." });
        return;
    }

    // Check Doctor's credentials
    sql = `SELECT * FROM doctors_registration WHERE uuid = "${uuid}" AND password = "${password}" AND verification = true`;

    try {
        result = await mysql.query(sql);
    } catch (error) {
        console.log(error);
        res.render("pages-new/signin", {
            // New login page
            error: "Something wrong in MySQL.",
        });
        return;
    }

    if (result.length == 0) {
        res.render("pages-new/signin", {
            // New login page
            error: "Either ID or Password is wrong or your account is not verified. Please Check.",
        });
        return;
    }

    // Get authorized patients
    let id = result[0].id;
    let doctors_data = models.removeKey(result, "id")[0];
    sql = `SELECT *
      FROM doctor_recordauthorized join patients_registration ON doctor_recordauthorized.patient_id = patients_registration.id
      WHERE doctor_id = ${id}`;

    try {
        result = await mysql.query(sql);
    } catch (error) {
        console.log(error);
        res.render("pages-new/signin", {
            // New login page
            error: "Something wrong in MySQL.",
        });
        return;
    }

    // Attach cookie in response
    res.cookie(
        "e-hospital",
        { id: id, account_type: 2 }, // the account type 2 represent the doctor
        {
            maxAge: 10 * 60 * 1000, // expired in 10 minutes
            // secure: true,
            httpOnly: true,
            overwrite: true,
            sameSite: "lax",
        }
    );

    // Jump to doctor dashboard
    res.render("pages/Dashboard/DoctorDashBoard", {
        patients: models.removeKey(result, "id"),
        doctor: doctors_data,
    });
});

router.post("/searchpatient", (req, res) => {
    // Check the user cookies
    const cookie = req.cookies["e-hospital"];
    if (cookie == null || cookie.account_type != 2) {
        console.log("Cookie expired or incorrect account.");
        res.redirect("signin");
        return;
    }
    // Refresh the valid time
    res.cookie("e-hospital", cookie, {
        maxAge: 10 * 60 * 1000,
        httpOnly: true,
        overwrite: true,
        sameSite: "lax",
    });

    console.log("cookies");
    console.log(cookie);

    const phoneNumber = req.body.phoneNumber; // patient phone number, e.g. "6131230000"
    console.log(phoneNumber);
    // Check patient identity
    if (!phoneNumber) {
        res.send({ error: "Missing patient phone number" });
        return;
    }
    var patient_id = 0;
    var check_list = [];
    let sqlDB = mysql.connect();
    sql = `
        SELECT *
        FROM doctor_recordauthorized join patients_registration ON doctor_recordauthorized.patient_id = patients_registration.id
        WHERE doctor_id = ${cookie.id} AND MobileNumber = "${phoneNumber}"
    `;
    console.log(sql);
    sqlDB.query(sql, (error, result) => {
        if (error) {
            res.send({ error: "Something wrong in MySQL." });
            console.log("Something wrong in MySQL");
            return;
        }
        if (result.length != 1) {
            check_list[0] = 1;
            // res.render('pages/searchpatient', {check:check_list});
            res.send({ error: "No authorized patient matched in database." });
            console.log("No authorized patient matched in database.");
            return;
        }
        patient_id = result[0].id;
        console.log(patient_id);
        sql_search_query = `SELECT * FROM patients_registration WHERE id = "${patient_id}"`;
        let sqlDB = mysql.connect();
        sqlDB.query(sql_search_query, function (err, result) {
            if (err) throw err;

            ///res.render() function
            res.render("pages/searchpatient", { data: result });
        });
        sqlDB.end();
        console.log(sql_search_query);
    });
    sqlDB.end();
});

router.post("/patientsDashboard", (req, res) => {
    const uuid = req.body.email;
    const password = req.body.password;

    let sqlDB = mysql.connect();
    sql = "SELECT * FROM `patients_registration` WHERE uuid =  ? AND verification = ?";
    console.log(sql);
    sqlDB.query(sql, [uuid, true], (error, result) => {
        if (error) throw error;
        if (result.length == 0) {
            var errorMessage = "Either ID or Password is wrong or your account is not verified. Please Check";
            console.log(errorMessage);
            res.redirect("signin");
        } else {
            if (result[0].uuid === uuid && result[0].password === password) {
                var patients_data = result[0];
                // Attach cookie in response
                res.cookie(
                    "e-hospital",
                    { id: patients_data.id, account_type: 1 },
                    {
                        // the account type 1 represent the patient
                        maxAge: 10 * 60 * 1000, // expired in 10 minutes
                        // secure: true,
                        httpOnly: true,
                        overwrite: true,
                        sameSite: "lax",
                    }
                );
                res.render("pages/Dashboard/patientsDashboard", {
                    patient: patients_data,
                });
            } else {
                var errorMessage = "Either ID or Password is wrong or your account is not verified. Please Check";
                console.log(errorMessage);
                res.redirect("signin");
            }
        }
    });
    sqlDB.end();
});

/* Patient Dashboard For showing the test results, (Sayyed Hossein Sadat Hosseini, Mohammad Rezaei, AliReza SabzehParvar) GroupNumber, Meidcal Innovation and Design, Winter-2023 */
router.get("/patientscardio", function (req, res) {
    const id = req.query.id;
    if (!id) {
        res.status(400).json({ error: "id parameter is required" });
        return;
    }
    let sqlDB = mysql.connect();
    const ptd = req.query.id;
    sqlCardio = "SELECT * FROM `ecg` WHERE patient_id = ?";
    sqlDB.query(sqlCardio, [ptd], (error, result) => {
        if (error) throw error;
        if (result[0].patient_id == ptd) {
        }

        res.json(result[0].RecordDate);
    });
    sqlDB.end();
});

router.get("/patientscardiovascular", function (req, res) {
    const id = req.query.id;
    if (!id) {
        res.status(400).json({ error: "id parameter is required" });
        return;
    }

    let sqlDB = mysql.connect();
    const ptd = req.query.id;
    sqlCardio = "SELECT * FROM `cardiovascular` WHERE patient_id = ?";

    sqlDB.query(sqlCardio, [ptd], (error, result) => {
        if (error) throw error;
        if (result[0].patient_id == ptd) {
        }
        res.json(result[0]);
    });
    sqlDB.end();
});

/* Patient Dashboard For showing the test results, (Sayyed Hossein Sadat Hosseini, Mohammad Rezaei, AliReza SabzehParvar) GroupNumber, Meidcal Innovation and Design, Winter-2023 */

var mongoClient = require("../models/mongodbConnection");
var mongoDb = mongoClient.getDb();

// API to fetch data from MongoDB, (Sayyed Hossein Sadat Hosseini, Mohammad Rezaei, AliReza SabzehParvar) GroupNumber, Meidcal Innovation and Design, Winter-2023 */
async function getRecordDate(patient_id, recordType) {
    const parsedId = parseInt(patient_id, 10); // convert to number
    const result = await mongoDb
        .collection(recordType)
        .findOne({ patient_id: parsedId }, { projection: { patient_id: 0 } });

    if (result === null) {
        console.log(`No record found for patient ID: ${patient_id}`);
        return null;
    }
    return result.RecordDate;
}

async function GetInformation(id, recordType) {
    const patient_id = id;
    const recordDate = await getRecordDate(patient_id, recordType);
    if (recordDate !== null) {
        return recordDate;
    }
}

router.get("/RetrieveXray", async function (req, res) {
    const id = req.query.id;
    const recordType = "X-Ray_Lung";
    if (!id) {
        res.status(400).json({ error: "id parameter is required" });
        return;
    }
    tmp = await GetInformation(id, recordType);
    // console.log(tmp);
    res.json(tmp);
});

router.get("/RetrieveEndoscopic", async function (req, res) {
    const id = req.query.id;
    const recordType = "Endoscopic";
    if (!id) {
        res.status(400).json({ error: "id parameter is required" });
        return;
    }
    tmp = await GetInformation(id, recordType);
    console.log(tmp);
    res.json(tmp);
});
// API to fetch data from MongoDB, (Sayyed Hossein Sadat Hosseini, Mohammad Rezaei, AliReza SabzehParvar) GroupNumber, Meidcal Innovation and Design, Winter-2023 */
/* Patient Dashboard For showing the test results, (Sayyed Hossein Sadat Hosseini, Mohammad Rezaei, AliReza SabzehParvar) GroupNumber, Meidcal Innovation and Design, Winter-2023 */

/* Patient Dashboard with Editable fields, (Sayyed Hossein Sadat Hosseini, Mohammad Rezaei, AliReza SabzehParvar) GroupNumber, Meidcal Innovation and Design, Winter-2023 */
//Editable Part
router.get("/patientsDashboardEdit", (req, res) => {
    const cookie = req.cookies["e-hospital"];
    if (cookie == null || cookie.account_type != 1) {
        console.log("Cookie expired or incorrect account.");
        res.render("pages-new/signin", {
            // New login page
            error: "Cookie expired or incorrect account.",
        });
        return;
    }
    // Refresh the valid time
    res.cookie("e-hospital", cookie, {
        maxAge: 10 * 60 * 1000,
        httpOnly: true,
        overwrite: true,
        sameSite: "lax",
    });

    // const uuid = req.query.id;
    const fname = req.query.fname;
    const MName = req.query.MName;
    const LName = req.query.LName;
    const MobileNumber = req.query.MobileNumber;
    const Age = req.query.Age;
    const BloodGroup = req.query.BloodGroup;
    const Location = req.query.Location;
    const weight = req.query.weight;
    const height = req.query.height;

    console.log(req.query);
    let sqlDB = mysql.connect();
    sql = "UPDATE patients_registration SET FName = ?, MName = ? , LName = ? , MobileNumber = ? , Age = ? , BloodGroup = ? , Location = ? , weight = ? , height = ? WHERE id = ?";
    sqlDB.query(
        sql,
        [
            fname,
            MName,
            LName,
            MobileNumber,
            Age,
            BloodGroup,
            Location,
            weight,
            height,
            cookie.id,
        ],
        (error, result) => {
            var patients_data = [
                fname,
                MName,
                LName,
                MobileNumber,
                Age,
                BloodGroup,
                Location,
                weight,
                height,
                cookie.id,
            ];
            res.render("pages/Dashboard/patientsDashboard", {
                patient: patients_data,
            });
        }
    );
    sqlDB.end();
});
/* Patient Dashboard with Editable fields, (Sayyed Hossein Sadat Hosseini, Mohammad Rezaei, AliReza SabzehParvar) GroupNumber, Meidcal Innovation and Design, Winter-2023 */

// Text Phone verification for Patients, (Sayyed Hossein Sadat Hosseini, Mohammad Rezaei, AliReza SabzehParvar) GroupNumber, Meidcal Innovation and Design, Winter-2023 */
router.post("/get_patientInfoTest", (req, res) => {
    const getDetails = req.body;
    const uuid = getDetails.EmailId;
    // console.log(uuid)
    let sqlDB = mysql.connect();
    sql = "SELECT * FROM `patients_registration` WHERE EmailId =  ? ";
    // console.log(sql);
    sqlDB.query(sql, [uuid, true], (error, result) => {
        console.log("T1");
        if (error) throw error;
        if (result.length != 0) {
            console.log(result.length);
            var errorMessage = "Either ID or Password is wrong or your account is not verified. Please Check";
            res.render("pages/patientLogin", {
                //patientsDashboard
                error: errorMessage,
            });
        } else {
            let uuid = "PAT-" + "ON-" + getDetails.Age + "-" + getDetails.province + "-" + Math.floor(Math.random() * 90000) + 10000;
            var password = crypto.randomBytes(16).toString("hex");
            sql = "INSERT INTO `patients_registration`(`uuid`,`FName`, `MName`, `LName`, `Age`, `BloodGroup`, `MobileNumber`, `EmailId`, `Address`, `Location`, `PostalCode`, `City`, `Province`, `HCardNumber`, `PassportNumber`, `PRNumber`, `DLNumber`, `Gender`, `verification`, `password`) VALUES ?";

            // sqlt = "SELECT * FROM `patients_registration` WHERE uuid = ?";

            var VALUES = [
                [
                    uuid,
                    getDetails.Fname,
                    getDetails.Mname,
                    getDetails.LName,
                    getDetails.Age,
                    getDetails.bloodGroup,
                    getDetails.number,
                    getDetails.EmailId,
                    getDetails.Address,
                    getDetails.Location,
                    getDetails.PostalCode,
                    getDetails.City,
                    getDetails.province,
                    getDetails.H_CardNo,
                    getDetails.PassportNo,
                    getDetails.PRNo,
                    getDetails.DLNo,
                    getDetails.gender,
                    true,
                    password,
                ],
            ];
            let sqlDB = mysql.connect();
            sqlDB.query(sql, [VALUES], (error, result) => {
                if (error) throw error;
                res.render("pages/thankyou");
            });
            sqlDB.end();
            sms(uuid, password, getDetails.number);
        }
    });
    sqlDB.end();
});

// API for sending sms from TWILIO website to the patients' phone, (Sayyed Hossein Sadat Hosseini, Mohammad Rezaei, AliReza SabzehParvar) GroupNumber, Meidcal Innovation and Design, Winter-2023 */
async function sms(uuid, password, number) {
    const accountSid = "ACcd90ad6235243c49f5f806ddbbcf26d1"; //process.env.TWILIO_ACCOUNT_SID;
    const authToken = "5589b3a47f698ac1942197b62b0082c9"; //process.env.TWILIO_AUTH_TOKEN;

    const client = require("twilio")(accountSid, authToken, {
        logLevel: "debug",
    });

    client.messages
        .create({
            body:
                "\n\n E-Hospital Account \n User: " +
                uuid +
                " \n Password: " +
                password,
            from: "+13433074905",
            to: number,
        })
        .then((message) => console.log(message.dateCreated)); //message.sid
}
// Text Phone verification for Patients, (Sayyed Hossein Sadat Hosseini, Mohammad Rezaei, AliReza SabzehParvar) GroupNumber, Meidcal Innovation and Design, Winter-2023 */

/* Patient Dashboard with editable feilds, (Sayyed Hossein Sadat Hosseini, Mohammad Rezaei, AliReza SabzehParvar) GroupNumber, Meidcal Innovation and Design, Winter-2023 */
router.post("/get_patientInfo", (req, res) => {
    const getDetails = req.body;
    let uuid = "PAT-" + "ON-" + getDetails.Age + "-" + getDetails.province + "-" + Math.floor(Math.random() * 90000) + 10000;
    var password = crypto.randomBytes(16).toString("hex");

    let sqlDB = mysql.connect();
    sql = "INSERT INTO `patients_registration`(`uuid`,`FName`, `MName`, `LName`, `Age`, `BloodGroup`, `MobileNumber`, `EmailId`, `Address`, `Location`, `PostalCode`, `City`, `Province`, `HCardNumber`, `PassportNumber`, `PRNumber`, `DLNumber`, `Gender`, `verification`, `password`) VALUES ?";

    var VALUES = [
        [
            uuid,
            getDetails.Fname,
            getDetails.Mname,
            getDetails.LName,
            getDetails.Age,
            getDetails.bloodGroup,
            getDetails.number,
            getDetails.EmailId,
            getDetails.Address,
            getDetails.Location,
            getDetails.PostalCode,
            getDetails.City,
            getDetails.province,
            getDetails.H_CardNo,
            getDetails.PassportNo,
            getDetails.PRNo,
            getDetails.DLNo,
            getDetails.gender,
            true,
            password,
        ],
    ];
    sqlDB.query(sql, [VALUES], (error, result) => {
        if (error) throw error;
        res.render("pages/thankyou");
    });
    sqlDB.end();
    // sms();
});
/* Patient Dashboard with editable field, (Sayyed Hossein Sadat Hosseini, Mohammad Rezaei, AliReza SabzehParvar) GroupNumber, Meidcal Innovation and Design, Winter-2023 */

router.post("/get_docotorInfoTest", (req, res) => {
    const uuid = req.body.EmailId;
    const password = req.body.password;
    let sqlDB = mysql.connect();
    sql = "SELECT * FROM `doctors_registration` WHERE uuid =  ? AND verification = ?";
    sqlDB.query(sql, [uuid, true], (error, result) => {
        if (error) throw error;
        if (result.length == 0) {
            errorMessage = "Either ID or Password is wrong or your account is not verified. Please Check";

            const get_doctorInfo = req.body;
            var password = crypto.randomBytes(16).toString("hex");
            let uuid = "DOC-" + "ON-" + get_doctorInfo.age + "-" + get_doctorInfo.province + "-" + Math.floor(Math.random() * 90000) + 10000;
            // let randomId = Math.floor(Math.random()*90000) + 10000;
            sql = "INSERT INTO `doctors_registration`(`Fname`, `Mname`, `Lname`, `Age`, `bloodGroup`, `MobileNumber`, `EmailId`, `ConfirmEmail`, `Location1`, `Location2`, `PostalCode`, `City`, `Country`, `Province`, `Medical_LICENSE_Number`, `DLNumber`, `Specialization`, `PractincingHospital`, `Gender`, `uuid`, `verification`, `password`) VALUES ?";

            var getDoctorsInfo = [
                [
                    get_doctorInfo.Fname,
                    get_doctorInfo.Mname,
                    get_doctorInfo.LName,
                    get_doctorInfo.age,
                    get_doctorInfo.bloodGroup,
                    get_doctorInfo.MobileNo,
                    get_doctorInfo.EmailId,
                    get_doctorInfo.ConfirmEmail,
                    get_doctorInfo.Location1,
                    get_doctorInfo.Location1,
                    get_doctorInfo.PostalCode,
                    get_doctorInfo.city,
                    get_doctorInfo.Country,
                    get_doctorInfo.province,
                    get_doctorInfo.MLno,
                    get_doctorInfo.DLNo,
                    get_doctorInfo.Specialization,
                    get_doctorInfo.PractincingHospital,
                    get_doctorInfo.gender,
                    uuid,
                    true,
                    password,
                ],
            ];

            let sqlDB = mysql.connect();
            sqlDB.query(sql, [getDoctorsInfo], (error, result) => {
                if (error) throw error;
                res.render("pages/thankyou");
            });
            sqlDB.end();

            res.render("pages/doctorLogin", {
                error: errorMessage,
            });
        } else {
            if (result[0].uuid === uuid && result[0].password === password) {
                var patients_data;
                var doctors_data;
                doctors_data = result[0];
                console.log(doctors_data);
                sql = "SELECT * FROM `patients_registration` WHERE 1";
                let sqlDB = mysql.connect();
                sqlDB.query(sql, (error, result) => {
                    patients_data = result;
                    if (error) throw error;
                    res.render("pages/Dashboard/DoctorDashBoard", {
                        patients: patients_data,
                        doctor: doctors_data,
                    });
                });
                sqlDB.end();
            } else {
                errorMessage = "Either ID or Password is wrong or your account is not verified. Please Check";
                res.render("pages/doctorLogin", {
                    error: errorMessage,
                });
            }
        }
    });
    sqlDB.end();
});

router.post("/get_doctorInfo", (req, res) => {
    const get_doctorInfo = req.body;
    var password = crypto.randomBytes(16).toString("hex");
    let uuid = "DOC-" + "ON-" + get_doctorInfo.age + "-" + get_doctorInfo.province + "-" + Math.floor(Math.random() * 90000) + 10000;
    // let randomId = Math.floor(Math.random()*90000) + 10000;
    let sqlDB = mysql.connect();
    sql = "INSERT INTO `doctors_registration`(`Fname`, `Mname`, `Lname`, `Age`, `bloodGroup`, `MobileNumber`, `EmailId`, `ConfirmEmail`, `Location1`, `Location2`, `PostalCode`, `City`, `Country`, `Province`, `Medical_LICENSE_Number`, `DLNumber`, `Specialization`, `PractincingHospital`, `Gender`, `uuid`, `verification`, `password`) VALUES ?";

    var getDoctorsInfo = [
        [
            get_doctorInfo.Fname,
            get_doctorInfo.Mname,
            get_doctorInfo.LName,
            get_doctorInfo.age,
            get_doctorInfo.bloodGroup,
            get_doctorInfo.MobileNo,
            get_doctorInfo.EmailId,
            get_doctorInfo.ConfirmEmail,
            get_doctorInfo.Location1,
            get_doctorInfo.Location1,
            get_doctorInfo.PostalCode,
            get_doctorInfo.city,
            get_doctorInfo.Country,
            get_doctorInfo.province,
            get_doctorInfo.MLno,
            get_doctorInfo.DLNo,
            get_doctorInfo.Specialization,
            get_doctorInfo.PractincingHospital,
            get_doctorInfo.gender,
            uuid,
            true,
            password,
        ],
    ];

    sqlDB.query(sql, [getDoctorsInfo], (error, result) => {
        if (error) throw error;
        if (get_doctorInfo.Specialization == "Psychology") {
            res.redirect("/psychologistRegistration?uuid=" + uuid);
        } else {
            res.render("pages/thankyou");
        }
    });
    sqlDB.end();

    // sms();
    async function sms() {
        const accountSid = "ACcd90ad6235243c49f5f806ddbbcf26d1"; //process.env.TWILIO_ACCOUNT_SID;
        const authToken = "05c14694c309118ab18ae8c12c4a208d"; //process.env.TWILIO_AUTH_TOKEN;

        const client = require("twilio")(accountSid, authToken, {
            logLevel: "debug",
        });

        client.messages
            .create({
                body:
                    "\n\n E-Hospital Account \n User: " +
                    uuid +
                    " \n Password: " +
                    password,
                from: "+13433074905",
                to: get_doctorInfo.MobileNo,
            })
            .then((message) => console.log(message.status)); //message.sid
    }
});

router.post("/update_availability", (req, res) => {
    const Availability = req.body.Availability;
    const uuid = req.body.id;
    const password = req.body.password;

    let sqlDB = mysql.connect();
    sql = `UPDATE doctors_registration SET Availability = ${Availability} WHERE uuid = "${uuid}" AND password = "${password}" AND verification = true`;
    console.log(sql);
    sqlDB.query(sql, (error, result) => {
        if (error) {
            res.send({ error: "Something wrong in MySQL." });
            console.log(error);
            return;
        }
        if (result.affectedRows == 1) {
            result.changedRows == 1 ? res.send({ success: "Availability updated." }) : res.send({ success: "The update is already in place." });
        } else if (result.affectedRows == 0) {
            res.send({ error: "Your account info is not correct." });
        } else if (result.affectedRows > 1) {
            res.send({
                error: "Duplicate account updated, please contact the system manager.",
            });
        } else {
            res.send({ error: "Something goes wrong in the database." });
        }
    });
    sqlDB.end();
});

router.post("/Hospital", (req, res) => {
    const get_HospitalInfo = req.body;

    if (get_HospitalInfo.EmailId != get_HospitalInfo.ConfirmEmail) {
        res.render("pages/hospital");
        return;
    }

    var password = crypto.randomBytes(16).toString("hex");

    let sqlDB = mysql.connect();
    sql = "INSERT INTO `hospital_admin`(`Hospital_Name`, `Email_Id`, `MobileNumber`, `Location1`, `Location2`, `PostalCode`, `City`, `Province`, `Country`, `Facilities_departments`, `Number_Doctors`, `Number_Nurse`, `No_Admins`, `Patients_per_year`, `Tax_registration_number`, `uuid`, `verification`, `password`) VALUES ?";

    var getDoctorsInfo = [
        [
            get_HospitalInfo.Hospital_Name,
            get_HospitalInfo.EmailId,
            get_HospitalInfo.MobileNumber,
            get_HospitalInfo.Location1,
            get_HospitalInfo.Location2,
            get_HospitalInfo.PostalCode,
            get_HospitalInfo.city,
            get_HospitalInfo.Country,
            get_HospitalInfo.province,
            get_HospitalInfo.Facilities_departments,
            get_HospitalInfo.DoctorNo,
            get_HospitalInfo.N_Nureses,
            get_HospitalInfo.No_Admin,
            get_HospitalInfo.PatientsPerYear,
            get_HospitalInfo.TaxRegNo,
            "HOS-" + Math.floor(Math.random() * 90000) + 10000,
            false,
            password,
        ],
    ];

    sqlDB.query(sql, [getDoctorsInfo], (error, result) => {
        if (error) throw error;
        res.render("pages/thankyou");
    });
    sqlDB.end();
});

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "ehospital112233@gmail.com",
        pass: "hlcvsrrzempexzhw",
    },
});

// Lab Registration
/* Lab Registration webpage with email Notification and connection with db, (Sayyed Hossein Sadat Hosseini, Mohammad Rezaei, AliReza SabzehParvar) GroupNumber, Meidcal Innovation and Design, Winter-2023 */
router.post("/Lab", (req, res) => {
    const get_LabInfo = req.body;
    var uniqueID = "HOS-" + Math.floor(Math.random() * 90000) + 10000;
    var password = crypto.randomBytes(16).toString("hex");
    email = req.body.ConfirmEmail;

    var login_url = "http://www.e-hospital.ca/signin";
    transporter.sendMail({
        from: "ehospital112233@gmail.com", // sender address
        to: email, // list of receivers
        subject: "Your E-Lab account confirmed", // Subject line
        html: `
      <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Lab Registration Confirmation</title>
  </head>
  <body>
    <h1>Lab Registration Confirmation</h1>
    <p> Hi There,</p>
    <p>We are pleased to confirm your registration for the ${get_LabInfo.Lab_Name}.</p>
    <p>Details of your registration:</p>
    <ul>
      <li>Email: ${get_LabInfo.EmailId}</li>
    </ul>
    <p>Best regards,</p>
    <p>E-Hospital</p>
    <p>http://e-hospital.ca/</p>
  
  </body>
  </html>
  
   `, // html body
    });

    let sqlDB = mysql.connect();
    sql = "INSERT INTO `lab_admin`(`Lab_Name`, `Email_Id`, `Confirm_Email`, `Location1`, `Location2`, `PostalCode`, `City`, `Country` ,`Province`, `Ref_Phy_Name`, `Ref_Phy_Con_Info`, `Insu_Info`, `Payment_Metho`, `uuid`, `verification`, `password`, `TRN`) VALUES ?;";

    var getLabInfo = [
        [
            get_LabInfo.Lab_Name,
            get_LabInfo.EmailId,
            get_LabInfo.ConfirmEmail,
            get_LabInfo.Location1,
            get_LabInfo.Location2,
            get_LabInfo.PostalCode,
            get_LabInfo.city,
            get_LabInfo.Country,
            get_LabInfo.province,
            get_LabInfo.Ref_Phy_Name,
            get_LabInfo.Ref_Phy_Con_Info,
            get_LabInfo.Insu_Info,
            get_LabInfo.Payment_Metho,
            uniqueID,
            password,
            false,
            get_LabInfo.Tax_registration_number,
        ],
    ];

    sqlDB.query(sql, [getLabInfo], (error, result) => {
        if (error) throw error;
        res.render("pages/thankyou");
    });
    sqlDB.end();
});
/* Lab Registration webpage with email Notification and connection with db, (Sayyed Hossein Sadat Hosseini, Mohammad Rezaei, AliReza SabzehParvar) GroupNumber, Meidcal Innovation and Design, Winter-2023 */

// app.post('/masterDashboard', (req, res) => {
//     const email = req.body.email;
//     const password = req.body.password;
//     sql = "SELECT * FROM `master_admin` WHERE 1";
//     conn.query(sql, (error, result) => {
//       if(result.length == 0) {
//         var errorMessage = "ID or Password is wrong. Please Try again";
//         res.render('pages/logina8b9',{
//           error: errorMessage
//         })
//       } else {
//         if (error) {
//           res.send(error);
//         }
//         if (result[1].userName === email && result[1].password === password) {
//           var patients_data;
//           var doctors_data;
//           var hospitals_data;
//           sql = "SELECT * FROM `doctors_registration` WHERE 1";
//           conn.query(sql, (error, result) => {
//             if (error) throw error
//             doctors_data   = result;
//             sql = "SELECT * FROM `patients_registration` WHERE 1";
//             conn.query(sql, (error, result) => {
//               patients_data = result;
//               if (error) throw error
//               sql = "SELECT * FROM `hospital_admin` Order by id DESC";
//               conn.query(sql, (error, result) => {
//                 hospitals_data = result
//                 if (error) throw error
//                 res.render("pages/Dashboard/MasterDashboard", {
//                   patients: patients_data,
//                   doctors: doctors_data,
//                   hospitals: hospitals_data
//                 });
//               })
//             })
//           })
//         } else {
//           var errorMessage = "ID or Password is wrong. Please Try again";
//           res.render('pages/logina8b9',{
//             error: errorMessage
//           })
//         }
//       }
//     })
// })

router.get("/hospitalData", (req, res) => {
    let sqlDB = mysql.connect();
    sql = "SELECT * FROM `hospital_admin` Order by id DESC";
    sqlDB.query(sql, (error, result) => {
        res.send(result);
        if (!error) {
            res.render(result);
        }
    });
    sqlDB.end();
});


router.get("/sendEmail", (req, res) => {
    usertype = req.query.usertype;
    var uniqueID = "";
    var password = "";
    var sql = "";
    if (usertype === "pat") {
        sql = "SELECT * FROM `patients_registration` WHERE id = ?";
    } else if (usertype === "hos") {
        sql = "SELECT * FROM `hospital_admin` WHERE id = ?";
    } else if (usertype === "doc") {
        sql = "SELECT * FROM `doctors_registration` WHERE id = ?";
    }

    let sqlDB = mysql.connect();
    sqlDB.query(sql, [req.query.id], (error, result) => {
        if (error) throw error;
        uniqueID = result[0].uuid;
        password = result[0].password;
        MobileNo = result[0].MobileNumber;
        email = result[0].EmailId || result[0].Email_Id;

        if (usertype === "pat" || usertype === "doc") {
            fname = result[0].Fname;
            lname = result[0].Lname;
            name = fname + " " + lname;
        } else if (usertype === "hos") {
            name = result[0].Hospital_Name;
        }

        // console.log(uniqueID);
        // console.log(password);

        main();
    });
    sqlDB.end();

    ("use strict");
    const nodemailer = require("nodemailer");

    async function main() {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: "ehospital112233@gmail.com", //add your smtp server
                pass: "hlcvsrrzempexzhw", //with password
            },
        });

        var login_url = "http://www.e-hospital.ca/signin";
        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: "ehospital112233@gmail.com", // sender address
            to: email, // list of receivers
            subject: "Your E-Hospital account confirmed", // Subject line
            html: `
          <h1>This is to confirm that, your registration with E-Hospital is completed</h1> <br/>
          <h3>Please use the below details to login</h3> <br/>
          <div>
          <strong> Name : ${name}</strong> </br>
          </div>
          <div>
          <strong> Unique-Id : ${uniqueID}</strong> </br>
          </div>
          <div>
          <strong> Password : ${password}</strong> </br>
          </div>
          <div>
          <strong> Login Link : ${login_url}</strong> </br>
          </div> `, // html body
        });

        if (info.messageId) {
            var sql = "";
            if (usertype === "pat") {
                sql = "UPDATE patients_registration SET verification = ? WHERE id = ?";
                // f
            } else if (usertype === "hos") {
                sql = "UPDATE hospital_admin SET verification = ? WHERE id = ?";
            } else if (usertype === "doc") {
                sql = "UPDATE doctors_registration SET verification = ? WHERE id = ?";
            }
            let sqlDB = mysql.connect();
            sqlDB.query(sql, [true, req.query.id], (error, result) => {
                if (error) throw error;
                res.json({ status: true });
            });
            sqlDB.end();
        }
    }

    async function sms() {
        const accountSid = "ACcd90ad6235243c49f5f806ddbbcf26d1"; //process.env.TWILIO_ACCOUNT_SID;
        const authToken = "05c14694c309118ab18ae8c12c4a208d"; //process.env.TWILIO_AUTH_TOKEN;

        const client = require("twilio")(accountSid, authToken, {
            logLevel: "debug",
        });

        client.messages
            .create({
                body:
                    "\n\n E-Hospital Account \n User: " +
                    uniqueID +
                    " \n Password: " +
                    password,
                from: "+13433074905",
                to: MobileNo,
            })
            .then((message) => console.log(message.dateCreated)); //message.sid
    }
});

// This API is for authorized doctors to check the patient's diagnostics and treatment.
router.post("/checkPatientMedicalHistory", async (req, res) => {
    const uuid = req.body.uuid;
    const password = req.body.password;
    const phoneNumber = req.body.phoneNumber;

    // Execute query
    sql = `SELECT id FROM doctors_registration WHERE uuid = "${uuid}" AND password = "${password}" AND verification = 1`;
    try {
        result = await mysql.query(sql);
    } catch (error) {
        console.log(error);
        res.send({ error: "Something wrong in MySQL." });
        return;
    }

    if (result.length != 1) {
        res.send({ error: "No doctor matched in the database." });
        return;
    }

    // Execute query
    sql = `SELECT patient_id FROM patients_registration join doctor_recordauthorized ON patients_registration.id = doctor_recordauthorized.patient_id WHERE MobileNumber = "${phoneNumber}" AND verification = 1 AND doctor_id = ${result[0].id}`;
    try {
        result = await mysql.query(sql);
    } catch (error) {
        console.log(error);
        res.send({ error: "Something wrong in MySQL." });
        return;
    }

    if (result.length != 1) {
        res.send({
            error: "The authorized patient was not matched in the database.",
        });
        return;
    }

    result = await models.getMedicalHistory(result[0].patient_id);
    res.send(result);
});

// This API is for adding treatment for a specific patient
router.post("/createMedicalHistory", async (req, res) => {
    const uuid = req.body.uuid;
    const password = req.body.password;
    const phoneNumber = req.body.phoneNumber;
    const treatment = req.body.treatment;
    const recordDate = req.body.recordDate;
    const disease_type = req.body.disease_type;
    const disease_id = req.body.disease_id;

    // Execute query
    sql = `SELECT id FROM doctors_registration WHERE uuid = "${uuid}" AND password = "${password}" AND verification = 1`;
    try {
        result = await mysql.query(sql);
    } catch (error) {
        console.log(error);
        res.send({ error: "Something wrong in MySQL." });
        return;
    }

    if (result.length != 1) {
        res.send({ error: "No doctor matched in the database." });
        return;
    }
    let doctor_id = result[0].id;

    // Execute query
    sql = `SELECT patient_id FROM patients_registration join doctor_recordauthorized ON patients_registration.id = doctor_recordauthorized.patient_id WHERE MobileNumber = "${phoneNumber}" AND verification = 1 AND doctor_id = ${doctor_id}`;
    try {
        result = await mysql.query(sql);
    } catch (error) {
        console.log(error);
        res.send({ error: "Something wrong in MySQL." });
        return;
    }

    if (result.length != 1) {
        res.send({
            error: "The authorized patient was not matched in the database.",
        });
        return;
    }
    let patient_id = result[0].patient_id;

    // Execute query
    sql = `
        INSERT INTO patients_treatment (patient_id, doctor_id, treatment, RecordDate, disease_type, disease_id)
        VALUES (${patient_id}, ${doctor_id}, "${treatment}", "${recordDate}", ${disease_type != null ? '"' + disease_type + '"' : null},  ${disease_id != null ? disease_id : null})
    `;
    try {
        result = await mysql.query(sql);
    } catch (error) {
        console.log(error);
        res.send({ error: "Something wrong in MySQL." });
        return;
    }

    res.send({ success: "Update success." });
});

// This API is for authorized access to doctor
router.post("/authorizeToMedicalStaff", async (req, res) => {
    const uuid = req.body.uuid;
    const password = req.body.password;
    const phoneNumber = req.body.phoneNumber;
    const accountType = req.body.accountType;
    const isAuthorized = req.body.isAuthorized == "1" ? true : false;

    var accountTable = "";
    switch (accountType) {
        case "doctor":
            accountTable = "doctors_registration";
            break;
        case "hospital":
            accountTable = "hospital_admin";
            break;
        case "lab":
            accountTable = "lab_admin";
            break;
        case "clinic":
            accountTable = "clinic_admin";
            break;
        default:
            res.send({ error: `Unknown account type: ${accountType}` });
            return;
    }

    // Execute query
    sql = `SELECT id FROM patients_registration WHERE uuid = "${uuid}" AND password = "${password}" AND verification = true`;
    try {
        result = await mysql.query(sql);
    } catch (error) {
        console.log(error);
        res.send({ error: "Something wrong in MySQL." });
        return;
    }

    if (result.length == 0) {
        res.send({
            error: "Either ID or Password is wrong or your account is not verified. Please Check.",
        });
        return;
    }
    let patient_id = result[0].id;

    // Execute query
    sql = `SELECT id FROM ${accountTable} WHERE MobileNumber = "${phoneNumber}" AND verification = true`;

    try {
        result = await mysql.query(sql);
    } catch (error) {
        console.log(error);
        res.send({ error: "Something wrong in MySQL." });
        return;
    }

    if (result.length == 0) {
        res.send({
            error: `No valid ${accountType} account found base on this phone number. Please Check.`,
        });
        return;
    }
    let medical_id = result[0].id;

    // Execute query
    sql = isAuthorized
        ? `INSERT INTO ${accountType}_recordauthorized (${accountType}_id,patient_id) VALUES (${medical_id},${patient_id});`
        : `DELETE FROM ${accountType}_recordauthorized WHERE ${accountType}_id = "${medical_id}" AND patient_id = "${patient_id}";`;
    try {
        result = await mysql.query(sql);
    } catch (error) {
        if (error.code != "ER_DUP_ENTRY") {
            res.send({ error: "Something wrong in MySQL." });
            console.log(error);
            return;
        }
    }
    res.send({
        success: isAuthorized ? "Authorize success." : "Deauthorize success.",
    });
});

// This API is for checking the authorized patient list
router.post("/checkAuthorizedPatients", async (req, res) => {
    const uuid = req.body.uuid;
    const password = req.body.password;
    const accountType = req.body.accountType;

    var accountTable = "";

    switch (accountType) {
        case "doctor":
            accountTable = "doctors_registration";
            break;
        case "hospital":
            accountTable = "hospital_admin";
            break;
        case "lab":
            accountTable = "lab_admin";
            break;
        case "clinic":
            accountTable = "clinic_admin";
            break;
        default:
            res.send({ error: `Unknown account type: ${accountType}` });
            return;
    }

    // Check parameters
    if (!uuid || !password) {
        res.send({ error: "Missing doctor credential." });
        return;
    }

    // Execute query
    sql = `SELECT id FROM ${accountTable} WHERE uuid = "${uuid}" AND password = "${password}" AND verification = true`;

    try {
        result = await mysql.query(sql);
    } catch (error) {
        console.log(error);
        res.send({ error: "Something wrong in MySQL." });
        return;
    }

    if (result.length == 0) {
        res.send({
            error: "Either ID or Password is wrong or your account is not verified. Please Check.",
        });
        return;
    }

    let id = result[0].id;
    sql = `
        SELECT FName, MName, LName, Age, Gender, BloodGroup, height, weight, MobileNumber, EmailId
        FROM ${accountType}_recordauthorized join patients_registration ON ${accountType}_recordauthorized.patient_id = patients_registration.id
        WHERE ${accountType}_id = ${id}
    `;
    try {
        result = await mysql.query(sql);
    } catch (error) {
        console.log(error);
        res.send({ error: "Something wrong in MySQL." });
        return;
    }

    res.send({ success: result });
});

module.exports = router;