import { assetsImages } from '../assets/images-data'

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

import { useDispatch, useSelector } from "react-redux";
import { userRegisterAction, userLoginAction } from "../redux/actions/UserActions"

import UserMenu from '../components/UserMenu'


const Header = () => {

	const dispatch = useDispatch();
	const userRegisterReducer = useSelector((state) => state.userRegisterReducer);
	const { loading: registerLoading, error: registerError, success: registerSuccess } = userRegisterReducer;
	const userLoginReducer = useSelector((state) => state.userLoginReducer);
	const { loading: loginLoading, error: loginError, success: loginSuccess } = userLoginReducer;

	const { userInfo } = userLoginReducer;


	const [popupState, setPopupState] = useState("Login");
	const [showPopup, setShowPopup] = useState(false);

	const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");
	const [avatar, setAvatar] = useState(null);

	const [errorMessage, setErrorMessage] = useState("");


	useEffect(() => {
		if (registerSuccess) {
			dispatch(userLoginAction(email, password));
			closePopup();
			dispatch({ type: "USER_REGISTRATION_RESET" });
		} else if (registerError) {
			setErrorMessage(registerError);
			setTimeout(() => {
				setErrorMessage("");
				dispatch({ type: "USER_REGISTRATION_RESET" });
			}, 3000);
		}
		if (loginSuccess) {
			closePopup();
		} else if (loginError) {
			setErrorMessage(loginError);
			setTimeout(() => {
				setErrorMessage("");
				dispatch({ type: "USER_LOGIN_FAIL", payload: "" });
			}, 3000);
		}
	}, [dispatch, registerError, registerSuccess, loginError, loginSuccess, userInfo, email, password]);


	const handleSubmit = async (e) => {
		e.preventDefault();
		if (popupState === "Login") {
			dispatch(userLoginAction(email, password));
		} else if (popupState === "Registration") {
			dispatch(userRegisterAction(name, email, password, avatar));
		}
	};

	
	const closePopup = () => {
		setAvatar(null); setName(""); setEmail(""); setPassword("");
		setPopupState("Login"); setShowPopup(false);
	}


	return (<>

		<div className='shadow pt-2 pb-4 lg:pb-1'>
			<div className='max-w-[1900px] px-4 2xl:px-20 mx-auto flex flex-wrap justify-between items-center'>

				<Link to="/" className='flex items-center'>
					<img src={assetsImages.logo} className='w-[50px] md:w-[80px]' alt="Logo" />
					<p className='max-[500px]:hidden ms-2 text-blue-600 text-center font-semibold text-md leading-none md:text-xl md:leading-none'>Space<br /><span className='text-gray-900'>Explorer</span></p>
				</Link>

				<div className='lg:order-3'>
					{userInfo ? (
						<UserMenu />
					) : (
						<button onClick={() => setShowPopup(true)} className='bg-blue-600 md:text-sm text-xs font-medium text-white px-6 py-2 rounded-full hover:bg-blue-500 transition duration-300 ease-in-out'>User Login</button>
					)}
				</div>

				<div className='lg:order-2 w-full lg:w-auto mt-4 lg:mt-0'>
					<ul className='max-[500px]:block max-[500px]:text-center flex justify-center items-center font-semibold text-black md:text-lg text-sm'>
						<li className='max-[500px]:pb-1'>
							<Link to={'/'} className='max-[500px]:inline flex items-center text-black md:text-lg text-md px-1 md:px-2 mx-2 hover:opacity-75 transition duration-300 ease-in-out'>
								<img src={assetsImages.home} className='w-[16px] md:w-[18px] max-[500px]:hidden' alt="Home" />
								<span className=' ms-2'>Home</span>
							</Link>
						</li>
						<li className='max-[500px]:pb-1'>
							<Link to={'/earth-from-space'} className='px-1 md:px-2 mx-2 hover:opacity-75 transition duration-300 ease-in-out'>
								Earth from Space
							</Link>
						</li>
						<li className='max-[500px]:pb-1'>
							<Link to={'/picture-of-the-day'} className='px-1 md:px-2 mx-2 hover:opacity-75 transition duration-300 ease-in-out'>
								Picture of the Day
							</Link>
						</li>
						<li className='max-[500px]:pb-1'>
							<Link to={'/rover-photos'} className='px-1 md:px-2 mx-2 hover:opacity-75 transition duration-300 ease-in-out'>
								Rover Photos
							</Link>
						</li>
					</ul>
				</div>

			</div>
		</div>


		{showPopup && (
			<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
				<div onClick={closePopup} className='fixed inset-0 z-150'></div>
				<div className="bg-white rounded-lg shadow p-6 w-80 lg:w-96 relative border-blue-600 border-opacity-70 border-2 z-200">
					<button className="absolute top-2 right-3 text-gray-500" onClick={closePopup}>✕</button>
					<h2 className="text-lg text-center font-medium mb-4">User {popupState}</h2>
					<form onSubmit={handleSubmit}>

						{popupState === 'Registration' && (<>
							<div className='text-center my-6 w-100 py-2 bg-slate-200 rounded-lg'>
								<label htmlFor="avatar">
									<img src={avatar ? URL.createObjectURL(avatar) : assetsImages.upload_area} alt="Upload avatar" className='w-24 h-24 rounded-full inline-block' />
									<input onChange={e => setAvatar(e.target.files[0])} type="file" id='avatar' hidden />
									<p className='mt-2'>Upload your photo</p>
								</label>
							</div>
							<div className='border border-gray-300 px-4 py-2 flex items-center gap-2 rounded-full mt-2'>
								<img src={assetsImages.person_icon} className='h-4 w-4' alt="person icon" />
								<input onChange={e => setName(e.target.value)} value={name} placeholder='Name' className='no-focus text-sm border-none' type="text" required />
							</div>
						</>)}

						<div className='border border-gray-300 px-4 py-2 flex items-center gap-2 rounded-full mt-2'>
							<img src={assetsImages.email_icon} className='h-4 w-4' alt="email icon" />
							<input onChange={e => setEmail(e.target.value)} value={email} type="email" placeholder='Email' className='no-focus text-sm border-none' required />
						</div>
						<div className='border border-gray-300 px-4 py-2 flex items-center gap-2 rounded-full mt-2'>
							<img src={assetsImages.lock_icon} className='h-4 w-4' alt="lock icon" />
							<input onChange={e => setPassword(e.target.value)} value={password} type="password" placeholder='Password' className='no-focus text-sm border-none' required />
						</div>

						{popupState === 'Login' ? (<>
							<button type='submit' className='bg-blue-600 w-full text-white font-medium rounded-full py-2 mt-3 hover:bg-blue-500 transition duration-300 ease-in-out' disabled={loginLoading}>
								{loginLoading ? "Loading..." : "Login"}
							</button>
							{errorMessage && (
								<div className="mt-3 rounded-md bg-red-100 border border-red-400  px-4 py-3 text-sm text-center">
									{errorMessage}
								</div>
							)}
							<p className='text-center text-sm mt-5'>
								Don’t have an account?
								<span onClick={() => setPopupState("Registration")} className='text-blue-600 font-medium cursor-pointer ms-2'>Registration</span>
							</p>
						</>) : (<>
							<button type="submit" className="bg-blue-600 w-full font-medium text-white rounded-full py-2 mt-3 hover:bg-blue-500 transition duration-300 ease-in-out" disabled={registerLoading}>
								{registerLoading ? "Loading..." : "Submit"}
							</button>
							{errorMessage && (
								<div className="mt-3 rounded-md bg-red-100 border border-red-400  px-4 py-3 text-sm text-center">
									{errorMessage}
								</div>
							)}
							<p className='text-center text-sm mt-5'>
								Already have an account?
								<span onClick={() => setPopupState("Login")} className='text-blue-600 font-medium cursor-pointer ms-2 '>Login</span>
							</p>
						</>
						)}

					</form>
				</div>
			</div>
		)}

	</>)
}

export default Header