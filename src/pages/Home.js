import React, { useState, useEffect } from 'react';

export default function Home(props) {
	const [token, setToken] = useState(''); //user has been authenticated
	const [user, setUser] = useState({
		username: '',
		password: ''
	}); //username and password from register form
	const [loggedInUser, setLoggedInUser] = useState('');

	//user that has just been registered

	const [toggle, setToggle] = useState(true);

	//changes which form we see

	const handleChange = e => {
		setUser({ ...user, [e.target.id]: e.target.value });
	};

	//creates new user with the model - send a post request to the model

	const handleLogin = async e => {
		e.preventDefault();
		try {
			const response = await fetch('/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(user)
			});
			const data = await response.json();
			setToken(data.token);
			setLoggedInUser(data.user.username);
			window.localStorage.setItem('token', data.token);
			window.localStorage.setItem('loggedInUser', data.user.username);
			//for the local storage so they don't have to log in every time it refreshes
		} catch (error) {
			console.error(error);
		}
	};

	const handleRegister = async e => {
		e.preventDefault();
		try {
			const response = await fetch('/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(user)
			});
			const data = await response.json();
			setToken(data.token);
			setLoggedInUser(data.user.username);
			window.localStorage.setItem('token', data.token);
			window.localStorage.setItem('loggedInUser', data.user.username);
			//for the local storage so they don't have to log in every time it refreshes
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (window.localStorage.getItem('token')) {
			setToken(window.localStorage.getItem('token'));
			setLoggedInUser(window.localStorage.getItem('loggedInUser'));
		}
	}, []);

	return (
		<div>
			{!token ? (
				<>
					<button onClick={() => setToggle(!toggle)}>
						{toggle ? 'Show Register' : 'Show Login'}
					</button>
					{toggle ? (
						<form onSubmit={handleLogin}>
							<input
								type="text"
								id="username"
								value={user.username}
								onChange={handleChange}
							/>
							<input
								type="password"
								id="password"
								value={user.password}
								onChange={handleChange}
							/>
							<input type="submit" value="Login" />
						</form>
					) : (
						<form onSubmit={handleRegister}>
							<input
								type="text"
								id="username"
								value={user.username}
								onChange={handleChange}
							/>
							<input
								type="password"
								id="password"
								value={user.password}
								onChange={handleChange}
							/>
							<input type="submit" value="Register" />
						</form>
					)}
				</>
			) : (
				<>
					<div>Hello from {loggedInUser}</div>
				</>
			)}
		</div>
	);
}
