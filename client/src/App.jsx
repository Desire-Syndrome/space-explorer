import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"

import UseScrollToTop from "./hooks/useScrollToTop"

import { useSelector } from "react-redux";

import Home from './pages/Home'
import UserDashboard from './pages/UserDashboard'
import EarthFromSpace from './pages/dashboardOutlets/EarthFromSpace'
import PictureOfTheDay from './pages/dashboardOutlets/PictureOfTheDay'
import RoverPhotos from './pages/dashboardOutlets/RoverPhotos'
import EditProfile from './pages/dashboardOutlets/EditProfile'


function App() {

  const userLoginReducer = useSelector((state) => state.userLoginReducer);
  const { userInfo } = userLoginReducer;

  
  return (

    <Router>
      <UseScrollToTop />
      <Routes>
        <Route exact path="/" element={<Home />}></Route>
        <Route exact path="/user" element={userInfo ? <UserDashboard/> : <Navigate to="/" />}>
           <Route exact path='bookmarks/earth-from-space' element={<EarthFromSpace />} />
           <Route exact path='bookmarks/picture-of-the-day' element={<PictureOfTheDay />} />
           <Route exact path='bookmarks/rover-photos' element={<RoverPhotos />} />
           <Route exact path='edit-profile' element={<EditProfile />} />
        </Route>
      </Routes>
    </Router>

  );
}

export default App