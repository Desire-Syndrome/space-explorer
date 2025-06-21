import { assetsImages } from "../assets/images-data";

import { useState, useEffect } from "react";

import { useDispatch } from "react-redux";
import { addBookmarkAction, deleteBookmarkAction } from "../redux/actions/bookmarkActions";


const NasaRoversCard = ({ item, userInfo, bookmarks }) => {

	const dispatch = useDispatch();

	const [isBookmarked, setIsBookmarked] = useState(false);

	const [loadedImage, setLoadedImage] = useState(false);
	const [showModal, setShowModal] = useState(false);


	useEffect(() => {
		const alreadyAdded = bookmarks.some(
			(bookmark) => bookmark.type === "mars" && bookmark.data?.id === item.id
		);
		setIsBookmarked(alreadyAdded);
	}, [bookmarks, item.id]);


	const handleBookmarkClick = () => {
		if (userInfo) {
			if (!isBookmarked) {
				const bookmarkData = {
					id: item.id,
					img_src: item.img_src,
					camera: item.camera,
					sol: item.sol,
					earth_date: item.earth_date,
				};
				dispatch(addBookmarkAction("mars", bookmarkData));
			} else {
				dispatch(deleteBookmarkAction(item.id));
			}
		}
	};


	return (<>

		<div className="border rounded shadow p-2">
			<div onClick={loadedImage ? () => setShowModal(true) : undefined} className="w-full h-52 md:h-64 bg-white flex justify-center items-center overflow-hidden rounded mb-2 relative">
				{!loadedImage && (
					<img src={assetsImages.loadingImage} alt="Loading image" className="w-full h-full object-cover absolute" />
				)}
				<img src={item.img_src} alt={item.camera.full_name} className={`w-full h-full object-cover cursor-pointer hover:scale-105 transition duration-300
          ${loadedImage ? "opacity-100" : "opacity-0"}`} onLoad={() => setLoadedImage(true)} />
			</div>

			<div className="mt-2">
				<p className="text-sm md:text-base text-gray-600"><span className="text-black mr-1">Camera:</span>{item.camera.full_name}</p>
				<p className="text-sm md:text-base text-gray-600"><span className="text-black mr-1">Martian day:</span>{item.sol}</p>
				<p className="text-sm md:text-base text-gray-600"><span className="text-black mr-1">Date:</span>{item.earth_date}</p>
			</div>

			{userInfo && (
				<button onClick={handleBookmarkClick} className={`mt-2 py-1 font-medium w-full rounded max-[500px]:text-xs text-sm md:text-base text-white transition duration-300 ease-in-out ${isBookmarked ? "bg-blue-600 hover:bg-blue-500" : "bg-gray-600 hover:bg-gray-500"}`}>
					{!isBookmarked ? "Add to Bookmarks" : "Remove from Bookmarks"}
				</button>
			)}
		</div>

		{showModal && (
			<div onClick={() => setShowModal(false)} className="fixed inset-0 bg-black bg-opacity-95 flex justify-center items-center z-50">
				<button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-white text-xl font-bold">X</button>
				<div className="relative px-2" onClick={(e) => e.stopPropagation()}>
					<img src={item.img_src} alt={item.camera.full_name} className="w-full max-h-[90vh]" />
				</div>
			</div>
		)}

	</>);
};

export default NasaRoversCard;