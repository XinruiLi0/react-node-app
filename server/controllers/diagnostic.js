var express = require("express");
var router = express.Router();
// var axios = require("axios");
var multer = require("multer");
var memoryStorage = multer.memoryStorage();
var upload = multer({ storage: memoryStorage });
var mysql = require("../models/dbConnection");
var models = require('../models/commonMethod');
var fs = require("fs");
var FormData = require("form-data");

var sql = "";

// ------------------------------ Pages Configuration ------------------------------

router.get("/diagnostic-depart", (req, res) => {
    res.render("pages-new/diagnostic-depart");
});

router.get("/urology", (req, res) => {
    res.redirect(" https://mlmodel2.herokuapp.com/");
});

router.get("/AlzheimerMRIDetection", (req, res) => {
    res.render("pages/AlzheimerMRIDetection");
});

router.get("/pneumoniahome", (req, res) => {
    res.render("pages/index");
});

router.get("/heartdiseasefrontend", (req, res) => {
    res.render("pages/heartdiseasefrontend");
});

router.get("/CoronaryArteryDisease", (req, res) => {
    res.render("pages/CoronaryArteryDisease");
});

router.get("/pneumonia", (req, res) => {
    res.render("pages/pneumonia");
});

router.get("/Skincancer", (req, res) => {
    res.render("pages/Skincancer");
});

router.get("/arrhythmia", (req, res) => {
    res.render("pages/ecg-ml");
});

router.get("/diabetology", (req, res) => {
    res.render("pages/diabetology");
});

router.get("/diabetology_specialists", (req, res) => {
    res.render("pages/diabetology_specialists");
});

router.get("/DiabetologyDiagnostics", (req, res) => {
    res.render("pages/DiabetologyDiagnostics");
});

router.get("/DiabetologyPatients", (req, res) => {
    res.render("pages/DiabetologyPatients");
});

router.get("/Pneumonia-diagnostics", (req, res) => {
    res.render("pages/Pneumonia-diagnostics");
});

router.get("/Skincancer-diagnostics", (req, res) => {
    res.render("pages/Skincancer-diagnostics");
});

router.get("/kidney-diagnostic", (req, res) => {
    res.render("pages/kidney-diagnostic");
});

router.get("/brain", (req, res) => {
    res.render("pages/brain");
});

router.get("/psychology", (req, res) => {
    res.render("pages/psychology");
});

router.get("/psychologyQuestionnaire", (req, res) => {
    res.render("pages/psychologyQuestionnaire");
});

router.get("/psychologyPhoneNumber", (req, res) => {
    res.render("pages/psychologyPhoneNumber");
});

router.get(
    "/psychologyDiagnosisQuestionnaires/patientID=:patientID&type=:type",
    (req, res) => {
        const { patientID, type } = req.query;
        res.render("pages/psychologyDiagnosisQuestionnaires", { patientID, type });
    }
);

router.get("/psychologyDiagnosis", (req, res) => {
    res.render("pages/psychologyDiagnosis");
});

router.get("/psychologyDepressionQuestionnaire", (req, res) => {
    res.render("pages/psychologyDepressionQuestionnaire");
});

router.get("/psychologyAnxietyQuestionnaire", (req, res) => {
    res.render("pages/psychologyAnxietyQuestionnaire");
});

router.get("/psychologistRecommendation", (req, res) => {
    res.render("pages/psychologistRecommendation");
});

router.get("/psychologistRegistration", (req, res) => {
    res.render("pages/psychologistRegistration");
});

router.get("/respiratoryMedicine", (req, res) => {
    res.render("pages/respiratoryMedicine", { message: "", prediction: "" });
});

router.get("/liver", (req, res) => {
    res.render("pages/liver-prediction");
});

router.get("/liver2", (req, res) => {
    res.render("pages/liver-direct-prediction");
});

router.get("/heartDiseasePrediction", (req, res) => {
    res.render("pages/heartDiseasePrediction");
});

router.get("/alzheimersPrediction", (req, res) => {
    res.render("pages/alzheimersPrediction");
});

router.get("/gastroImagePrediction", (req, res) => {
    res.render("pages/gastroImagePrediction");
});

router.get("/Breast-Diagnostic", (req, res) => {
    res.render("pages/Breast-Diagnostic");
});

router.get("/symptoms-checker", (req, res) => {
    res.render("pages/symptoms-checker");
});

router.get("/Breast-Diagnostic", (req, res) => {
    res.render("pages/Breast-Diagnostic");
});

