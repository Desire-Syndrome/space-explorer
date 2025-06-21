import { assetsImages } from '../assets/images-data'

import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { nasaApodAction } from "../redux/actions/nasaActions";
import { getBookmarksAction } from "../redux/actions/bookmarkActions";

import Layouts from "../layouts/Layouts";
import NasaApodCard from "../components/NasaApodCard";


function NasaAPOD() {

  const userLoginReducer = useSelector((state) => state.userLoginReducer);
  const { userInfo } = userLoginReducer;

  const dispatch = useDispatch();
  const nasaApodReducer = useSelector(state => state.nasaApodReducer);
  const { loading, error, data } = nasaApodReducer;
  const bookmarksGetReducer = useSelector((state) => state.bookmarksGetReducer);
  const { bookmarks = [] } = bookmarksGetReducer;

  const [daysAgo, setDaysAgo] = useState(0);


  useEffect(() => {
    if (userInfo) {
      dispatch(getBookmarksAction());
    }
  }, [dispatch, userInfo]);

  useEffect(() => {
    dispatch(nasaApodAction(daysAgo));
  }, [dispatch, daysAgo]);


  return (<Layouts>

    <div className='bg-gradient-to-t from-blue-800 to-violet-400 text-white py-12 md:py-16 text-center'>
      <h1 className="text-lg md:text-2xl font-bold">Picture of the Day - NASA APOD</h1>
    </div>

    <div className="container px-5 2xl:px-20 mx-auto my-14">
      <div className="flex gap-4">
        <button onClick={() => setDaysAgo(prev => prev + 1)} className="bg-blue-600 font-medium text-white px-3 py-1  rounded hover:bg-blue-500 transition">
          ← Prev
        </button>
        <button onClick={() => setDaysAgo(prev => prev - 1)} disabled={daysAgo === 0} className={`px-3 font-medium py-2 rounded transition ${daysAgo === 0 ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-500'}`}>
          Next →
        </button>
      </div>

      {loading ? (
        <div className=" mt-10 bg-white flex justify-center items-center">
          <img src={assetsImages.loading} className="w-[80px]" alt="Loading" />
        </div>
      ) : (
        data && (
          <NasaApodCard item={data} userInfo={userInfo} bookmarks={bookmarks} />
        )
      )}

      {!loading && error && (
        <p className="mt-10 text-center text-lg md:text-2xl">{error}</p>
      )}
    </div>

  </Layouts>);
}

export default NasaAPOD;
