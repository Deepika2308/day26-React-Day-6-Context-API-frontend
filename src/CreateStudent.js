import "bootstrap/dist/css/bootstrap.min.css";
import { ClassSections } from "./SectionModel";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {useFormik} from 'formik';
import {useState} from 'react';
import * as yup from 'yup';
import {Modal} from 'react-bootstrap';
import {ShowBufferImg} from './ShowBuffer';
import {API} from "./global.js";

//create student form
export function CreateStudent() {

      //to shoe Modal after creating teacher
      let[show,setShow] = useState(false);
      //setting message depending on the db result
      let[msg,setMsg] = useState("");
      let[bufferImg,setBufferImg] = useState(false);

  let formValidation = yup.object({
    id:yup.string().required("Required!!"),
    name:yup.string().required("Required!!"),
    classSection:yup.string().notOneOf(["select"]).required(),
    attendance:yup.number().positive().lessThan(101).required("Required!!"),
  })

  let {values,handleSubmit,handleChange,errors,touched} = useFormik({
    initialValues:{id:"",name:"",classSection:"",attendance:""},
    validationSchema:formValidation,
    onSubmit:(values) =>{
      fetch(`${API}/createStudent`,{
                method:"POST",
                body:JSON.stringify(values),
                headers:{"content-type":"application/json"},
            })
            .then(response => response.json())
            .then(data => {
                if(data.hasOwnProperty('error')){
                    // make buffer false so loading stops just before modal popsup
                    setBufferImg(false);
                    setShow(true);
                    setMsg(data.error);
                }
                else{
                    setBufferImg(false);
                    setShow(true);
                    setMsg("Account has been created successfully!!");
                }
            })
    }
  })

  let navigate = useNavigate();
  return (
    <form className="container my-5 d-flex flex-column gap-4 w-50 m-auto" onSubmit={handleSubmit}>
      <h4 className="text-start">Create Student</h4>
      {bufferImg ? <ShowBufferImg /> : ""}
      <div className="d-flex gap-5 justify-content-center">
        <Link to="/createMarks">Create Marks</Link>
        <Link to="/markAttendance">Mark Attendance</Link>
      </div>

      <input
        className="form-control"
        type="text"
        id="id"
        name="id"
        placeholder="ID"
        value={values.id}
        onChange={handleChange}
      ></input>
      {errors.id && touched.id ? <div className="text-danger text-start">{errors.id}</div> :""}
      <input
        className="form-control"
        type="text"
        id="name"
        name="name"
        placeholder="Name"
        value={values.name}
        onChange={handleChange}
      ></input>
      {errors.name && touched.name ? <div className="text-danger text-start">{errors.name}</div> :""}
      <select
        className="form-select"
        id="classSection"
        name="classSection"
        aria-label="classSection"
        value={values.classSection}
        onChange={handleChange}
      >
        <option value="select">Select</option>
        {ClassSections.map((obj, index) => {
          return (
            <option value={obj.code} key={index}>
              {obj.value}
            </option>
          );
        })}
      </select>
      {errors.classSection && touched.classSection ? <div className="text-start text-danger">{errors.classSection}</div> :""}

      <input
        className="form-control"
        type="text"
        id="attendance"
        name="attendance"
        placeholder="Attendance in percentage"
        value={values.attendance}
        onChange={handleChange}
      ></input>
      {errors.attendance && touched.attendance ? <div className="text-danger text-start">{errors.attendance}</div> :""}
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

