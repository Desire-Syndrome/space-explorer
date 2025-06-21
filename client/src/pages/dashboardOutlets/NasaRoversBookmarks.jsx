import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { getBookmarksAction } from "../../redux/actions/bookmarkActions";

import NasaRoversCard from "../../components/NasaRoversCard";


const NasaRoversBookmarks = () => {

  const dispatch = useDispatch();

  const userLoginReducer = useSelector((state) => state.userLoginReducer);
  const { userInfo } = userLoginReducer;

  const bookmarksGetReducer = useSelector((state) => state.bookmarksGetReducer);
  const { bookmarks = [], loading, error } = bookmarksGetReducer;


  const marsBookmarks = bookmarks.filter(b => b.type === "mars");

  useEffect(() => {
    if (userInfo) {
      dispatch(getBookmarksAction());
    }
  }, [dispatch, userInfo]);


  return (<>

        {!loading && marsBookmarks.length > 0 && (
            <div className="mt-8 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 max-[500px]:grid-cols-1">
              {marsBookmarks.map((item, i) => (
                <NasaRoversCard key={i} item={item.data} userInfo={userInfo} bookmarks={bookmarks} />
              ))}
            </div>
        )}

        {!loading && (
          <p className="mt-20 text-center text-lg md:text-2xl">
            {error ? error : marsBookmarks.length === 0 ? "No bookmarks found." : null}
          </p>
        )}

  </>);
};

export default NasaRoversBookmarks;
