const BASE_URL = import.meta.env.VITE_BACKEND_URL;
import { assetsImages } from '../assets/images-data';

import axios from "axios";

import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { nasaEpicAction } from "../redux/actions/NasaActions";
import { getBookmarksAction } from "../redux/actions/BookmarkActions";

import Layouts from "../layouts/Layouts";
import NasaEpicCard from "../components/NasaEpicCard";


function NasaEPIC() {

  const userLoginReducer = useSelector((state) => state.userLoginReducer);
  const { userInfo } = userLoginReducer;

  const dispatch = useDispatch();
  const nasaEpicReducer = useSelector((state) => state.nasaEpicReducer);
  const { loading, error, data } = nasaEpicReducer;
  const bookmarksGetReducer = useSelector((state) => state.bookmarksGetReducer);
  const { bookmarks = [] } = bookmarksGetReducer;

  const [maxAvailableDate, setMaxAvailableDate] = useState("");
  const [date, setDate] = useState("");


  useEffect(() => {
    if (userInfo) {
      dispatch(getBookmarksAction());
    }
  }, [dispatch, userInfo]);

  useEffect(() => {
    const fetchLatestDate = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/nasa/epic/latest-date`);
        const latestDate = data.latestDate.date;
        if (latestDate) {
          setMaxAvailableDate(latestDate);
          setDate(latestDate);
        }
      } catch (error) {
        console.error("Failed to get latest EPIC date", error);
      }
    };
    fetchLatestDate();
    dispatch(nasaEpicAction());
  }, [dispatch]);


  const handleSearch = () => {
    if (date) {
      dispatch(nasaEpicAction(date))
    };
  };



  return (<Layouts>

    <div className='bg-gradient-to-t from-blue-800 to-violet-400 text-white py-12 md:py-16 text-center'>
      <h1 className="text-lg md:text-2xl font-bold">Earth From Space - NASA EPIC</h1>
    </div>

    <div className="container 2xl:px-20 mx-auto my-14">
      <div className='px-2'>
        <label htmlFor="date" className="mr-2 hidden md:inline-block font-medium md:text-base">Select Date:</label>
        <input type="date" id="date" value={date} className="border border-gray-300 rounded px-2 py-1"
          onChange={(e) => setDate(e.target.value)} max={maxAvailableDate} />
        <button onClick={handleSearch} className="ml-2 font-medium bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-500 transition duration-300 ease-in-out">
          Search
        </button>
      </div>

      {loading ? (
        <div className=" mt-10 bg-white flex justify-center items-center">
          <img src={assetsImages.loading} className="w-[80px]" alt="Loading" />
        </div>
      ) : (
        data && data.length > 0 && (
          <div className="mt-10 grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {data.map((item, i) => (
              <NasaEpicCard key={i} item={item} userInfo={userInfo} bookmarks={bookmarks} />
            ))}
          </div>
        )
      )}

      {!loading && error && (
        <p className="mt-10 text-center text-lg md:text-2xl">{error}</p>
      )}
    </div>

  </Layouts>);
}

export default NasaEPIC;
