import './App.css';
import {BrowserRouter, Link, Routes,Route} from 'react-router-dom';
import {CreateTeacher} from './CreateTeacher';
import {CreateStudent} from './CreateStudent';
import {CreateMarks} from './CreateMarks';
import {MarkAttendance} from './MarkAttendance';
import {TeacherDetails} from './TeacherDetails';
import {StudentDetails} from './StudentDetails';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<NavBar />}></Route>
        <Route exact path="/createTeacher" element={<CreateTeacher />}></Route>
        <Route exact path="/createStudent" element={<CreateStudent />}></Route>
        <Route exact path="/createMarks" element={<CreateMarks />}></Route>
        <Route exact path="/markAttendance" element={<MarkAttendance />}></Route>
        <Route exact path="/teacherDetails" element={<TeacherDetails />}></Route>
        <Route exact path="/studentDetails" element={<StudentDetails />}></Route>
        {/* <Route exact path="/marks" element={<StudentMarkDetails />}></Route>
        <Route exact path="/attendance" element={<StudentAttendanceDetails />}></Route> */}
      </Routes>
      </BrowserRouter>
    </div>
  );
}

function NavBar(){
  return(
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
  <div className="container-fluid">
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarNav">
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/createTeacher" className="nav-link">Create Teacher</Link>
        </li>
        <li className="nav-item">
          <Link to="/createStudent" className="nav-link">Create Student</Link>
        </li>
        <li className="nav-item dropdown">
           {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Details
          </a>
          <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
            <li><Link to="/teacherDetails" className="dropdown-item" >Teachers</Link></li>
            <li><Link to="/studentDetails" className="dropdown-item" >Students</Link></li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</nav>

<p id="dummy-text" className="container my-5">
Lorem ipsum dolor sit amet. Aut quas accusantium et illo iure et rerum veniam. At consequatur magnam nam nemo aliquam qui accusamus nihil sit deserunt nihil aut velit facilis aut dolorem dolor. Qui molestiae consequatur aut nesciunt recusandae aut excepturi enim sed dolor dolorem et maxime animi ut quos unde.

Et amet dolores qui officiis laboriosam cum beatae Quis. Id aspernatur dignissimos sit soluta quos qui provident sint. Qui quaerat explicabo in ducimus pariatur nam nobis atque et corrupti atque qui tempore omnis.

Et neque amet et pariatur Quis ut tenetur consectetur et ipsa quia. Est quia nostrum et rerum fuga et doloremque cupiditate.
</p>
    </div>
  )
}

export default App;
