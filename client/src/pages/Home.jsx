import { assetsImages } from '../assets/images-data'

import { Link } from "react-router-dom"

import Layouts from '../layouts/Layouts'


function Home() {


	return (<Layouts>

		<div className="container 2xl:px-20 mx-auto mt-10 md:mt-6">
			<div className="relative w-full overflow-hidden rounded-lg" style={{ paddingTop: '40%' }}>
				<img src={assetsImages.home_image1} className="absolute top-0 left-0 w-full h-full object-cover z-0" alt="Image" />
				<div className="absolute bottom-0 pt-2 pb-4 md:py-10 left-0 w-full z-10  text-center font-medium text-white bg-black bg-opacity-50">
					<h2 className="max-[500px]:text-xl text-2xl md:text-4xl mb-4 md:mb-10 ">A New NASA Picture Every Day</h2>
					<Link to={'/picture-of-the-day'} className='bg-blue-600 md:text-lg text-sm px-6 py-2 rounded-full hover:bg-blue-500 transition duration-300 ease-in-out'>Let's check</Link>
				</div>
			</div>

			<div className="mt-20 lg:mt-28 flex flex-wrap items-center justify-between">
				<div className="w-10/12 mx-auto md:w-1/2">
					<img src={assetsImages.home_image2} className="w-full rounded-lg" alt="Image" />
				</div>
				<div className="w-10/12 mx-auto md:w-1/2 py-8 md:py-10 px-2 md:px-10 lg:md:px-16 xl:px-24 font-medium">
				<h2 className="max-[500px]:text-xl text-2xl md:text-3xl text-gray-800 mb-4 md:mb-10">Interested in photos<br/>from Mars?</h2>
				<Link to={'/rover-photos'} className='bg-blue-600 md:text-lg  text-white text-sm px-6 py-2 rounded-full hover:bg-blue-500 transition duration-300 ease-in-out'>More photos</Link>
				</div>
			</div>

			<div className="mt-20 mb-20 lg:mt-28 flex flex-wrap items-center justify-between">
								<div className="order-1 md:order-0 w-10/12 mx-auto md:w-1/2 py-8 md:py-10 px-2 md:px-10 lg:md:px-16 xl:px-24 font-medium">
				<h2 className="max-[500px]:text-xl text-2xl md:text-3xl text-gray-800 mb-4 md:mb-10">View the Earth<br/>from space</h2>
				<Link to={'/earth-from-space'} className='bg-blue-600 md:text-lg  text-white text-sm px-6 py-2 rounded-full hover:bg-blue-500 transition duration-300 ease-in-out'>Let's look</Link>
				</div>
				<div className="order-0 md:order-1 w-10/12 mx-auto md:w-1/2">
					<img src={assetsImages.home_image3} className="w-full rounded-lg" alt="Image" />
				</div>
			</div>
		</div>

	</Layouts>)
}

export default Home