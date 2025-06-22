import { useEffect, useState } from "react";


const ScrollToTopButton = () => {

	const [visible, setVisible] = useState(false);


	useEffect(() => {
		const toggleVisible = () => {
			setVisible(window.scrollY > 500);
		};
		window.addEventListener("scroll", toggleVisible);
		return () => window.removeEventListener("scroll", toggleVisible);
	}, [visible]);


	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (

		visible && (
			<button onClick={scrollToTop} className="fixed bottom-3 right-3 md:bottom-6 md:right-6 border-gray-800 border-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full px-3 py-2 md:px-4 md:py-3 shadow-lg z-10 transition duration-300">
				↑
			</button>
		)

	);
};

export default ScrollToTopButton;