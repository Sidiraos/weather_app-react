import loader from '../../assets/loader.svg';
import errorIcon from '../../assets/browser.svg';
import './CardWeather.css';
import { useState, useEffect, useRef } from 'react';

const CardWeather = () => {
	const [weather, setWeather] = useState(null);
	const [errorMsg, setErrorMsg] = useState('');
	const API_KEY = import.meta.env.VITE_API_KEY;

	const loaderRef = useRef();
	const errorContainerRef = useRef();
	useEffect(() => {
		loaderRef.current.classList.add('active');
		fetch(`https://api.airvisual.com/v2/nearest_city?key=${API_KEY}`)
			.then((res) => res.json())
			.then((data) => {
				loaderRef.current.classList.remove('active');

				if (data.status === 'success') {
					errorContainerRef.current.classList.remove('active');
					setWeather({
						city: data.data.city,
						country: data.data.country,
						temp: data.data.current.weather.tp,
						ic: data.data.current.weather.ic,
					});
				} else {
					errorContainerRef.current.classList.add('active');
					setErrorMsg(data.data.message);
					setWeather(null);
				}
			})
			.catch((err) => {
				console.log('erreur de requete : ', err);
				errorMsg && errorContainerRef.current.classList.add('active');
				setErrorMsg('Error 404. Please try again later.', err.message);
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
								src={`/public/icons/${weather.ic}.svg`}
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