router.get("/heartStrokeDetection", (req, res) => {
    res.render("pages/heartStrokeDetection");
});

router.get("/heartStrokeDetection", (req, res) => {
    res.render("pages/heartStrokeDetection");
});

router.get("/cancerDetection", (req, res) => {
    res.render("pages/cancerDetection");
});

router.get("/AlzheimersDiagnostics", (req, res) => {
    res.render("pages/AlzheimersDiagnostics");
});

router.get("/BrainTumorDiagnostics", (req, res) => {
    res.render("pages/BrainTumorDiagnostics");
});

router.get("/cardiovascularDiseaseQuestionnaire", (req, res) => {
    res.render("pages/cardiovascularDiseaseQuestionnaire");
});

router.get("/cardiovascularDiseaseQuestionresult", (req, res) => {
    res.render("pages/cardiovascularDiseaseQuestionresult");
});

router.get("/internalmedicine", (req, res) => {
    res.render("pages/internalmedicine");
});

router.get("/common-diseases-diagnostics", (req, res) => {
    errorMessage = "";
    res.render("pages/common-diseases-diagnostics");
});

router.get("/specialty", (req, res) => {
    errorMessage = "";
    res.render("pages/specialty", {
        error: errorMessage,
    });
});

router.get("/Oncology", (req, res) => {
    errorMessage = "";
    res.render("pages/Oncology", {
        error: errorMessage,
    });
});

router.get("/Ophthalmology", (req, res) => {
    errorMessage = "";
    res.render("pages/Ophthalmology", {
        error: errorMessage,
    });
});

router.get("/heartDiseasePrediction", (req, res) => {
    res.render("pages/heartDiseasePrediction");
});

router.get("/ECG-Doctor", (req, res) => {
    res.render("pages/ECG-Doctor");
});

router.get("/MS-Doctor", (req, res) => {
    res.render("pages/MS-Doctor");
});

router.get("/MS-diagnoses", (req, res) => {
    res.render("pages/MS-diagnoses");
});

router.get("/diagnosisMS", (req, res) => {
    res.render("pages/diagnosisMS");
});

router.get("/ECG-diagnoses", (req, res) => {
    res.render("pages/ECG-diagnoses");
});

// ------------------------------ APIs Configuration ------------------------------

// Set up a route to handle form submissions and post to the Flask app
// router.post("/predict", upload.single("file"), (req, res) => {
//     const form = new FormData();
//     // Construct the URL of the Flask app's /predict endpoint

//     const imageFile = req.file;

//     // Convert the image file to a buffer and add it to the form data
//     const imageData = fs.readFileSync(imageFile.path);
//     form.append("file", imageData, {
//         filename: "image.jpg",
//         contentType: "image/jpeg",
//     });

//     // Send a POST request to the Flask app's /pneumoniapredict endpoint with the image data
//     axios
//         .post("http://127.0.0.1:5000/predict", form, {
//             headers: form.getHeaders(),
//         })
//         .then((response) => {
//             // The response data contains the HTML content of the predict page
//             const prediction = response.data;
//             res.render("pages/respiratoryMedicine", {
//                 message: "File uploaded successfully",
//                 prediction: prediction,
//             });
//         })
//         .catch((error) => {
//             console.error(error);
//             res.sendStatus(500);
//         });
// });

router.get("/get_diabetologyList", (req, res) => {
    let sqlDB = mysql.connect();
    sql = "SELECT Fname, Mname, Lname, Specialization, Location1, Location2, City, Province, Country, PostalCode, Availability FROM doctors_registration WHERE Specialization = 'Diabetology'";
    sqlDB.query(sql, (error, result) => {
        if (error) {
            res.send({ error: "Something wrong in MySQL." });
            console.log(error);
            sqlDB.end();
            return;
        }
        res.send(result);
    });
    sqlDB.end();
});

