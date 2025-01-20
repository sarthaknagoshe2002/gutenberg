document.addEventListener( 'DOMContentLoaded', () => {
	const countdownElements = document.querySelectorAll(
		'.wp-block-countdown'
	);

	countdownElements.forEach( ( element ) => {
		const endTime = new Date( element.dataset.endTime );
		const showDays = element.dataset.showDays === 'true';
		const showHours = element.dataset.showHours === 'true';
		const showMinutes = element.dataset.showMinutes === 'true';
		const showSeconds = element.dataset.showSeconds === 'true';
		const actionOnEnd = element.dataset.actionOnEnd;
		const actionValue = element.dataset.actionValue;

		const updateCountdown = () => {
			const now = new Date();
			const difference = endTime - now;

			if ( difference <= 0 ) {
				element.querySelector( '.countdown' ).style.display = 'none';
				if ( 'hide' === actionOnEnd ) {
					clearInterval( interval );
					return;
				}
				if ( actionOnEnd === 'redirect' ) {
					window.location.href = actionValue;
				}
				if ( actionOnEnd === 'showMessage' ) {
					const endMessage = element.querySelector(
						'.countdown-end-message'
					);
					endMessage.style.display = 'block';
				}

				clearInterval( interval );
				return;
			}

			const days = Math.floor( difference / ( 1000 * 60 * 60 * 24 ) );
			const hours = Math.floor(
				( difference / ( 1000 * 60 * 60 ) ) % 24
			);
			const minutes = Math.floor( ( difference / ( 1000 * 60 ) ) % 60 );
			const seconds = Math.floor( ( difference / 1000 ) % 60 );

			if ( showDays ) {
				element.querySelector(
					'.countdown-days .countdown-value'
				).textContent = days;
			}
			if ( showHours ) {
				element.querySelector(
					'.countdown-hours .countdown-value'
				).textContent = hours;
			}
			if ( showMinutes ) {
				element.querySelector(
					'.countdown-minutes .countdown-value'
				).textContent = minutes;
			}
			if ( showSeconds ) {
				element.querySelector(
					'.countdown-seconds .countdown-value'
				).textContent = seconds;
			}
		};

		const interval = setInterval( updateCountdown, 1000 );
		updateCountdown();
	} );
} );
