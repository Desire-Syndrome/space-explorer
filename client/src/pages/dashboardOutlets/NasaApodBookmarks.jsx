import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { getBookmarksAction } from "../../redux/actions/bookmarkActions";

import NasaApodCard from "../../components/NasaApodCard";


const NasaApodBookmarks = () => {

	const dispatch = useDispatch();

	const userLoginReducer = useSelector((state) => state.userLoginReducer);
	const { userInfo } = userLoginReducer;

	const bookmarksGetReducer = useSelector((state) => state.bookmarksGetReducer);
	const { bookmarks = [], loading, error } = bookmarksGetReducer;


	const apodBookmarks = bookmarks.filter(b => b.type === "apod");

	useEffect(() => {
		if (userInfo) {
			dispatch(getBookmarksAction());
		}
	}, [dispatch, userInfo]);


	return (<>

		{!loading && apodBookmarks.length > 0 && (
			apodBookmarks.map((item, i) => (
				<NasaApodCard key={i} item={item.data} userInfo={userInfo} bookmarks={bookmarks} />
			))
		)}

		{!loading && (
			<p className="mt-20 text-center text-lg md:text-2xl">
				{error ? error : apodBookmarks.length === 0 ? "No bookmarks found." : null}
			</p>
		)}

	</>);
};

export default NasaApodBookmarks;