router.post("/DiabetologyData", (req, res) => {
    const getDetails = req.body;
    console.log(req.body);
    const phoneNumber = req.body.phoneNumber; // patient phone number, e.g. "6131230000"
    //const date = req.body.date; // prediction date, e.g. "2023-03-01 09:00:00"
    const date = new Date();
    if (!phoneNumber) {
        res.send({ error: "Missing patient phone number" });
        return;
    }

    let sqlDB = mysql.connect();
    sql = `SELECT id FROM patients_registration WHERE MobileNumber = "${phoneNumber}"`;
    // console.log(sql);
    sqlDB.query(sql, (error, result) => {
        if (error) {
            res.send({ error: "Something wrong in MySQL." });
            return;
        }
        if (result.length != 1) {
            console.log(result.length);
            res.send({ error: "No patient matched in database." });
            return;
        }

        const patient_id = result[0].id;

        console.log(patient_id);

        sql = "INSERT INTO `diabetes`(`patient_id`,`phoneNumber`,`date`, `Age`, `BMI`, `SkinThickness`, `Glucose`, `BloodPressure`, `Insulin`, `DiabetesPedigreeFunction`, `Sex`, `Pregnancies`, `ML_result`) VALUES ?";
        var VALUES = [
            [
                patient_id,
                phoneNumber,
                date,
                getDetails.Age,
                getDetails.BodyMassIndex,
                getDetails.SkinThickness,
                getDetails.Glucose,
                getDetails.BloodPressure,
                getDetails.Insulin,
                getDetails.DiabetesPedigreeFunction,
                getDetails.Sex,
                getDetails.Pregnancies,
                getDetails.ML_result,
            ],
        ];

        let sqlDB = mysql.connect();
        sqlDB.query(sql, [VALUES], (error, result) => {
            if (error) throw error;
            console.log(result);
        });
        sqlDB.end();
    });
    sqlDB.end();
});

// This is the MySQL health test search API
router.post("/DiabetologyPatients", async (req, res) => {
    const phoneNumber = req.body.phoneNumber; // patient phone number, e.g. "6131230000"
    const recordType = req.body.recordType; // the record type, e.g. "ecg", this represents the table name in the database

    // Check parameters
    if (!phoneNumber) {
        res.send({ error: "Missing patient phone number." });
        return;
    }
    if (!recordType) {
        res.send({ error: "Missing record type." });
        return;
    }

    let sqlDB = mysql.connect();
    var patient_id = 0;
    sql = `SELECT id FROM patients_registration WHERE MobileNumber = "${phoneNumber}"`;

    sqlDB.query(sql, async (error, result) => {
        if (error) {
            console.log();
            res.send({ error: "Something wrong in MySQL." });
            return;
        }
        if (result.length != 1) {
            res.send({ error: "No patient matched in database." });
            return;
        }
        patient_id = result[0].id;

        sql = `SELECT * FROM ${recordType} WHERE patient_id = "${patient_id}" ORDER BY date DESC`;
        let sqlDB = mysql.connect();
        sqlDB.query(sql, async (error, result) => {
            if (error) {
                console.log();
                res.send({ error: "Something wrong in MySQL." });
                return;
            }

            var temp = models.removeKey(result, "patient_id");
            res.send({ success: temp });
        });
        sqlDB.end();
    });
    sqlDB.end();
});

// To search for patient info based on id
router.post("/searchid", (req, res) => {
    const id = req.query.id;
    console.log("requestId", id);

    let sqlDB = mysql.connect();
    sql_search_query = `SELECT * FROM patients_registration WHERE id = ${id}`;
    sqlDB.query(sql_search_query, function (err, result) {
        if (err) throw err;
        // console.log(result);
        res.json(result);
    });
    sqlDB.end();
    console.log(sql_search_query);
});

// To search for Ecg blood test records  based on id & mobile number
router.post("/searchEcgBloodtest", (req, res) => {
    const mobileNumber = req.query.mobileNumber;
    const id = req.query.id;

    // console.log("requestMobileNumber", mobileNumber);

    let sqlDB = mysql.connect();
    const sql_search_query = `
      SELECT * 
      FROM ecg_bloodtest_going_to_delete
      WHERE phone_number = "${mobileNumber}"
      limit 100
    `;
    sqlDB.query(sql_search_query, function (err, result) {
        if (err) throw err;
        //console.log("blood test",result[0]);
        res.json(result[0]);
    });
    //console.log("sql_search_query",sql_search_query);
    sqlDB.end();
});

