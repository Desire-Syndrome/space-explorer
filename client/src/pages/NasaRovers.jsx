const BASE_URL = import.meta.env.VITE_BACKEND_URL;
import { assetsImages } from '../assets/images-data';

import axios from "axios";

import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { nasaRoversAction } from "../redux/actions/NasaActions";
import { getBookmarksAction } from "../redux/actions/BookmarkActions";

import Layouts from "../layouts/Layouts";
import NasaRoversCard from "../components/NasaRoversCard";


function NasaRovers() {

  const userLoginReducer = useSelector((state) => state.userLoginReducer);
  const { userInfo } = userLoginReducer;

  const dispatch = useDispatch();
  const nasaRoversReducer = useSelector((state) => state.nasaRoversReducer);
  const { loading, error, data } = nasaRoversReducer;
  const bookmarksGetReducer = useSelector((state) => state.bookmarksGetReducer);
  const { bookmarks = [] } = bookmarksGetReducer;

  const [maxSol, setMaxSol] = useState("");
  const [dataToRender, setDataToRender] = useState([]);
  const [sol, setSol] = useState("");
  const [cameraFilter, setCameraFilter] = useState("");

  const cameraNames = Array.from(
    new Set(data.map(data => data.camera.full_name))
  );


  useEffect(() => {
    if (userInfo) {
      dispatch(getBookmarksAction());
    }
  }, [dispatch, userInfo]);

  useEffect(() => {
    const fetchMaxSol = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/nasa/rovers/max-sol`);
        if (data?.max_sol) { setMaxSol(data.max_sol); }
      } catch (err) {
        console.error("Failed to fetch max_sol:", err);
      }
    }
    fetchMaxSol();
    dispatch(nasaRoversAction());
  }, [dispatch]);

  useEffect(() => {
    const filteredData = cameraFilter ? data.filter(data => data.camera.full_name === cameraFilter) : data;
    setDataToRender(filteredData.slice(0, 32));
  }, [data, cameraFilter]);


  const handleSearch = () => {
    const solNum = sol ? Number(sol) : undefined;
    dispatch(nasaRoversAction(solNum));
    setCameraFilter("");
  };


  return (<Layouts>

    <div className='bg-gradient-to-t from-blue-800 to-violet-400 text-white py-12 md:py-16 text-center'>
      <h1 className="text-lg md:text-2xl font-bold">Rover Photos - NASA Rovers</h1>
    </div>

    <div className="container 2xl:px-20 mx-auto my-14">
      <div className='px-2'>
        <label htmlFor="sol" className="mr-2 hidden md:inline-block font-medium md:text-base">Martian day:</label>
        <input onChange={e => setSol(e.target.value)} placeholder={maxSol && `Day from 0 to ${maxSol}`} min="0" max={maxSol} value={sol}
          id="sol" type="number" className="w-[180px] border border-gray-300 rounded px-2 py-1" />
        <button onClick={handleSearch} className="ml-2 bg-blue-600 text-white px-3 py-1 font-medium rounded hover:bg-blue-500 transition duration-300 ease-in-out">
          Search
        </button>
      </div>
      <div className='px-2 mt-8'>
        <label htmlFor="camera-select" className="mr-2 mt-8 font-medium md:text-base">Camera:</label>
        <select onChange={e => setCameraFilter(e.target.value)} value={cameraFilter} id="camera-select" className="border border-gray-300 rounded px-2 py-1">
          <option value="">All Cameras</option>
          {cameraNames.map((cam, i) => (
            <option key={i} value={cam}>{cam}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className=" mt-10 bg-white flex justify-center items-center">
          <img src={assetsImages.loading} className="w-[80px]" alt="Loading" />
        </div>
      ) : (
        data && data.length > 0 && (
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
            {dataToRender.map((item, i) => (
              <NasaRoversCard key={i} item={item} userInfo={userInfo} bookmarks={bookmarks} />
            ))}
          </div>
        )
      )}

      {!loading && (
        <p className="mt-10 text-center text-lg md:text-2xl">
          {error ? error : dataToRender.length === 0 ? "No images found." : null}
        </p>
      )}
    </div>

  </Layouts>);
}

export default NasaRovers;