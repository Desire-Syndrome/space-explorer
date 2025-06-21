import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"

import UseScrollToTop from "./hooks/useScrollToTop"

import { useSelector } from "react-redux";

import Home from './pages/Home'
import UserDashboard from './pages/UserDashboard'
import NasaEpicBookmarks from './pages/dashboardOutlets/NasaEpicBookmarks'
import NasaApodBookmarks from './pages/dashboardOutlets/NasaApodBookmarks'
import NasaRoversBookmark from './pages/dashboardOutlets/NasaRoversBookmarks'
import EditProfile from './pages/dashboardOutlets/EditProfile'
import NasaEPIC from './pages/NasaEPIC'
import NasaAPOD from './pages/NasaAPOD'
import NasaRovers from './pages/NasaRovers'


function App() {

  const userLoginReducer = useSelector((state) => state.userLoginReducer);
  const { userInfo } = userLoginReducer;

  
  return (

    <Router>
      <UseScrollToTop />
      <Routes>
        <Route exact path="/" element={<Home />}></Route>
        <Route exact path="/user" element={userInfo ? <UserDashboard/> : <Navigate to="/" />}>
           <Route exact path='bookmarks/earth-from-space' element={<NasaEpicBookmarks />} />
           <Route exact path='bookmarks/picture-of-the-day' element={<NasaApodBookmarks />} />
           <Route exact path='bookmarks/rover-photos' element={<NasaRoversBookmark />} />
           <Route exact path='edit-profile' element={<EditProfile />} />
        </Route>
         <Route exact path='/earth-from-space' element={<NasaEPIC />} />
         <Route exact path='/picture-of-the-day' element={<NasaAPOD />} />
         <Route exact path='/rover-photos' element={<NasaRovers />} />
      </Routes>
    </Router>

  );
}

export default App