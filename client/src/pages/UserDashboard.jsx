import { assetsImages } from '../assets/images-data'

import { Link, NavLink, Outlet } from "react-router-dom"

import { useDispatch } from "react-redux";
import { userLogoutAction } from "../redux/actions/UserActions"

import UserMenu from '../components/UserMenu'


const UserDashboard = () => {

	const dispatch = useDispatch();


	const logoutHandler = () => {
		dispatch(userLogoutAction());
	}

	
	return (

		<div className="min-h-screen">

			<div className='shadow pt-2 pb-1'>
				<div className='max-[500px]:px-2 px-5 flex justify-between items-center'>
					<Link to="/" className='flex items-center'>
						<img src={assetsImages.logo} className='w-[50px] md:w-[80px]' alt="Logo" />
						<p className='max-[500px]:hidden ms-2 text-blue-600 text-center font-semibold text-md leading-none md:text-xl md:leading-none'>Space<br /><span className='text-gray-900'>Explorer</span></p>
					</Link>
					<UserMenu />
				</div>
			</div>

			<div className='flex items-start'>

				<div className=' border-r-2 max-w-1/4 border-b-2 md:border-hidden'>
					<ul className='flex flex-col items-start pt-5 pb-2 text-gray-800 text-sm lg:text-base'>
						<li className='w-full'>
							<NavLink to={'/'} className='flex items-center p-3 md:px-6 gap-2 w-full'>
								<img src={assetsImages.home} className='w-5' alt="icon" />
								<p className='max-md:hidden'>Back to Website</p>
							</NavLink>
						</li>
						<li className='w-full mt-2 border-t-2'>
							<NavLink to={'/user/bookmarks/earth-from-space'} className={({ isActive }) => `flex items-center p-3 md:px-6 gap-2 w-full mt-2 ${isActive && 'bg-blue-100'}`} >
								<img src={assetsImages.bookmark} className='w-5' alt="icon" />
								<p className='max-md:hidden'>Earth from Space</p>
							</NavLink>
						</li>
						<li className='w-full'>
							<NavLink to={'/user/bookmarks/picture-of-the-day'} className={({ isActive }) => `flex items-center p-3 md:px-6 gap-2 w-full ${isActive && 'bg-blue-100'}`} >
								<img src={assetsImages.bookmark} className='w-5' alt="icon" />
								<p className='max-md:hidden'>Picture of the Day</p>
							</NavLink>
						</li>
						<li className='w-full'>
							<NavLink to={'/user/bookmarks/rover-photos'} className={({ isActive }) => `flex items-center p-3 md:px-6 gap-2 w-full ${isActive && 'bg-blue-100'}`} >
								<img src={assetsImages.bookmark} className='w-5' alt="icon" />
								<p className='max-md:hidden'>Rover Photos</p>
							</NavLink>
						</li>
						<li className='w-full mt-2 border-t-2'>
							<NavLink to={'/user/edit-profile'} className={({ isActive }) => `flex items-center p-3 md:px-6 gap-2 w-full mt-2 ${isActive && 'bg-blue-100'}`} >
								<img src={assetsImages.setting} className='w-5' alt="icon" />
								<p className='max-md:hidden'>Edit Profile</p>
							</NavLink>
						</li>
						<li onClick={logoutHandler} className='flex items-center p-3 md:px-6 gap-2 w-full cursor-pointer' >
							<img src={assetsImages.exit} className='w-5' alt="icon" />
							<p className='max-md:hidden'>Logout</p>
						</li>
					</ul>
				</div>

				<div className='w-3/4 ms-10 max-[500px]:w-3/5'>
					<Outlet />
				</div>

			</div>

		</div>

	)
}

export default UserDashboard