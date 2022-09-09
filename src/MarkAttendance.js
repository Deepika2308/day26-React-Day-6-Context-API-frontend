import DatePicker from "react-multi-date-picker"
import "bootstrap/dist/css/bootstrap.min.css";
import {useNavigate} from 'react-router-dom';
import {useState,useEffect} from 'react';
import {API} from "./global.js";

const format="YYYY/MM/DD";

export function MarkAttendance(){
    
    let navigate = useNavigate();
    let[dates,setDates] = useState([]);
    let[students,setStudents] = useState([]);
    let[selectedStudent,setSelectedStudent] = useState("");
    let[msg,setMsg] = useState("");

    //get all students id from db to load in the dropdown
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

      function handleChange(e){
        setSelectedStudent(e.target.value);
      }

    function handleSubmit(e){
        e.preventDefault();
        let absentDates = dates.map((date) => {
            // format to YYYY/MM/DD
           return date.format() 
        })

        let obj ={
            absentDates:absentDates
        }

        fetch(`${API}/markAttendance/${selectedStudent}`,{
            method:"PUT",
            body:JSON.stringify(obj),
            headers:{"content-type":"application/json"},
        })
        .then(response => response.json())
        .then(data => {
            if(data.msg.modifiedCount){
                setMsg("Record updated successfully");
                setDates([]);
                setSelectedStudent("");
            }
        })
    }

    return(
        <form className="container w-50 my-5 d-flex flex-column gap-5 justify-content-center" onSubmit={handleSubmit}>
            <h5>Mark Absence</h5>
            {msg ? <div className="text-success">{msg}</div> :""}
            {/* student dropdown */}
            <select className="form-select" id="studentId" name="studentId" value={selectedStudent} onChange={handleChange} required>
                    <option value="select">Select</option>
                    {students.map((obj,index) => {
                        return <option key={index} value={obj.id}>{obj.id}</option>
                    })}
                </select>
            <div className="container d-flex gap-4 justify-content-center">
            {/* display calendar to select absence dates */}
            {/* multiple date can be selected dates are stored in ascending order */}
            <div><DatePicker value={dates} onChange={setDates} format={format} placeholder="click here" multiple sort required /></div>
            <button className="btn btn-primary btn-sm" type="submit">Submit</button>
            <button className="btn btn-primary btn-sm" type="button" onClick={() => navigate("/")}>Cancel</button>
            </div>
            
        </form>
    )
}