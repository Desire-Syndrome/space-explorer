import { assetsImages } from "../assets/images-data";

import { useState, useEffect } from "react";

import { useDispatch } from "react-redux";
import { addBookmarkAction, deleteBookmarkAction } from "../redux/actions/BookmarkActions"


const NasaApodCard = ({ item, userInfo, bookmarks }) => {

  const dispatch = useDispatch();

  const [isBookmarked, setIsBookmarked] = useState(false);

  const [loadedImage, setLoadedImage] = useState(false);
  const [showModal, setShowModal] = useState(false);


  useEffect(() => {
    const alreadyAdded = bookmarks.some(
      (bookmark) => bookmark.type === "apod" && bookmark.data?.id === item.date
    );
    setIsBookmarked(alreadyAdded);
  }, [bookmarks, item.date]);


  const handleBookmarkClick = () => {
    if (userInfo) {
      if (!isBookmarked) {
        const bookmarkData = {
          id: item.date,
          url: item.url,
          title: item.title,
          explanation: item.explanation,
          date: item.date
        };
        dispatch(addBookmarkAction("apod", bookmarkData));
      } else {
        dispatch(deleteBookmarkAction(item.date));
      }
    }
  };


  return (<>

    <div className="w-full mt-8">
      <h2 className="text-base md:text-2xl text-center font-semibold">{item.title}</h2>
      <p className="mt-2 text-sm md:text-base text-center text-gray-600">{item.date}</p>

      {userInfo && (
        <div className="text-right">
          <button onClick={handleBookmarkClick} className={`mt-2 py-1 px-4 font-medium rounded max-[500px]:text-xs text-sm md:text-base text-white transition duration-300 ease-in-out ${isBookmarked ? "bg-blue-600 hover:bg-blue-500" : "bg-gray-600 hover:bg-gray-500"}`}>
            {!isBookmarked ? "Add to Bookmarks" : "Remove from Bookmarks"}
          </button>
        </div>
      )}

      <div onClick={loadedImage ? () => setShowModal(true) : undefined} className="mt-6 relative w-full overflow-hidden" style={{ paddingTop: '55%' }}>
        {!loadedImage && (
          <img src={assetsImages.loadingImage} alt="Loading image" className="absolute top-0 left-0 w-full h-full object-cover" />
        )}
        <img src={item.url} alt={item.title} className={`absolute top-0 left-0 w-full h-full object-cover cursor-pointer hover:scale-105 transition duration-300
          ${loadedImage ? "opacity-100" : "opacity-0"}`} onLoad={() => setLoadedImage(true)} />
      </div>

      <p className="mt-4 text-sm md:text-base text-gray-600">{item.explanation}</p>
    </div>


    {showModal && (
      <div onClick={() => setShowModal(false)} className="fixed inset-0 bg-black bg-opacity-95 flex justify-center items-center z-50">
        <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-white text-xl font-bold">X</button>
        <div className="relative px-2" onClick={(e) => e.stopPropagation()}>
          <img src={item.url} alt={item.title} className="w-full max-h-[90vh]" />
        </div>
      </div>
    )}

  </>);
};

export default NasaApodCard;