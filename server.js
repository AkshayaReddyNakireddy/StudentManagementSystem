const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = 3000;


// =========================================================
// CORS
// =========================================================

app.use((req, res, next) => {

    res.header(
        "Access-Control-Allow-Origin",
        "http://localhost:5173"
    );

    res.header(
        "Access-Control-Allow-Methods",
        "GET,POST,PUT,DELETE,OPTIONS"
    );

    res.header(
        "Access-Control-Allow-Headers",
        "Content-Type"
    );

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();
});


// Allow JSON data from React
app.use(express.json());


// =========================================================
// MONGODB CONNECTION
// =========================================================

const uri = "mongodb://127.0.0.1:27017";

const client = new MongoClient(uri);

const dbName = "akshaya_175641";


// =========================================================
// ALLOWED BRANCHES
// =========================================================

const allowedBranches = [
    "CSE",
    "EEE",
    "ECE",
    "MECH",
    "AERO",
    "CHEM"
];


// =========================================================
// GET - VIEW ALL STUDENTS
// =========================================================

app.get("/students", async (req, res) => {

    try {

        await client.connect();

        const db = client.db(dbName);

        const collection =
            db.collection("students");

        const students =
            await collection
                .find({})
                .toArray();

        res.json(students);

    } catch (error) {

        console.error(
            "GET ERROR:",
            error
        );

        res.status(500).json({
            message:
                "Error connecting to MongoDB"
        });
    }
});


// =========================================================
// POST - ADD STUDENT
// =========================================================

app.post("/students", async (req, res) => {

    try {

        await client.connect();

        const db = client.db(dbName);

        const collection =
            db.collection("students");


        // =====================================================
        // GET DATA FROM REQUEST
        // =====================================================

        const studentName =
            String(
                req.body.name || ""
            ).trim();


        const studentAge =
            Number(req.body.age);


        const studentBranch =
            String(
                req.body.branch || ""
            ).trim();


        const studentCgpa =
            Number(req.body.cgpa);


        // =====================================================
        // CHECK EMPTY FIELDS
        // =====================================================

        if (
            !studentName ||
            req.body.age === undefined ||
            !studentBranch ||
            req.body.cgpa === undefined
        ) {

            return res.status(400).json({

                message:
                    "Please fill all fields"

            });
        }


        // =====================================================
        // AGE VALIDATION
        // =====================================================

        if (
            !Number.isFinite(studentAge) ||
            studentAge < 16 ||
            studentAge > 25
        ) {

            return res.status(400).json({

                message:
                    "Age must be between 16 and 25"

            });
        }


        // =====================================================
        // BRANCH VALIDATION
        // =====================================================

        if (
            !allowedBranches.includes(
                studentBranch
            )
        ) {

            return res.status(400).json({

                message:
                    "Please select a valid branch"

            });
        }


        // =====================================================
        // CGPA VALIDATION
        // =====================================================

        if (
            !Number.isFinite(studentCgpa) ||
            studentCgpa < 1 ||
            studentCgpa > 10
        ) {

            return res.status(400).json({

                message:
                    "CGPA must be between 1 and 10"

            });
        }


        // =====================================================
        // DUPLICATE NAME CHECK
        // Case-insensitive
        // =====================================================

        const existingStudent =
            await collection.findOne({

                name: {
                    $regex:
                        `^${studentName.replace(
                            /[.*+?^${}()|[\]\\]/g,
                            "\\$&"
                        )}$`,

                    $options: "i"
                }

            });


        if (existingStudent) {

            return res.status(400).json({

                message:
                    "A student with this name already exists!"

            });
        }


        // =====================================================
        // INSERT STUDENT
        // =====================================================

        const result =
            await collection.insertOne({

                name:
                    studentName,

                age:
                    studentAge,

                branch:
                    studentBranch,

                cgpa:
                    studentCgpa

            });


        // =====================================================
        // SUCCESS RESPONSE
        // =====================================================

        res.status(201).json({

            message:
                "Student added successfully",

            insertedId:
                result.insertedId

        });

    } catch (error) {

        console.error(
            "POST ERROR:",
            error
        );

        res.status(500).json({

            message:
                "Error adding student"

        });
    }
});


// =========================================================
// PUT - UPDATE AGE ONLY
// =========================================================

app.put(
    "/students/:name/age",
    async (req, res) => {

        try {

            await client.connect();

            const db =
                client.db(dbName);

            const collection =
                db.collection("students");


            // =================================================
            // GET STUDENT NAME
            // =================================================

            const studentName =
                decodeURIComponent(
                    req.params.name
                ).trim();


            // =================================================
            // GET NEW AGE
            // =================================================

            const newAge =
                Number(req.body.age);


            // =================================================
            // AGE VALIDATION
            // =================================================

            if (
                !Number.isFinite(newAge) ||
                newAge < 16 ||
                newAge > 25
            ) {

                return res.status(400).json({

                    message:
                        "Age must be between 16 and 25"

                });
            }


            // =================================================
            // UPDATE AGE ONLY
            // =================================================

            const result =
                await collection.updateOne(

                    {
                        name:
                            studentName
                    },

                    {
                        $set: {
                            age:
                                newAge
                        }
                    }

                );


            // =================================================
            // STUDENT NOT FOUND
            // =================================================

            if (
                result.matchedCount === 0
            ) {

                return res.status(404).json({

                    message:
                        "Student not found",

                    searchedName:
                        studentName

                });
            }


            // =================================================
            // SUCCESS
            // =================================================

            res.json({

                message:
                    "Student age updated successfully"

            });

        } catch (error) {

            console.error(
                "UPDATE AGE ERROR:",
                error
            );

            res.status(500).json({

                message:
                    "Error updating age"

            });
        }
    }
);


