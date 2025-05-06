import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, PlusCircle, Users, Layout, Github, LogOut } from 'lucide-react';

const Navbar = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [selectedRole, setSelectedRole] = useState('founder'); // Default role
	const [avatarUrl, setAvatarUrl] = useState(''); // State to store the avatar URL
	const navigate = useNavigate();

	useEffect(() => {
		checkLoginStatus();
	}, []);

	const checkLoginStatus = () => {
		const cookies = document.cookie.split(';');
		cookies.forEach(cookie => {
			console.debug('Cookie:', cookie.trim()); // Debug statement to print each cookie
		});
		const loggedIn = cookies.some(cookie => cookie.trim().startsWith('some_random_secret='));
		console.debug('Login status:', loggedIn); // Debug statement
		setIsLoggedIn(loggedIn);

		// Fetch the avatar URL if logged in
		// if (loggedIn) {
		// 	fetchAvatarUrl();
		// }
	};

	// const fetchAvatarUrl = async () => {
	// 	try {
	// 		const response = await fetch('http://localhost:3000/auth/user', {
	// 			credentials: 'include',
	// 		});
	// 		if (response.ok) {
	// 			const user = await response.json();
	// 			setAvatarUrl(user.avatarUrl);
	// 		} else {
	// 			console.error('Failed to fetch user data');
	// 		}
	// 	} catch (error) {
	// 		console.error('Error fetching user data:', error);
	// 	}
	// };

	const handleLogin = () => {
		console.debug('Initiating login process'); // Debug statement
		window.location.href = `http://localhost:3000/auth/github?role=${selectedRole}`;
	};

	const handleLogout = async () => {
		console.debug('Initiating logout process'); // Debug statement
		try {
			const response = await fetch('http://localhost:3000/auth/logout', {
				method: 'POST',
				credentials: 'same-origin',
				headers: {
					'Content-Type': 'application/json',
				},
				mode: 'cors',
			});
			if (response.ok) {
				// Remove all cookies
				document.cookie.split(';').forEach(cookie => {
					const [name] = cookie.split('=');
					document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
				});

				console.debug('Logout successful'); // Debug statement
				setIsLoggedIn(false);
				setAvatarUrl(''); // Clear the avatar URL
				navigate('/');
			} else {
				console.error('Logout failed');
			}
		} catch (error) {
			console.error('Error during logout:', error);
		}
	};

	return (
		<nav className="bg-white shadow-sm">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">
					<div className="flex">
						<div className="flex-shrink-0 flex items-center">
							<Link to="/" className="text-2xl font-bold text-purple-600">
								CoFoundr
							</Link>
						</div>
						<div className="hidden sm:ml-6 sm:flex sm:space-x-8">
							<Link
								to="/"
								className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700"
							>
								<Home className="mr-1 h-5 w-5" />
								Home
							</Link>
							{isLoggedIn && (
								<>
									<Link
										to="/founder/dashboard"
										className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700"
									>
										<Layout className="mr-1 h-5 w-5" />
										Founder Dashboard
									</Link>
									<Link
										to="/developer/dashboard"
										className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700"
									>
										<Github className="mr-1 h-5 w-5" />
										Developer Dashboard
									</Link>
								</>
							)}
						</div>
					</div>
					<div className="flex items-center">
						{isLoggedIn ? (
							<div className="flex items-center">
								{avatarUrl && (
									<img
										src={avatarUrl}
										alt="User Avatar"
										className="h-8 w-8 rounded-full mr-4"
									/>
								)}
								<button
									onClick={handleLogout}
									className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
								>
									<LogOut className="mr-2 h-5 w-5" />
									Logout
								</button>
							</div>
						) : (
							<div className="flex items-center">
								<select
									value={selectedRole}
									onChange={e => setSelectedRole(e.target.value)}
									className="mr-2 p-2 border rounded"
								>
									<option value="founder">Founder</option>
									<option value="developer">Developer</option>
								</select>
								<button
									onClick={handleLogin}
									className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
								>
									<Github className="mr-2 h-5 w-5" />
									Login with GitHub
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;