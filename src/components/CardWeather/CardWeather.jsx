import loader from '../../assets/loader.svg';
import errorIcon from '../../assets/browser.svg';
import './CardWeather.css';
import { useState, useEffect, useRef } from 'react';

const CardWeather = () => {
	const [weather, setWeather] = useState(null);
	const [errorMsg, setErrorMsg] = useState('');
	const API_KEY = import.meta.env.VITE_API_KEY;
	// console.log(API_KEY);

	const loaderRef = useRef();
	const errorContainerRef = useRef();
	useEffect(() => {
		errorContainerRef.current.classList.remove('active');
		loaderRef.current.classList.add('active');
		fetch(`https://api.airvisual.com/v2/nearest_city?key=${API_KEY}`)
			.then((response) => {
				// console.log(response);
				// if (!response.ok) {
				// 	throw new Error('Something went wrong');
				// }
				return response.json();
			})
			.then((data) => {
				loaderRef.current.classList.remove('active');
				// console.log(data);
				if (data.status === 'success') {
					errorContainerRef.current.classList.remove('active');
					setWeather({
						city: data.data.city,
						country: data.data.country,
						temp: data.data.current.weather.tp,
						ic: data.data.current.weather.ic,
					});
					errorMsg && setErrorMsg('');
				} else {
					// console.log(data);
					throw new Error(`${data.data.message}`);
				}
			})
			.catch((err) => {
				loaderRef.current.classList.contains('active') &&
					loaderRef.current.classList.remove('active');
				// console.dir(err);
				setErrorMsg(err.message);
				errorContainerRef.current.classList.add('active');
				setWeather(null);
			});
	}, []);

	return (
		<main>
			<div className="card">
				<div ref={loaderRef} className="loader-container">
					<img src={loader} alt="loader icon" />
				</div>
				{weather ? (
					<>
						<p className="city-name">{weather.city}</p>
						<p className="country-name">{weather.country}</p>
						<p className="temperature">{weather.temp}°</p>
						<div className="info-icon-container">
							<img
								src={`./icons/${weather.ic}.svg`}
								alt="weather icon"
							/>
						</div>
					</>
				) : (
					<div
						className="error-message-container"
						ref={errorContainerRef}
					>
						<img src={errorIcon} alt="error icon" />
						<p className="error-message">{errorMsg}</p>
					</div>
				)}
			</div>
		</main>
	);
};
export default CardWeather;
