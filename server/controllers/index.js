var express = require("express");
var router = express.Router();
var mysql = require("../models/dbConnection");
var sql = "";

// ------------------------------ Pages Configuration ------------------------------

router.get("/", (req, res) => {
    res.render("pages-new/landing-page"); /* New Landing page*/
});

/* To call landing page*/
router.get("/landing-page", (req, res) => {
    res.render("pages-new/landing-page");
});

router.get("/index", (req, res) => {
    res.render("pages-new/index");
});

/* To call under-developement page*/
router.get("/under-developement", (req, res) => {
    res.render("pages-new/under-developement");
});

router.get("/symptom-checker-dashboard", (req, res) => {
    res.render("pages/symptom-checker-dashboard");
});

router.get("/widget", (req, res) => {
    //Christina&Sanika
    res.render("pages/widget");
});

router.get("/chatbot", (req, res) => {
    const cookie = req.cookies["e-hospital"];
    if (cookie == null) {
        console.log("Cookie expired.");
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
    res.render("pages-new/chatbot");
});

router.get("/about", (req, res) => {
    res.render("pages/about-us");
});

router.get("/Contact", (req, res) => {
    res.render("pages/contact-us");
});

router.get("/thankyou", (req, res) => {
    res.render("pages/thankyou");
});

router.get("/post", (req, res) => {
    res.render("pages/post");
});

router.get("/contact-us", (req, res) => {
    res.render("pages/contact-us");
});

// ------------------------------ APIs Configuration ------------------------------

router.post("/send-contact-form", (req, res) => {
    const SENDER_EMAIL = "ehospital23@gmail.com";
    const SENDER_PASS = "bozsyftcnmqhokte";

    const RECEIVER_NAME = req.body.userName;
    const RECEIVER_EMAIL = req.body.userEmail;
    const PHONE_NUMBER = req.body.phoneNumber;
    const USER_MESSAGE = req.body.userMessage;

    let VALID_INPUTS = true;

    if (
        Boolean(!RECEIVER_NAME) ||
        Boolean(!RECEIVER_EMAIL) ||
        Boolean(!USER_MESSAGE)
    ) {
        VALID_INPUTS = false;
    }

    // Store request to database
    if (VALID_INPUTS) {
        let sqlDB = mysql.connect();
        sql = `INSERT INTO contact_us (name, email, phoneNumber, message) VALUES ("${RECEIVER_NAME}", "${RECEIVER_EMAIL}", "${PHONE_NUMBER}", "${USER_MESSAGE}")`;
        console.log(sql);
        sqlDB.query(sql, (error, result) => {
            if (error) {
                res.send(`
          <script>alert("An error occured while sending. Error message: ${error.sqlMessage}"); 
            window.location.href = "/contact-us";
          </script>`);

                return;
            }
            if (result.affectedRows != 1) {
                res.send(`
          <script>alert("Sorry, an error occured in the database. Please contact the site admin."); 
            window.location.href = "/contact-us";
          </script>`);
                return;
            }
        });
        sqlDB.end();
    }

    // Function to call to nodemailer
    if (VALID_INPUTS) {
        const nodeMailer = require("nodemailer");
        const html = `
        <h3> E-Hospital: Your contact us response </h3>
        <p> Hi ${RECEIVER_NAME}, </p>
        <br>
        Thank you for your email. This is to notify you that we have received your contact-us query.
        We will respond in 3-5 business days. The following is the query for your records.
        <br>
        <p> Name: ${RECEIVER_NAME} </p>
        <p> Email: ${RECEIVER_EMAIL} </p>
        <p> Phone: ${PHONE_NUMBER} </p>
        <p> Message: ${USER_MESSAGE} </p>
      `;

        // Respond to the request and alert the user.
        res.send(`
      <script>alert("Thank you ${RECEIVER_NAME}. Your response has been recorded."); 
        window.location.href = "/contact-us";
      </script>`);

        async function main() {
            const transporter = nodeMailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                auth: {
                    user: SENDER_EMAIL,
                    pass: SENDER_PASS,
                },
                tls: {
                    rejectUnauthorized: false,
                },
            });

            const info = await transporter.sendMail({
                from: SENDER_EMAIL,
                to: RECEIVER_EMAIL,
                subject: "Your Contact Us Query to E-Hospital",
                html: html,
            });
            console.log("Message sent: " + info.messageId);
        }

        main().catch((e) => {
            console.log(e);
        });
    } else {
        // Respond to the user that inputs are invalid
        res.send(`
      <script>alert("Your inputs are invalid. Make sure that every field is filled."); 
        window.location.href = "/contact-us";
      </script>`);
    }
});

/* notification widget, backend api code started for adding route to index (Team-member1-Christina, Team-member2-Sanika), BMG5109H, 2nd term-1stYear */
router.get("/get_availableDoctors", (req, res) => {
    let sqlDB = mysql.connect();
    sql =
        "SELECT Specialization, COUNT(Specialization) AS 'NumberOfDoctors' FROM doctors_registration WHERE Availability = 1 AND verification = 1 GROUP BY Specialization";
    sqlDB.query(sql, (error, result) => {
        if (error) {
            res.send({ error: error.sqlMessage });
            return;
        }
        res.send(result);
    });
    sqlDB.end();
});
/* find a dentist, backend api code ended for adding route to services (Team-member1-Christina, Team-member2-Sanika), BMG5109H, 2nd term-1stYear */

/* find a dentist, backend api code started for adding route to services (Team-member1-Christina, Team-member2-Sanika), BMG5109H, 2nd term-1stYear */
router.post("/get_availableDentists", (req, res) => {
    const Province = req.body.Province;
    const Country = req.body.Country;
    const City = req.body.City;
    console.log(req.body);

    let sqlDB = mysql.connect();
    //sql = "SELECT Fname, Mname, Lname, Specialization, MobileNumber, Location1, Location2, City, Province, Country, PostalCode, Availability FROM doctors_registration WHERE Specialization = 'Dentist' AND Availability = 1";
    sql = `SELECT Fname, Mname, Lname, Specialization, MobileNumber, Location1, Location2, City, Province, Country, PostalCode, Availability FROM doctors_registration WHERE Specialization = 'Dentist' AND Availability = 1 AND Province = "${Province}" AND Country = "${Country}" AND City = "${City}"  `;
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
/* find a dentist, backenf api code ended for adding route to services (Team-member1-Christina, Team-member2-Sanika), BMG5109H, 2nd term-1stYear */

router.get("/get_doctorsList", async (req, res) => {
    // Execute query
    sql =
        "SELECT Fname, Mname, Lname, Age, Gender, MobileNumber, EmailId, Location1, Location2, City, Province, Country, PostalCode, Specialization FROM doctors_registration WHERE Availability = 1 AND verification = 1 ORDER BY Specialization";
    try {
        result = await mysql.query(sql);
    } catch (error) {
        console.log(error);
        res.send({ error: "Something wrong in MySQL." });
        return;
    }
    res.send({ success: result });
});

//christina&sanika
router.route("/ajax").post(function (req, res) {
    res.send({ response: req.body.Country });
    console.log("success");
    console.log(req.body);
    console.log(req.body.Country);
});
//christina&sanika

module.exports = router;