router.post("/update_tumorRecord", (req, res) => {
    if (!req.body) {
        res.send({ error: "Missing request body." });
        return;
    }
    const email = req.body.email;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    // Checkout the patient profile
    if (!email || !firstName || !lastName) {
        res.send({ error: "Missing patient email, first name, or last name." });
        return;
    }

    let sqlDB = mysql.connect();
    var pid = 0;
    sql = `SELECT id FROM patients_registration WHERE EmailId = "${email}" AND FName = "${firstName}" AND LName = "${lastName}"`;
    console.log(sql);
    sqlDB.query(sql, (error, result) => {
        if (error) {
            res.send({ MySQL_Error: error });
            return;
        }
        if (result.length == 0) {
            res.send({ error: "No patient matched in database." });
            return;
        } else if (result.length > 1) {
            res.send({ error: "Duplicate patient profile matched." });
            return;
        } else if (result.length < 0) {
            res.send({ error: "Invalid index on the backend." });
            return;
        }
        pid = result[0].id;

        // Check Record existed
        const radius = req.body.radius;
        const texture = req.body.texture;
        const perimeter = req.body.perimeter;
        const area = req.body.area;
        const smoothness = req.body.smoothness;
        const compactness = req.body.compactness;
        const concavity = req.body.concavity;
        const concavePoints = req.body.concavePoints;
        const symmetry = req.body.symmetry;
        const fractalDimension = req.body.fractalDimension;
        const date = req.body.date;
        const prediction = req.body.prediction;

        if (
            !radius ||
            !texture ||
            !perimeter ||
            !area ||
            !smoothness ||
            !compactness ||
            !concavity ||
            !concavePoints ||
            !symmetry ||
            !fractalDimension ||
            !date ||
            !prediction
        ) {
            res.send({ error: "Missing patient record or date." });
            return;
        }

        sql = `INSERT INTO tumor (patient_id, radius, texture, perimeter, area, smoothness, compactness, concavity, concavePoints, symmetry, fractalDimension, recordDate, prediction)
          VALUES (${pid}, ${radius}, ${texture}, ${perimeter}, ${area}, ${smoothness}, ${compactness}, ${concavity}, ${concavePoints}, ${symmetry}, ${fractalDimension}, "${date}", "${prediction}")`;
        console.log(sql);
        let sqlDB = mysql.connect();
        sqlDB.query(sql, (error, result) => {
            if (error) {
                res.send({ MySQL_Error: error });
                return;
            }
            if (result.affectedRows == 1) {
                res.send({ success: "Tumor Record update success." });
                return;
            } else {
                res.send({ error: "Something goes wrong in the database." });
            }
        });
        sqlDB.end();
    });
    sqlDB.end();
});

router.post("/get_tumorRecord", (req, res) => {
    if (!req.body) {
        res.send({ error: "Missing request body." });
        return;
    }
    const uuid = req.body.id;
    const password = req.body.password;

    let sqlDB = mysql.connect();
    sql = `SELECT radius, texture, perimeter, area, smoothness, compactness, concavity, concavePoints, symmetry, fractalDimension, recordDate, prediction 
    FROM tumor JOIN patients_registration ON tumor.patient_id = patients_registration.id 
    WHERE uuid = "${uuid}" AND PASSWORD = "${password}" AND verification = 1`;
    sqlDB.query(sql, (error, result) => {
        if (error) throw error;
        res.send({ result: result });
    });
    sqlDB.end();
});


router.post("/getPatientInformation", (req, res) => {
    const recordReq = req.body;
    let sqlDB = mysql.connect();
    sql = "SELECT pyramidal, cerebella, brain_stem, sensory, visual, mental, bowel_and_bladder_function, mobility, RecordDate FROM `physical_test_ms` WHERE patient_id= ?";
    sqlDB.query(sql, [recordReq.id], (error, result) => {
        res.send({ data: result });
    });
    sqlDB.end();
});

// API for symptoms checker
router.get("/get_symptoms_checker", (req, res) => {
    let sqlDB = mysql.connect();
    sql = "SELECT * FROM symptoms_checker";
    sqlDB.query(sql, (error, result) => {
        if (error) {
            res.send({ error: "Something wrong in MySQL." });
            console.log(error);
            return;
        }
        res.send({ success: result });
    });
    sqlDB.end();
});

