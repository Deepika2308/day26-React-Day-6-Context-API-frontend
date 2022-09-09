import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import './styles.css';
import {useState,useEffect}  from 'react';
import {useNavigate} from 'react-router';
import {API} from "./global.js";

//called when student option from dropdwon is clicked
function StudentDetails(){
    let[marks,setMarks] = useState(true);
    let[attendance,setAttendance] = useState(false);
    let[students,setStudents] = useState([]);

    let navigate = useNavigate();

    //fetch all student records form db
    useEffect(() => {
        fetch(`${API}/getAllStudents`)
        .then(response => response.json())
        .then(data => {
            if(!data.hasOwnProperty('error'))
            setStudents(data.msg);
        })
    },[])

    return(
        <div>
            <div className="d-flex gap-1">
            <div className="marks"><div onClick={() =>{
                setMarks(true);
                setAttendance(false);
            }}>Marks</div></div>
            <div className="attendance"><div onClick={() =>{
                setMarks(false);
                setAttendance(true);
            } }>Attendance</div></div>
        </div>
        
        {/* display student's marks */}
        {marks ? <StudentMarkDetails students={students} /> :""}

        {/* display student's attendance */}
        {attendance ? <StudentAttendanceDetails students={students} /> :""}

        <button className="btn btn-primary" type="button" onClick={() => navigate("/")}>Home</button>
        </div>
    )
}


// display quarterly halfyearly and annual marks
function StudentMarkDetails({students}){
let[selectedStudent,setSelectedStudent] = useState("");
let[quarterly,setQuarterly] = useState([]);
let[halfyearly,setHalfyearly] = useState([]);
let[annual,setAnnual] = useState([]);

function handleChange(e){
    setQuarterly([]);
    setHalfyearly([]);
    setAnnual([]);

    setSelectedStudent(e.target.value);
    let stud = e.target.value;
    if(stud !== "select"){
        fetch(`${API}/getStudentDetails/${stud}`)
    .then(response => response.json())
    .then(data => {
        let marks= data.msg;
        
        if(marks.hasOwnProperty('Quarterly')){
            let qMarks = marks.Quarterly;
            setQuarterly(qMarks);
        }
        if(marks.hasOwnProperty('Halfyearly')){
            setHalfyearly(marks.Halfyearly);
        }
        if(marks.hasOwnProperty('Annual')){
            setAnnual(marks.Annual);
        }
    })
    }
}

    return(
        <div className="container w-25 m-auto my-5">
            <h4>Term Marks</h4>
            <select className="form-control" id="student" name="student" value={selectedStudent} onChange={handleChange}>
                <option value="select">Select</option>
                {students.map((obj,index) => {
                    return <option value={obj.id} key={index}>{obj.id}</option>
                })}
            </select>

            {/* display quarterly marks */}
            {quarterly.length>0 ? <div className="my-5">
                <h5>Quarterly Marks</h5>
                <ol>
                {quarterly.map((obj,index) => {
                    return <li key={index}>{`${obj.subject} - ${obj.marks}`}</li>
                })}
                </ol>
            </div> :""}

             {/* display halfyearly marks */}
            {halfyearly.length>0 ? <div className="my-5">
                <h5>Halfyearly Marks</h5>
                <ol>
                {halfyearly.map((obj,index) => {
                    return <li key={index}>{`${obj.subject} - ${obj.marks}`}</li>
                })}
                </ol>
            </div> :""}

            {/* display annual marks */}
            {annual.length > 0 ? <div>
                <h5>Annual Marks</h5>
                <ol>
                {annual.map((obj,index) => {
                    return <li>{`${obj.subject} - ${obj.marks}`}</li>
                })}
                </ol>
            </div> :""}

        </div>
    )
}

function StudentAttendanceDetails({students}){
    let[selectedStudent,setSelectedStudent] = useState("");
    let[absentDates,setAbsentDates] = useState([]);

    function handleChange(e){
        setAbsentDates([]);
        let arr =[];
        setSelectedStudent(e.target.value);
        let stud = e.target.value;
        // fetch a student record
        if(stud !== "select"){
            fetch(`${API}/getStudentDetails/${stud}`)
        .then(response => response.json())
        .then(data => {
        
            let res = data.msg;
            let absDates = [];
            if(res.hasOwnProperty('absentDates')){
                absDates = data.msg.absentDates;

                //    read array of array and store the absentDates
                   for(let i=0;i<absDates.length;i++){
                    if(absDates[i].length >0){
                        let temp =absDates[i];
                        console.log(temp);
                        for(let j=0;j<temp.length;j++){
                            arr.push(temp[j]);
                        }
                    }
                   }
            }
           setAbsentDates(arr);
        })
        }
    }

    return(
        <div className="container w-25 m-auto my-5">
            <h4>Absence Records</h4>
        <select className="form-control" id="student" name="student" value={selectedStudent} onChange={handleChange}>
            <option value="select">Select</option>
            {/* dropdown to select student */}
            {students.map((obj,index) => {
                return <option value={obj.id} key={index}>{obj.id}</option>
            })}
        </select>

        {absentDates.length>0 ? <div className="my-3">
            <ol>
            {
                // display absent dates
            absentDates.map((date,index) => {
                return <li key={index}>{date}</li>
            })
            }</ol></div> :<div className="my-3">No Absence</div>}
    </div>
    )
}

export {StudentDetails,StudentMarkDetails,StudentAttendanceDetails};
