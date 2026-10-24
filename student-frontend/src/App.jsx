import { useState } from "react";

function App() {

  // =========================================================
  // CONSTANTS
  // =========================================================

  const branches = [
    "CSE",
    "EEE",
    "ECE",
    "MECH",
    "AERO",
    "CHEM"
  ];


  // =========================================================
  // STUDENTS
  // =========================================================

  const [students, setStudents] = useState([]);


  // =========================================================
  // ADD STUDENT
  // =========================================================

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [branch, setBranch] = useState("");
  const [cgpa, setCgpa] = useState("");


  // =========================================================
  // INLINE UPDATE
  // =========================================================

  const [editingId, setEditingId] = useState(null);

  const [editAge, setEditAge] = useState("");
  const [editBranch, setEditBranch] = useState("");
  const [editCgpa, setEditCgpa] = useState("");


  // =========================================================
  // GET STUDENTS
  // =========================================================

  const getStudents = async () => {

    try {

      const response = await fetch(
        "http://localhost:3000/students"
      );

      const data = await response.json();

      if (!response.ok) {

        alert(
          data.message ||
          "Unable to fetch students"
        );

        return;
      }

      setStudents(data);

    } catch (error) {

      console.error(error);

      alert("Unable to fetch students");
    }
  };


  // =========================================================
  // ADD STUDENT
  // =========================================================

  const addStudent = async () => {

    // Check empty fields

    if (
      !name.trim() ||
      !age ||
      !branch ||
      !cgpa
    ) {

      alert("Please fill all fields");

      return;
    }


    // Age validation

    const ageNumber = Number(age);

    if (
      !Number.isInteger(ageNumber) ||
      ageNumber < 16 ||
      ageNumber > 25
    ) {

      alert(
        "Age must be between 16 and 25"
      );

      return;
    }


    // CGPA validation

    const cgpaNumber = Number(cgpa);

    if (
      !Number.isFinite(cgpaNumber) ||
      cgpaNumber < 1 ||
      cgpaNumber > 10
    ) {

      alert(
        "CGPA must be between 1 and 10"
      );

      return;
    }


    // Branch validation

    if (!branches.includes(branch)) {

      alert(
        "Please select a valid branch"
      );

      return;
    }


    // Duplicate name check

    const duplicateStudent =
      students.find(
        (student) =>
          student.name.trim().toLowerCase() ===
          name.trim().toLowerCase()
      );


    if (duplicateStudent) {

      alert(
        "A student with this name already exists!"
      );

      return;
    }


    try {

      const response = await fetch(
        "http://localhost:3000/students",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({

            name: name.trim(),

            age: ageNumber,

            branch: branch,

            cgpa: cgpaNumber

          })
        }
      );


      const data =
        await response.json();


      if (!response.ok) {

        alert(
          data.message ||
          "Error adding student"
        );

        return;
      }


      alert(
        "Student added successfully"
      );


      // Clear fields

      setName("");
      setAge("");
      setBranch("");
      setCgpa("");


      // Refresh table

      getStudents();

    } catch (error) {

      console.error(error);

      alert(
        "Unable to add student"
      );
    }
  };


  // =========================================================
  // START INLINE UPDATE
  // =========================================================

  const startEdit = (student) => {

    setEditingId(student._id);

    setEditAge(String(student.age));

    setEditBranch(student.branch);

    setEditCgpa(String(student.cgpa));
  };


  // =========================================================
  // CANCEL INLINE UPDATE
  // =========================================================

  const cancelEdit = () => {

    setEditingId(null);

    setEditAge("");

    setEditBranch("");

    setEditCgpa("");
  };


  // =========================================================
  // SAVE INLINE UPDATE
  // =========================================================

  const saveEdit = async (student) => {

    // =======================================================
    // AGE VALIDATION
    // =======================================================

    const newAge =
      Number(editAge);


    if (
      !Number.isInteger(newAge) ||
      newAge < 16 ||
      newAge > 25
    ) {

      alert(
        "Age must be between 16 and 25"
      );

      return;
    }


    // =======================================================
    // CGPA VALIDATION
    // =======================================================

    const newCgpa =
      Number(editCgpa);


    if (
      !Number.isFinite(newCgpa) ||
      newCgpa < 1 ||
      newCgpa > 10
    ) {

      alert(
        "CGPA must be between 1 and 10"
      );

      return;
    }


    // =======================================================
    // BRANCH VALIDATION
    // =======================================================

    if (!branches.includes(editBranch)) {

      alert(
        "Please select a valid branch"
      );

      return;
    }


    try {

      // =====================================================
      // UPDATE AGE
      // =====================================================

      const ageResponse = await fetch(

        `http://localhost:3000/students/${encodeURIComponent(
          student.name
        )}/age`,

        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            age: newAge
          })
        }
      );


      const ageData =
        await ageResponse.json();


      if (!ageResponse.ok) {

        alert(
          ageData.message ||
          "Unable to update age"
        );

        return;
      }


      // =====================================================
      // UPDATE BRANCH
      // =====================================================

      const branchResponse = await fetch(

        `http://localhost:3000/students/${encodeURIComponent(
          student.name
        )}/branch`,

        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            branch: editBranch
          })
        }
      );


      const branchData =
        await branchResponse.json();


      if (!branchResponse.ok) {

        alert(
          branchData.message ||
          "Unable to update branch"
        );

        return;
      }


      // =====================================================
      // UPDATE CGPA
      // =====================================================

      const cgpaResponse = await fetch(

        `http://localhost:3000/students/${encodeURIComponent(
          student.name
        )}/cgpa`,

        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            cgpa: newCgpa
          })
        }
      );


      const cgpaData =
        await cgpaResponse.json();


      if (!cgpaResponse.ok) {

        alert(
          cgpaData.message ||
          "Unable to update CGPA"
        );

        return;
      }


      // =====================================================
      // SUCCESS
      // =====================================================

      alert(
        "Student details updated successfully"
      );


      cancelEdit();

      getStudents();

    } catch (error) {

      console.error(error);

      alert(
        "Unable to update student"
      );
    }
  };


  // =========================================================
  // DELETE STUDENT
  // =========================================================

  const deleteStudent = async (student) => {

    const confirmDelete =
      window.confirm(
        `Are you sure you want to delete ${student.name}?`
      );


    if (!confirmDelete) {
      return;
    }


    try {

      const response = await fetch(

        `http://localhost:3000/students/${encodeURIComponent(
          student.name
        )}`,

        {
          method: "DELETE"
        }
      );


      const data =
        await response.json();


      if (!response.ok) {

        alert(
          data.message ||
          "Student not found"
        );

        return;
      }


      alert(
        "Student deleted successfully"
      );


      getStudents();

    } catch (error) {

      console.error(error);

      alert(
        "Unable to delete student"
      );
    }
  };


  // =========================================================
  // STYLES
  // =========================================================

  const inputStyle = {
    width: "100%",
    padding: "11px 12px",
    border: "1px solid #d8ccce",
    borderRadius: "8px",
    fontSize: "14px",
    boxSizing: "border-box",
    outline: "none",
    backgroundColor: "#fffafa",
    color: "#40383a"
  };


  const buttonStyle = {
    padding: "10px 18px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#96777d",
    color: "#fffafa",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer"
  };


  const cardStyle = {
    backgroundColor: "#fffafa",
    padding: "25px",
    borderRadius: "14px",
    boxShadow:
      "0 3px 12px rgba(80, 60, 60, 0.08)",
    border: "1px solid #d8ccce"
  };


  const tableInputStyle = {
    width: "100%",
    padding: "8px",
    border: "1px solid #c9aeb3",
    borderRadius: "6px",
    backgroundColor: "#fffafa",
    color: "#40383a",
    boxSizing: "border-box"
  };


  // =========================================================
  // UI
  // =========================================================

  return (

    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f3eeee",
        fontFamily: "Arial, sans-serif",
        color: "#40383a"
      }}
    >

      {/* =====================================================
          HEADER
          ===================================================== */}

      <header
        style={{
          backgroundColor: "#c9aeb3",
          color: "#40383a",
          padding: "25px 40px",
          boxShadow:
            "0 3px 10px rgba(80, 60, 60, 0.12)"
        }}
      >

        <div
          style={{
            maxWidth: "1200px",
            margin: "auto"
          }}
        >

          <h1
            style={{
              margin: 0,
              fontSize: "28px"
            }}
          >
            Student Management System
          </h1>

          <p
            style={{
              margin: "7px 0 0",
              opacity: "0.75",
              fontSize: "14px"
            }}
          >
            Manage student records easily
          </p>

        </div>

      </header>


      {/* =====================================================
          MAIN
          ===================================================== */}

      <main
        style={{
          maxWidth: "1200px",
          margin: "30px auto",
          padding: "0 20px"
        }}
      >


        {/* ===================================================
            VIEW STUDENTS
            =================================================== */}

        <section style={cardStyle}>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "15px"
            }}
          >

            <div>

              <h2
                style={{
                  margin: "0 0 5px"
                }}
              >
                Students
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "#76686b",
                  fontSize: "13px"
                }}
              >
                View and manage registered students
              </p>

            </div>


            <button
              onClick={getStudents}
              style={buttonStyle}
            >
              View Students
            </button>

          </div>


          {/* =================================================
              STUDENT TABLE
              ================================================= */}

          <div
            style={{
              marginTop: "22px",
              overflowX: "auto"
            }}
          >

            {students.length > 0 ? (

              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "14px"
                }}
              >

                <thead>

                  <tr
                    style={{
                      backgroundColor: "#eee5e6"
                    }}
                  >

                    <th
                      style={{
                        padding: "13px",
                        textAlign: "left",
                        borderBottom:
                          "2px solid #d8ccce"
                      }}
                    >
                      #
                    </th>

                    <th
                      style={{
                        padding: "13px",
                        textAlign: "left",
                        borderBottom:
                          "2px solid #d8ccce"
                      }}
                    >
                      Name
                    </th>

                    <th
                      style={{
                        padding: "13px",
                        textAlign: "left",
                        borderBottom:
                          "2px solid #d8ccce"
                      }}
                    >
                      Age
                    </th>

                    <th
                      style={{
                        padding: "13px",
                        textAlign: "left",
                        borderBottom:
                          "2px solid #d8ccce"
                      }}
                    >
                      Branch
                    </th>

                    <th
                      style={{
                        padding: "13px",
                        textAlign: "left",
                        borderBottom:
                          "2px solid #d8ccce"
                      }}
                    >
                      CGPA
                    </th>

                    <th
                      style={{
                        padding: "13px",
                        textAlign: "center",
                        borderBottom:
                          "2px solid #d8ccce"
                      }}
                    >
                      Actions
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {students.map(
                    (student, index) => {

                      const isEditing =
                        editingId === student._id;


                      return (

                        <tr
                          key={student._id}
                          style={{
                            borderBottom:
                              "1px solid #e2d8da",
                            backgroundColor:
                              isEditing
                                ? "#f5eeee"
                                : "transparent"
                          }}
                        >

                          {/* NUMBER */}

                          <td
                            style={{
                              padding: "13px",
                              color: "#8a797d"
                            }}
                          >
                            {index + 1}
                          </td>


                          {/* NAME */}

                          <td
                            style={{
                              padding: "13px",
                              fontWeight: "600"
                            }}
                          >
                            {student.name}
                          </td>


                          {/* =================================================
                              AGE
                              ================================================= */}

                          <td
                            style={{
                              padding: "10px"
                            }}
                          >

                            {isEditing ? (

                              <input
                                type="number"
                                min="16"
                                max="25"
                                value={editAge}
                                onChange={(e) =>
                                  setEditAge(
                                    e.target.value
                                  )
                                }
                                style={
                                  tableInputStyle
                                }
                              />

                            ) : (

                              student.age

                            )}

                          </td>


                          {/* =================================================
                              BRANCH
                              ================================================= */}

                          <td
                            style={{
                              padding: "10px"
                            }}
                          >

                            {isEditing ? (

                              <select
                                value={editBranch}
                                onChange={(e) =>
                                  setEditBranch(
                                    e.target.value
                                  )
                                }
                                style={
                                  tableInputStyle
                                }
                              >

                                {branches.map(
                                  (branchName) => (

                                    <option
                                      key={
                                        branchName
                                      }
                                      value={
                                        branchName
                                      }
                                    >
                                      {branchName}
                                    </option>

                                  )
                                )}

                              </select>

                            ) : (

                              <span
                                style={{
                                  backgroundColor:
                                    "#e8dcde",
                                  color:
                                    "#655256",
                                  padding:
                                    "5px 10px",
                                  borderRadius:
                                    "20px",
                                  fontSize:
                                    "12px",
                                  fontWeight:
                                    "600"
                                }}
                              >
                                {student.branch}
                              </span>

                            )}

                          </td>


                          {/* =================================================
                              CGPA
                              ================================================= */}

                          <td
                            style={{
                              padding: "10px"
                            }}
                          >

                            {isEditing ? (

                              <input
                                type="number"
                                min="1"
                                max="10"
                                step="0.01"
                                value={editCgpa}
                                onChange={(e) =>
                                  setEditCgpa(
                                    e.target.value
                                  )
                                }
                                style={
                                  tableInputStyle
                                }
                              />

                            ) : (

                              student.cgpa

                            )}

                          </td>


                          {/* =================================================
                              ACTIONS
                              ================================================= */}

                          <td
                            style={{
                              padding: "10px",
                              textAlign: "center",
                              whiteSpace:
                                "nowrap"
                            }}
                          >

                            {isEditing ? (

                              <>

                                <button
                                  onClick={() =>
                                    saveEdit(
                                      student
                                    )
                                  }
                                  style={{
                                    ...buttonStyle,
                                    padding:
                                      "7px 14px",
                                    fontSize:
                                      "12px",
                                    marginRight:
                                      "5px"
                                  }}
                                >
                                  Save
                                </button>


                                <button
                                  onClick={
                                    cancelEdit
                                  }
                                  style={{
                                    ...buttonStyle,
                                    padding:
                                      "7px 14px",
                                    fontSize:
                                      "12px",
                                    backgroundColor:
                                      "#e8dcde",
                                    color:
                                      "#5d4b4f"
                                  }}
                                >
                                  Cancel
                                </button>

                              </>

                            ) : (

                              <>

                                <button
                                  onClick={() =>
                                    startEdit(
                                      student
                                    )
                                  }
                                  style={{
                                    ...buttonStyle,
                                    padding:
                                      "7px 14px",
                                    fontSize:
                                      "12px",
                                    marginRight:
                                      "5px"
                                  }}
                                >
                                  Update
                                </button>


                                <button
                                  onClick={() =>
                                    deleteStudent(
                                      student
                                    )
                                  }
                                  style={{
                                    ...buttonStyle,
                                    padding:
                                      "7px 14px",
                                    fontSize:
                                      "12px",
                                    backgroundColor:
                                      "#a8878d"
                                  }}
                                >
                                  Delete
                                </button>

                              </>

                            )}

                          </td>

                        </tr>

                      );

                    }
                  )}

                </tbody>

              </table>

            ) : (

              <div
                style={{
                  textAlign: "center",
                  padding: "40px",
                  color: "#76686b"
                }}
              >

                <div
                  style={{
                    fontSize: "32px",
                    marginBottom: "10px"
                  }}
                >
                  📋
                </div>

                <p>
                  Click "View Students" to load
                  student records.
                </p>

              </div>

            )}

          </div>

        </section>


        {/* ===================================================
            ADD STUDENT
            =================================================== */}

        <section
          style={{
            ...cardStyle,
            marginTop: "25px"
          }}
        >

          <h2
            style={{
              marginTop: 0,
              marginBottom: "5px"
            }}
          >
            Add Student
          </h2>

          <p
            style={{
              color: "#76686b",
              fontSize: "13px",
              marginBottom: "20px"
            }}
          >
            Enter details to register a new student.
          </p>


          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "18px"
            }}
          >

            {/* NAME */}

            <div>

              <label>
                Name
              </label>

              <input
                type="text"
                placeholder="Enter student name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                style={{
                  ...inputStyle,
                  marginTop: "7px"
                }}
              />

            </div>


            {/* AGE */}

            <div>

              <label>
                Age
              </label>

              <input
                type="number"
                min="16"
                max="25"
                placeholder="16 - 25"
                value={age}
                onChange={(e) =>
                  setAge(e.target.value)
                }
                style={{
                  ...inputStyle,
                  marginTop: "7px"
                }}
              />

            </div>


            {/* BRANCH */}

            <div>

              <label>
                Branch
              </label>

              <select
                value={branch}
                onChange={(e) =>
                  setBranch(e.target.value)
                }
                style={{
                  ...inputStyle,
                  marginTop: "7px"
                }}
              >

                <option value="">
                  Select Branch
                </option>

                {branches.map(
                  (branchName) => (

                    <option
                      key={branchName}
                      value={branchName}
                    >
                      {branchName}
                    </option>

                  )
                )}

              </select>

            </div>


            {/* CGPA */}

            <div>

              <label>
                CGPA
              </label>

              <input
                type="number"
                min="1"
                max="10"
                step="0.01"
                placeholder="1 - 10"
                value={cgpa}
                onChange={(e) =>
                  setCgpa(e.target.value)
                }
                style={{
                  ...inputStyle,
                  marginTop: "7px"
                }}
              />

            </div>

          </div>


          <button
            onClick={addStudent}
            style={{
              ...buttonStyle,
              marginTop: "20px"
            }}
          >
            Add Student
          </button>

        </section>


        {/* =====================================================
            FOOTER
            ===================================================== */}

        <p
          style={{
            textAlign: "center",
            color: "#918285",
            fontSize: "12px",
            marginTop: "30px"
          }}
        >
          Student Management System • MongoDB + Node.js + React
        </p>

      </main>

    </div>
  );
}

export default App;