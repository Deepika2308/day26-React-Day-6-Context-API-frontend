import "bootstrap/dist/css/bootstrap.min.css";
import {ClassSections} from './SectionModel';
import {useNavigate} from 'react-router-dom';
import {useFormik} from 'formik';
import {useState} from 'react';
import * as yup from 'yup';
import {Modal} from 'react-bootstrap';
import {ShowBufferImg} from './ShowBuffer';

export function CreateTeacher(){
    let navigate = useNavigate();
    //to shoe Modal after creating teacher
    let[show,setShow] = useState(false);
    //setting message depending on the db result
    let[msg,setMsg] = useState("");
    let[bufferImg,setBufferImg] = useState(false);

    let[subject,setSubject] = useState("");

    let[classSections,setClassSections] = useState(ClassSections);

    let formValidation = yup.object({
        id:yup.string().required("Required!"),
        name:yup.string().required("Required!"),
        qualification:yup.string().required("Required!"),
        classSection:yup.array().min(1).required(),
    })


//get the setions allotted for physics already and do not show them in the classes and sections dropdown
    function checkSectionAvailability(e){
        setSubject(e.target.value);
        let sub = e.target.value;
        fetch(`http://127.0.0.1:4700/checkSectionAvailability/${sub}`)
        .then(response => response.json())
        .then(data => {
            if(data.length > 0){
                let allottedSections = data;

                // remove the allotted sections from the Class sections model
            let filter = ClassSections.filter((obj) => {
                return(!allottedSections.includes(obj.code))
            })

            setClassSections(filter);
            }
            else{
                setClassSections(ClassSections);
            }
        });
    }

    let {values,handleChange,handleSubmit,errors,touched} = useFormik({
        initialValues:{id:"",name:"",qualification:"",classSection:[]},
        validationSchema:formValidation,
        onSubmit:(values) =>{
            setBufferImg(true);

            values.subject=subject;

            fetch("http://127.0.0.1:4700/createTeacher",{
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
    });

   
    return(
        <form className="container my-5 d-flex flex-column gap-4 w-50 m-auto" onSubmit={handleSubmit}>
            <h4 className="text-start">Create Teacher</h4>
            {/* show loading image until modal is shown */}
            {bufferImg ? <ShowBufferImg /> : ""}

            <input className="form-control" type="text" id="id" name="id" placeholder="ID" value={values.id} onChange={handleChange}></input>
            {errors.id && touched.id ? <div className="text-danger text-start">{errors.id}</div> :""}
            <input className="form-control" type="text" id="name" name="name" placeholder="Name" value={values.name} onChange={handleChange}></input>
            {errors.name && touched.name ? <div className="text-danger text-start">{errors.name}</div> :""}
            <input className="form-control" type="text" id="qualification" name="qualification" placeholder="Qualification" value={values.qualification} onChange={handleChange}></input>
            {errors.qualification && touched.qualification ? <div className="text-danger text-start">{errors.qualification}</div> :""}

            {/* display subjects in dropdown */}
            <select className="form-select" id="subject" name="subject" aria-label="subjects" value={subject} onChange={checkSectionAvailability} required>
                <option value="">Select</option>
                <option value="English">English</option>
                <option value="Lnaguage">Language</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Math">Math</option>
                <option value="Biology">Biology</option>
                <option value="Zoology">Zoology</option>
                <option value="Computer">Computer Science</option>
            </select>
            {errors.subject ? <div className="text-start text-danger">{errors.subject}</div> :""}

            {/* display classes and sections from SectionModel js */}
            <select className="form-select" id="classSection" name="classSection" aria-label="classSection" value={values.classSection} onChange={handleChange} multiple>
                {classSections.map((obj,index) => {
                    return <option value={obj.code} key={index}>{obj.value}</option>
                })}
            </select>
            {errors.classSection && touched.classSection ? <div className="text-start text-danger">{errors.classSection}</div> :""}

            <div className="d-flex gap-5 justify-content-center">
            <button className="btn btn-primary" type="submit">Submit</button>
            <button className="btn btn-primary" type="button" onClick={() => navigate("/")}>Home</button>
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
    )
}


