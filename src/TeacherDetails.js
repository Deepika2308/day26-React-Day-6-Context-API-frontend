import {useState,useEffect} from 'react';
import {useNavigate} from 'react-router';

export function TeacherDetails(){
    let navigate = useNavigate();

    let[teachers,setTeachers] = useState([]);
    let[selectedTeacher,setSelectedTeacher] = useState("");
    let[subjectHandled,setSubjectHandled] = useState("");
    let[classes,setClasses] = useState([]);

    // set the class section selected from dropdown
    let[selectedClassSection,setSelectedClassSection] = useState('select');

    //store the students from selected section
    let[selectedClassStudents,setSelectedClassStudents] = useState([]);

    useEffect(() => {
        fetch("http://127.0.0.1:4700/getAllTeachers")
        .then(response => response.json())
        .then(data => {
            if(data.hasOwnProperty('error')){
                console.log(data.error);
            }
            else{
                setTeachers(data.msg);
            }
            
        })
    })

    function handleChange(e){
        //clearing subject and sections for each change
        setSubjectHandled("");
        setClasses([]);
        setSelectedTeacher(e.target.value);
        let teacher = e.target.value;

        fetch(`http://127.0.0.1:4700/getClasses/${teacher}`)
        .then(response => response.json())
        .then(data => {
            if(data.hasOwnProperty('msg')){
                let classes = data.msg.classSection;
                let sub = data.msg.subject;
                
                setSubjectHandled(sub);
                setClasses(classes);
            }
        })
    }
    function handleClassChange(e){
        setSelectedClassSection("")
        setSelectedClassSection(e.target.value);
        let selectedClass = e.target.value;

        fetch(`http://127.0.0.1:4700/getClassStudents/${selectedClass}`)
        .then(response => response.json())
        .then(data => {
            if(data.hasOwnProperty('error')){
                console.log("No student found");
            }
            else{
                setSelectedClassStudents(data.msg);
            }
        })
    }

    return(
        <form className="container w-25 m-auto my-5 d-flex flex-column gap-4">
            Sections handled by 
            <select className="form-select" id="teachers" name="teachers" value={selectedTeacher} onChange={handleChange}>
                <option value="select">Select</option>
                {
                    // select teacher dropdown
                    teachers.map((obj,index) => {
                        return <option key={index} value={obj.id}>{obj.id}</option>
                    })
                }
            </select>
            <div>{subjectHandled ? ` Subject : ${subjectHandled}` : " Subject : -"}</div>
            <select className="form-select" id="classSection" name="classSection" value={selectedClassSection} onChange={handleClassChange} >
                <option value="select">Select</option>
                {
                    // classes and sections dropdown
                    classes.map((obj,index) => {
                        return <option key={index} value={obj}>{obj}</option>
                    })
                }
            </select>
                

            {/* display all students from particular class and section */}
            {selectedClassStudents.length > 0 ? <ol>
                {selectedClassStudents.map((obj,index) => {
                    return <li key={index}>{obj.name}</li>
                })}
            </ol> : selectedClassSection === 'select' ? "" : <div>No student found</div>}    

            <button className="btn btn-primary mt-5" type="button" onClick={() => navigate("/")}>Home</button>
        
        </form>
    )
}