/* Psychology, code started for logging info into database from psychology Questionnaire, also for finding the patient ID and showing results to the doctor. (Alexis McCreath Frangakis, Parisa Nikbakht)
   Group 8, Course-BMG5111, Winter 2023
*/
router.post("/psychologyQuestionnaire", (req, res) => {
    const getDetails = req.body;
    //console.log(req.body)
    const phoneNumber = req.body.phoneNumber; // patient phone number, e.g. "6131230000"
    //const date = req.body.date; // prediction date, e.g. "2023-03-01 09:00:00"
    const date = new Date();
    // Check patient identity
    if (!phoneNumber) {
        res.send({ error: "Missing patient phone number" });
        return;
    }
    let sqlDB = mysql.connect();
    sql = `SELECT id FROM patients_registration WHERE MobileNumber = "${phoneNumber}"`;
    // console.log(sql);
    sqlDB.query(sql, (error, result) => {
        if (error) {
            res.send({ error: "Something wrong in MySQL." });
            return;
        }
        if (result.length != 1) {
            console.log(result.length);
            res.send({ error: "No patient matched in database." });
            return;
        }
        const patient_id = result[0].id;
        sql = "INSERT INTO `psychology_patients`(`patient_id`,`phoneNumber`,`date`,`sex`,`language`, `treatment_setting`, `age_group`, `type_of_therapy`, `psychological_treatment`, `time_frame`, `frequency`, `cost`, `chosen_dr`) VALUES ?";
        var VALUES = [
            [
                patient_id,
                phoneNumber,
                date,
                getDetails.sex,
                getDetails.language,
                getDetails.treatment_setting,
                getDetails.age_group,
                getDetails.type_of_therapy,
                getDetails.psychological_treatment,
                getDetails.time_frame,
                getDetails.frequency,
                getDetails.cost,
                getDetails.dr_uuid,
            ],
        ];

        let sqlDB = mysql.connect();
        sqlDB.query(sql, [VALUES], (error, result) => {
            if (error) throw error;
            let params1 = encodeURIComponent(phoneNumber);
            let params2 = encodeURIComponent(getDetails.type_of_therapy);
            let params3 = encodeURIComponent(getDetails.dr_name);
            res.redirect("/psychologistRecommendation?phoneNumber=" + params1 + "&type=" + params2 + "&doc=" + params3);
        });
        sqlDB.end();
    });
    sqlDB.end();
});

router.post("/psychologyDepressionQuestionnaire", (req, res) => {
    const getDetails = req.body;
    //console.log(req.body)
    const phoneNumber = req.body.phoneNumber; // patient phone number, e.g. "6131230000"
    //const date = req.body.date; // prediction date, e.g. "2023-03-01 09:00:00"
    const date = new Date();
    // Check patient identity
    if (!phoneNumber) {
        res.send({ error: "Missing patient phone number" });
        return;
    }

    let sqlDB = mysql.connect();
    sql = `SELECT id FROM patients_registration WHERE MobileNumber = "${phoneNumber}"`;
    // console.log(sql);
    sqlDB.query(sql, (error, result) => {
        if (error) {
            res.send({ error: "Something wrong in MySQL." });
            return;
        }
        if (result.length != 1) {
            console.log(result.length);
            res.send({ error: "No patient matched in database." });
            return;
        }
        const patient_id = result[0].id;
        sql = "INSERT INTO `psychology_depression_questionnaire`(`patient_id`,`phoneNumber`,`date`,`q1`,`q2`, `q3`, `q4`, `q5`, `q6`, `q7`, `q8`, `q9`, `q10`, `result`) VALUES ?";
        var VALUES = [
            [
                patient_id,
                phoneNumber,
                date,
                getDetails.q1,
                getDetails.q2,
                getDetails.q3,
                getDetails.q4,
                getDetails.q5,
                getDetails.q6,
                getDetails.q7,
                getDetails.q8,
                getDetails.q9,
                getDetails.q10,
                getDetails.result,
            ],
        ];

        let sqlDB = mysql.connect();
        sqlDB.query(sql, [VALUES], (error, result) => {
            if (error) throw error;
            res.redirect("/thankyou");
        });
        sqlDB.end();
    });
    sqlDB.end();
});

