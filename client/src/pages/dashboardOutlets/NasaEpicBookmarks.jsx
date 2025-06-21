import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { getBookmarksAction } from "../../redux/actions/bookmarkActions";

import NasaEpicCard from "../../components/NasaEpicCard";


const NasaEpicBookmarks = () => {

  const dispatch = useDispatch();

  const userLoginReducer = useSelector((state) => state.userLoginReducer);
  const { userInfo } = userLoginReducer;

  const bookmarksGetReducer = useSelector((state) => state.bookmarksGetReducer);
  const { bookmarks = [], loading, error } = bookmarksGetReducer;


  const epicBookmarks = bookmarks.filter(b => b.type === "epic");

  useEffect(() => {
    if (userInfo) {
      dispatch(getBookmarksAction());
    }
  }, [dispatch, userInfo]);


  return (<>

        {!loading && epicBookmarks.length > 0 && (
            <div className="mt-8 grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 max-[500px]:grid-cols-1">
              {epicBookmarks.map((item, i) => (
                <NasaEpicCard key={i} item={item.data} userInfo={userInfo} bookmarks={bookmarks} />
              ))}
            </div>
        )}

        {!loading && (
          <p className="mt-20 text-center text-lg md:text-2xl">
            {error ? error : epicBookmarks.length === 0 ? "No bookmarks found." : null}
          </p>
        )}

  </>);
};

export default NasaEpicBookmarks;
