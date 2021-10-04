import React from 'react';
import 'regenerator-runtime/runtime';
import './global.css';
import { login, logout } from './utils';

const App = () => {
	//@ts-ignore
	const { walletConnection, accountId } = window;

	return (
		<>
			{walletConnection.isSignedIn() ? (
				<button
					className="link"
					style={{ float: 'right' }}
					onClick={logout}>
					Sign out
				</button>
			) : (
				<main>
					<h1>Welcome to NEAR!</h1>
					<p style={{ textAlign: 'center', marginTop: '2.5em' }}>
						<button onClick={login}>Sign in</button>
					</p>
				</main>
			)}
			<main>
				<h1>
					{accountId}!
				</h1>
			</main>
		</>
	);
};

export default App;