router.post("/psychologyAnxietyQuestionnaire", (req, res) => {
    const getDetails = req.body;
    console.log(req.body);
    const phoneNumber = req.body.phoneNumber; // patient phone number, e.g. "6131230000"
    //const date = req.body.date; // prediction date, e.g. "2023-03-01 09:00:00"
    const date = new Date();
    // Check patient identity
    if (!phoneNumber) {
        res.send({ error: "Missing patient phone number" });
        return;
    }
    let sqlDB = mysql.connect();
    sql = `SELECT id FROM patients_registration WHERE MobileNumber = "${phoneNumber}"`;
    // console.log(sql);
    sqlDB.query(sql, (error, result) => {
        if (error) {
            res.send({ error: "Something wrong in MySQL." });
            return;
        }
        if (result.length != 1) {
            console.log(result.length);
            res.send({ error: "No patient matched in database." });
            return;
        }
        const patient_id = result[0].id;
        sql = "INSERT INTO `psychology_anxiety_questionnaire`(`patient_id`,`phoneNumber`,`date`,`q1`,`q2`, `q3`, `q4`, `q5`, `q6`, `q7`, `q8`, `q9`, `q10`,`q11`,`q12`, `q13`, `q14`, `q15`, `q16`, `q17`, `q18`, `result`) VALUES ?";
        var VALUES = [
            [
                patient_id,
                phoneNumber,
                date,
                getDetails.q1,
                getDetails.q2,
                getDetails.q3,
                getDetails.q4,
                getDetails.q5,
                getDetails.q6,
                getDetails.q7,
                getDetails.q8,
                getDetails.q9,
                getDetails.q10,
                getDetails.q11,
                getDetails.q12,
                getDetails.q13,
                getDetails.q14,
                getDetails.q15,
                getDetails.q16,
                getDetails.q17,
                getDetails.q18,
                getDetails.result,
            ],
        ];

        let sqlDB = mysql.connect();
        sqlDB.query(sql, [VALUES], (error, result) => {
            if (error) throw error;
            res.redirect("/thankyou");
        });
        sqlDB.end();
    });
    sqlDB.end();
});

/*getting all of the doctors from the database*/
router.get("/get_psychologistsinfo", (req, res) => {
    let sqlDB = mysql.connect();
    sql = "SELECT uuid, sex, language, treatment_setting, age_group, type_of_therapy, psychological_treatment, time_frame, frequency, cost FROM psychology_dr";
    sqlDB.query(sql, (error, result) => {
        if (error) throw error;
        res.json(result);
    });
    sqlDB.end();
});
/*end getting all of the doctors from the database*/
/*getting all of the doctors from the database*/
router.get("/get_psychologistsregistration", (req, res) => {
    let sqlDB = mysql.connect();
    sql = "SELECT Fname, Mname, Lname, Specialization, Location1, Location2, City, Province, Country, PostalCode, Availability, uuid FROM doctors_registration WHERE Specialization = 'Psychology'";
    sqlDB.query(sql, (error, result) => {
        if (error) throw error;
        res.json(result);
    });
    sqlDB.end();
});
/*end getting all of the doctors from the database*/

// This is the MySQL health test search API
router.post("/psychologyPatientRegistration", async (req, res) => {
    const phoneNumber = req.query.phoneNumber;
    const recordType = req.query.recordType;
    //console.log(recordType)
    // Check parameters
    if (!phoneNumber) {
        res.send({ error: "Missing patient phone number." });
        return;
    }
    if (!recordType) {
        res.send({ error: "Missing record type." });
        return;
    }

    let sqlDB = mysql.connect();
    var patient_id = 0;
    sql = `SELECT id FROM patients_registration WHERE MobileNumber = "${phoneNumber}"`;

    sqlDB.query(sql, async (error, result) => {
        if (error) {
            console.log();
            res.send({ error: "Something wrong in MySQL." });
            return;
        }
        if (result.length != 1) {
            res.send({ error: "No patient matched in database." });
            return;
        }
        patient_id = result[0].id;

        sql = `SELECT * FROM ${recordType} WHERE patient_id = "${patient_id}" ORDER BY date DESC`;
        let sqlDB = mysql.connect();
        sqlDB.query(sql, async (error, result) => {
            if (error) {
                console.log();
                res.send({ error: "Something wrong in MySQL." });
                return;
            }
            var temp = models.removeKey(result, "patient_id");
            res.send({ success: temp });
        });
        sqlDB.end();
    });
    sqlDB.end();
});

//Psychologist Profile Information
router.post("/psychologistRegistration", async (req, res) => {
    const getDetails = req.body;
    //console.log(req.body)
    const uuid = req.body.uuid;
    // Check patient identity
    if (!uuid) {
        res.send({ error: "Doctor is not Registered" });
        return;
    }

    // Connect to MySQL
    let sqlDB = mysql.connect();

    // Execute query
    sql = `SELECT id FROM doctors_registration WHERE uuid = "${uuid}"`;
    try {
        result = await mysql.query(sql);
    } catch (error) {
        console.log(error);
        res.send({ error: "Something wrong in MySQL." });
        return;
    }

    if (result.length != 1) {
        res.send({ error: "No patient matched in database." });
        return;
    }

    let dr_id = result[0].id;
    sql = "INSERT INTO `psychology_dr`(`dr_id`,`uuid`,`sex`,`language`, `treatment_setting`, `age_group`, `type_of_therapy`, `psychological_treatment`, `time_frame`, `frequency`, `cost`) VALUES ?";
    var VALUES = [
        [
            dr_id,
            uuid,
            getDetails.sex,
            getDetails.language,
            getDetails.treatment_setting,
            getDetails.age_group,
            getDetails.type_of_therapy,
            getDetails.psychological_treatment,
            getDetails.time_frame,
            getDetails.frequency,
            getDetails.cost,
        ],
    ];

    sqlDB.query(sql, [VALUES], (error, result) => {
        if (error) throw error;
        res.redirect("/thankyou");
    });
    sqlDB.end();
});
/* Psychology - code ended for logging info into database from psychology Questionnaire, also for finding the patient ID and showing results to the doctor. (Alexis McCreath Frangakis, Parisa Nikbakht)
   Group 8, Course-BMG5111, Winter 2023 */

