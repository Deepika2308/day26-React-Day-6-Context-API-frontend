import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import {Modal} from 'react-bootstrap';
import {API} from "./global.js";

export function CreateMarks() {
  let navigate = useNavigate();
  let [students, setStudents] = useState([]);
  let [show,setShow] =useState(false);
  let[msg,setMsg] = useState("");

  //fetch all students
  useEffect(() => {
    fetch(`${API}/getAllStudents`)
      .then((response) => response.json())
      .then((data) => {
        if (data.hasOwnProperty("error")) {
          console.log(data.error);
        } else {
          setStudents(data.msg);
        }
      });
  },[]);

  let formValidation = yup.object({
    studentId:yup.string().required().notOneOf(["select"]),
    term:yup.string().required().oneOf(["quarterly","halfyearly","annual"]),
    subject:yup.string().required().notOneOf(["select"]),
    marks: yup.number().positive().required(),
  });

  let { values, handleChange, handleSubmit, errors, touched} = useFormik({
    initialValues: { studentId: "", term: "", subject: "", marks: "" },
    validationSchema: formValidation,
    onSubmit: (values) => {
      let storeMarks ={
        term:values.term,
        subject:values.subject,
        marks:values.marks
      }
      //to store marks in to student's record in db
      fetch(`${API}/storeMarks/${values.studentId}`,{
        method:"PUT",
        body:JSON.stringify(storeMarks),
        headers:{"content-type":"application/json"},
      })
      .then(response => response.json())
      .then(data => {
        if(data.modifiedCount){
          setShow(true);
          setMsg("Mark inserted successfully!!");
        }
        else{
          setShow(true);
          setMsg("Error is inserting marks !!");
        }
      })
    },
  });


  return (
    // enter the annual half yearly quarterly marks for each subject
    <form
      className="container d-flex flex-column gap-4 my-5"
      onSubmit={handleSubmit}
    >
      <h4 className="text-start">Marks Record</h4>
      {/* display students id in dropdown */}
      <select
        className="form-select"
        id="studentId"
        name="studentId"
        aria-label="studentId"
        value={values.studentId}
        onChange={handleChange}
      >
        <option value="">Select</option>
        {students.map((obj, index) => {
          return (
            <option value={obj.id} key={index}>
              {obj.id}
            </option>
          );
        })}
      </select>
      {errors.studentId && touched.studentId ? <div className="text-start text-danger">{errors.studentId}</div> :""}

      {/* display term in dropdown */}
      <select className="form-select" id="term" name="term" aria-label="terms" value={values.tern}
        onChange={handleChange}>
           <option value="select">Select</option>
        <option value="quarterly">Quarterly</option>
        <option value="halfyearly">Halfyearly</option>
        <option value="annual">Annual</option>
      </select>
      {errors.term && touched.term? <div className="text-start text-danger">{errors.term}</div> :""}

      {/* display subjects in dropdown */}
      <select
        className="form-select"
        id="subject"
        name="subject"
        aria-label="subjects"
        value={values.subject}
        onChange={handleChange}
      >
        <option value="select">Select</option>
        <option value="English">English</option>
        <option value="Lnaguage">Language</option>
        <option value="Physics">Physics</option>
        <option value="Chemistry">Chemistry</option>
        <option value="Math">Math</option>
        <option value="Biology">Biology</option>
        <option value="Zoology">Zoology</option>
        <option value="Computer">Computer Science</option>
      </select>
      {errors.subject && touched.subject ? <div className="text-start text-danger">{errors.subject}</div> : ""}

      <input
        className="form-control"
        type="number"
        id="marks"
        name="marks"
        placeholder="Marks out of 100"
        value={values.marks}
        onChange={handleChange}
      ></input>
      {errors.marks && touched.marks ? <div className="text-start text-danger">{errors.marks}</div> : ""}

      <div className="d-flex gap-5 justify-content-center">
        <button className="btn btn-primary" type="submit">
          Submit
        </button>
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => navigate("/")}
        >
          Home
        </button>
      </div>

        {/* popup modal to show message after successful/unsuccessful db insertion */}
        <Modal show={show}>
            <Modal.Body>
              <p>{msg}</p>
            </Modal.Body>
            <Modal.Footer>
              <button className="btn btn-danger" aria-label="Close" onClick={() => setShow(!show)}>
                Close
              </button>
            </Modal.Footer>
          </Modal>
    </form>
  );
}
