import loader from '../../assets/loader.svg';
import './CardWeather.css';
import { useState, useEffect, useRef } from 'react';

const CardWeather = () => {
	const [weather, setWeather] = useState(null);
	const [errorMsg, setErrorMsg] = useState('');
	const url = import.meta.env.VITE_API_URL + import.meta.env.VITE_API_KEY;

	const loaderRef = useRef();
	const errorContainerRef = useRef();
	useEffect(() => {
		loaderRef.current.classList.add('active');
		fetch(url)
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
				// console.log('erreur de requete : ', err);
				errorMsg && errorContainerRef.current.classList.add('active');
				setErrorMsg('Error 404. Please try again later.');
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
						<p className="temperature">{weather.temp}°C</p>
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
						<img src="/src/assets/browser.svg" alt="error icon" />
						<p className="error-message">{errorMsg}</p>
					</div>
				)}
			</div>
		</main>
	);
};
export default CardWeather;