// This API is for receiveing the basic info of the patient like age and gender.
router.post("/get_patientBasicHealthInfo", async (req, res) => {
    const phoneNumber = req.body.phoneNumber; // patient phone number, e.g. "6131230000"

    if (!phoneNumber) {
        res.send({ error: "Missing patient phone number" });
        return;
    }

    // Execute query
    sql = `SELECT Age, BloodGroup, Gender, height, weight FROM patients_registration WHERE MobileNumber = "${phoneNumber}"`;
    try {
        result = await mysql.query(sql);
    } catch (error) {
        console.log(error);
        res.send({ error: "Something wrong in MySQL." });
        return;
    }

    if (result.length != 1) {
        res.send({ error: "No patient matched in database." });
        return;
    }

    res.send({ success: result });
});

// This API is for updating the ML prediction result to the database.
router.post("/updateDisease", async (req, res) => {
    const phoneNumber = req.body.phoneNumber; // the patient phone number, e.g. "6131230000"
    const disease = req.body.disease; // the name of the disease, e.g. "pneumonia"
    const date = req.body.date; // the prediction date, e.g. "2023-03-01 09:00:00"
    const prediction = req.body.prediction; // the prediction result, "1" if disease, "0" otherwise
    const description = req.body.description; // more description of this disease, like the subtype of this disease.
    const accuracy = req.body.accuracy; // prediction accuracy, e.g. "90%"
    const recordType = req.body.recordType; // the type of the health test, e.g. "X-Ray" or "ecg"
    const recordId = req.body.recordId; // the id of the health test, e.g. "12", "640b68a96d5b6382c0a3df4c"

    if (!phoneNumber || !disease || !date || !prediction) {
        res.send({
            error: "Missing patient phone number, disease, date, or prediction.",
        });
        return;
    }

    // Execute query
    sql = `SELECT id FROM patients_registration WHERE MobileNumber = "${phoneNumber}"`;
    try {
        result = await mysql.query(sql);
    } catch (error) {
        console.log(error);
        res.send({ error: "Something wrong in MySQL." });
        return;
    }

    // Check patient result;
    if (result.length != 1) {
        res.send({ error: "No patient matched in database." });
        return;
    }

    let patient_id = result[0].id;

    // Execute query
    sql = `INSERT into ${disease} (patient_id, prediction_date, prediction, description, accuracy, record_type, record_id)
    VALUES (${patient_id}, "${date}", "${prediction}", ${description ? '"' + description + '"' : "NULL"
        }, ${accuracy ? '"' + accuracy + '"' : "NULL"}, ${recordType ? '"' + recordType + '"' : "NULL"
        }, ${recordId ? '"' + recordId + '"' : "NULL"})
    ON DUPLICATE KEY 
    UPDATE prediction_date = "${date}", 
    prediction = "${prediction}",
    description = ${description ? '"' + description + '"' : "NULL"},
    accuracy = ${accuracy ? '"' + accuracy + '"' : "NULL"},
    record_type = ${recordType ? '"' + recordType + '"' : "NULL"},
    record_id = ${recordId ? '"' + recordId + '"' : "NULL"};`;
    try {
        result = await mysql.query(sql);
    } catch (error) {
        console.log(error);
        res.send({ error: "Something wrong in MySQL." });
        return;
    }
    res.send({ success: "Submit success." });
});