// =========================================================
// PUT - UPDATE BRANCH ONLY
// =========================================================

app.put(
    "/students/:name/branch",
    async (req, res) => {

        try {

            await client.connect();

            const db =
                client.db(dbName);

            const collection =
                db.collection("students");


            // =================================================
            // GET STUDENT NAME
            // =================================================

            const studentName =
                decodeURIComponent(
                    req.params.name
                ).trim();


            // =================================================
            // GET NEW BRANCH
            // =================================================

            const newBranch =
                String(
                    req.body.branch || ""
                ).trim();


            // =================================================
            // BRANCH VALIDATION
            // =================================================

            if (
                !allowedBranches.includes(
                    newBranch
                )
            ) {

                return res.status(400).json({

                    message:
                        "Please select a valid branch"

                });
            }


            // =================================================
            // UPDATE BRANCH ONLY
            // =================================================

            const result =
                await collection.updateOne(

                    {
                        name:
                            studentName
                    },

                    {
                        $set: {
                            branch:
                                newBranch
                        }
                    }

                );


            // =================================================
            // STUDENT NOT FOUND
            // =================================================

            if (
                result.matchedCount === 0
            ) {

                return res.status(404).json({

                    message:
                        "Student not found",

                    searchedName:
                        studentName

                });
            }


            // =================================================
            // SUCCESS
            // =================================================

            res.json({

                message:
                    "Student branch updated successfully"

            });

        } catch (error) {

            console.error(
                "UPDATE BRANCH ERROR:",
                error
            );

            res.status(500).json({

                message:
                    "Error updating branch"

            });
        }
    }
);


// =========================================================
// PUT - UPDATE CGPA ONLY
// =========================================================

app.put(
    "/students/:name/cgpa",
    async (req, res) => {

        try {

            await client.connect();

            const db =
                client.db(dbName);

            const collection =
                db.collection("students");


            // =================================================
            // GET STUDENT NAME
            // =================================================

            const studentName =
                decodeURIComponent(
                    req.params.name
                ).trim();


            // =================================================
            // GET NEW CGPA
            // =================================================

            const newCgpa =
                Number(req.body.cgpa);


            // =================================================
            // CGPA VALIDATION
            // =================================================

            if (
                !Number.isFinite(newCgpa) ||
                newCgpa < 1 ||
                newCgpa > 10
            ) {

                return res.status(400).json({

                    message:
                        "CGPA must be between 1 and 10"

                });
            }


            // =================================================
            // UPDATE CGPA ONLY
            // =================================================

            const result =
                await collection.updateOne(

                    {
                        name:
                            studentName
                    },

                    {
                        $set: {
                            cgpa:
                                newCgpa
                        }
                    }

                );


            // =================================================
            // STUDENT NOT FOUND
            // =================================================

            if (
                result.matchedCount === 0
            ) {

                return res.status(404).json({

                    message:
                        "Student not found",

                    searchedName:
                        studentName

                });
            }


            // =================================================
            // SUCCESS
            // =================================================

            res.json({

                message:
                    "Student CGPA updated successfully"

            });

        } catch (error) {

            console.error(
                "UPDATE CGPA ERROR:",
                error
            );

            res.status(500).json({

                message:
                    "Error updating CGPA"

            });
        }
    }
);


// =========================================================
// DELETE - DELETE STUDENT
// =========================================================

app.delete(
    "/students/:name",
    async (req, res) => {

        try {

            await client.connect();

            const db =
                client.db(dbName);

            const collection =
                db.collection("students");


            // =================================================
            // GET STUDENT NAME
            // =================================================

            const studentName =
                decodeURIComponent(
                    req.params.name
                ).trim();


            // =================================================
            // DELETE
            // =================================================

            const result =
                await collection.deleteOne({

                    name:
                        studentName

                });


            // =================================================
            // STUDENT NOT FOUND
            // =================================================

            if (
                result.deletedCount === 0
            ) {

                return res.status(404).json({

                    message:
                        "Student not found",

                    searchedName:
                        studentName

                });
            }


            // =================================================
            // SUCCESS
            // =================================================

            res.json({

                message:
                    "Student deleted successfully"

            });

        } catch (error) {

            console.error(
                "DELETE ERROR:",
                error
            );

            res.status(500).json({

                message:
                    "Error deleting student"

            });
        }
    }
);


// =========================================================
// TEST PUT ROUTE
// =========================================================

app.put("/test", (req, res) => {

    console.log(
        "PUT TEST ROUTE WORKING"
    );

    res.json({

        message:
            "PUT route is working"

    });
});


// =========================================================
// START SERVER
// =========================================================

app.listen(
    PORT,
    () => {

        console.log(
            `Server running on port ${PORT}`
        );

        console.log(
            `Allowed branches: ${allowedBranches.join(", ")}`
        );

    }
);