// This is the MySQL health test search API
router.post("/healthTestRetrieveByPhoneNumber", async (req, res) => {
    const phoneNumber = req.body.phoneNumber; // patient phone number, e.g. "6131230000"
    const recordType = req.body.recordType; // the record type, e.g. "ecg", this represents the table name in the database

    // Check parameters
    if (!phoneNumber) {
        res.send({ error: "Missing patient phone number." });
        return;
    }
    if (!recordType) {
        res.send({ error: "Missing record type." });
        return;
    }

    // Execute query
    sql = `SELECT id FROM patients_registration WHERE MobileNumber = "${phoneNumber}"`;
    try {
        result = await mysql.query(sql);
    } catch (error) {
        console.log(error);
        res.send({ error: "Something wrong in MySQL." });
        sql.close();
        return;
    }

    // Check patient result
    if (result.length != 1) {
        res.send({ error: "No patient matched in database." });
        return;
    }

    let patient_id = result[0].id;

    // Execute query
    sql = `SELECT * FROM ${recordType} WHERE patient_id = "${patient_id}" ORDER BY RecordDate DESC`;
    try {
        result = await mysql.query(sql);
    } catch (error) {
        console.log(error);
        res.send({ error: "Something wrong in MySQL." });
        return;
    }

    // Remove sensitive column
    let temp = models.removeKey(result, "patient_id");
    res.send({ success: temp });
});

// This is a MongoDB import API
router.post("/imageUpload", upload.single("image"), async (req, res) => {
    const phoneNumber = req.body.phoneNumber; // patient phone number, e.g. "6131230000"
    const recordType = req.body.recordType; // the record type, e.g. "X-Ray", this represents the collection in the database (case sensitive)
    const recordDate = req.body.recordDate; // record date, e.g. "2023-03-01 09:00:00"

    // Check parameters
    if (!phoneNumber) {
        res.send({ error: "Missing patient phone number." });
        return;
    }
    if (!recordType || !recordDate) {
        res.send({ error: "Missing record type or record date." });
        return;
    }

    // Execute query
    sql = `SELECT id FROM patients_registration WHERE MobileNumber = "${phoneNumber}"`;
    try {
        result = await mysql.query(sql);
    } catch (error) {
        console.log(error);
        res.send({ error: "Something wrong in MySQL." });
        return;
    }

    // Check patient result
    if (result.length != 1) {
        res.send({ error: "No patient matched in database." });
        return;
    }

    let patient_id = result[0].id;

    const MongoResult = await models.imageUpload(
        patient_id,
        recordType,
        recordDate,
        req.file
    );
    res.send(MongoResult);
});

// This is the API for retrieving image from MongoDB by patient phone number
router.post("/imageRetrieveByPhoneNumber", async (req, res) => {
    const phoneNumber = req.body.phoneNumber; // patient phone number, e.g. "6131230000"
    const recordType = req.body.recordType; // the record type, e.g. "X-Ray", this represents the collection in the database (case sensitive)

    // Check parameters
    if (!phoneNumber) {
        res.send({ error: "Missing patient phone number." });
        return;
    }
    if (!recordType) {
        res.send({ error: "Missing record type." });
        return;
    }

    // Execute query
    sql = `SELECT id FROM patients_registration WHERE MobileNumber = "${phoneNumber}"`;
    try {
        result = await mysql.query(sql);
    } catch (error) {
        console.log(error);
        res.send({ error: "Something wrong in MySQL." });
        return;
    }

    // Check patient result
    if (result.length != 1) {
        res.send({ error: "No patient matched in database." });
        return;
    }

    let patient_id = result[0].id;

    const MongoResult = await models.imageRetrieveByPatientId(patient_id, recordType);
    res.send(MongoResult);
});

// This is the API for retrieving image from MongoDB by record id
router.post("/imageRetrieveByRecordId", async (req, res) => {
    const _id = req.body._id; // record id, e.g. "640b68a96d5b6382c0a3df4c"
    const recordType = req.body.recordType; // the record type, e.g. "X-Ray", this represents the collection in the database (case sensitive)

    // Check parameters
    if (!_id) {
        res.send({ error: "Missing record id." });
        return;
    }
    if (!recordType) {
        res.send({ error: "Missing record type." });
        return;
    }

    const MongoResult = await models.imageRetrieveByRecordId(_id, recordType);
    res.send(MongoResult);
});

// This is a connection testing api
router.post("/connectionTesting", upload.single("image"), (req, res) => {
    console.log("Request received by test api.");
    console.log(req.file);
    console.log(req.body);
    if (req.file) {
        res.send({
            prediction: "0",
            description: "File received by test api.",
            accuracy: "100%",
        });
    } else {
        res.send({
            prediction: "0",
            description: "Request received by test api.",
            accuracy: "100%",
        });
    }
});

module.exports = router;