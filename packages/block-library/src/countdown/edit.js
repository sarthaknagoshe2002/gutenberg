// index.js
/**
 * WordPress dependencies
 */
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	DateTimePicker,
	TextControl,
	SelectControl,
} from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';

export default function CountdownEdit( { attributes, setAttributes } ) {
	const {
		endTime,
		showDays,
		showHours,
		showMinutes,
		showSeconds,
		actionOnEnd,
		actionValue,
	} = attributes;

	const [ remainingTime, setRemainingTime ] = useState();

	useEffect( () => {
		const interval = setInterval( () => {
			const now = new Date();
			const end = endTime
				? new Date( endTime )
				: new Date( now.getTime() + 60 * 60 * 1000 );
			const difference = end - now;
			if ( difference <= 0 ) {
				clearInterval( interval );
				setRemainingTime( null );
			} else {
				setRemainingTime( {
					days: Math.floor( difference / ( 1000 * 60 * 60 * 24 ) ),
					hours: Math.floor(
						( difference / ( 1000 * 60 * 60 ) ) % 24
					),
					minutes: Math.floor( ( difference / ( 1000 * 60 ) ) % 60 ),
					seconds: Math.floor( ( difference / 1000 ) % 60 ),
				} );
			}
		}, 1000 );

		return () => clearInterval( interval );
	}, [ endTime, remainingTime ] );
	return (
		<div { ...useBlockProps() }>
			<InspectorControls>
				<PanelBody title="Countdown Settings">
					<DateTimePicker
						label="End Time"
						currentDate={ endTime }
						onChange={ ( newTime ) =>
							setAttributes( { endTime: newTime } )
						}
					/>
					<ToggleControl
						label="Show Days"
						checked={ showDays }
						onChange={ () =>
							setAttributes( { showDays: ! showDays } )
						}
						__nextHasNoMarginBottom
					/>
					<ToggleControl
						label="Show Hours"
						checked={ showHours }
						onChange={ () =>
							setAttributes( { showHours: ! showHours } )
						}
						__nextHasNoMarginBottom
					/>
					<ToggleControl
						label="Show Minutes"
						checked={ showMinutes }
						onChange={ () =>
							setAttributes( { showMinutes: ! showMinutes } )
						}
						__nextHasNoMarginBottom
					/>
					<ToggleControl
						label="Show Seconds"
						checked={ showSeconds }
						onChange={ () =>
							setAttributes( { showSeconds: ! showSeconds } )
						}
						__nextHasNoMarginBottom
					/>
					<SelectControl
						label="Action on End"
						value={ actionOnEnd }
						options={ [
							{ value: 'hide', label: 'Hide Countdown' },
							{ value: 'showMessage', label: 'Show Message' },
							{ value: 'redirect', label: 'Redirect to URL' },
						] }
						onChange={ ( value ) => {
							setAttributes( {
								actionOnEnd: value,
								actionValue: '',
							} );
						} }
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
					{ actionOnEnd === 'showMessage' && (
						<TextControl
							label="Message to Display"
							value={ actionValue }
							onChange={ ( value ) =>
								setAttributes( { actionValue: value } )
							}
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>
					) }
					{ actionOnEnd === 'redirect' && (
						<TextControl
							label="Redirect URL"
							value={ actionValue }
							onChange={ ( value ) =>
								setAttributes( { actionValue: value } )
							}
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>
					) }
				</PanelBody>
			</InspectorControls>
			{ remainingTime ? (
				<div className="countdown">
					{ showDays && (
						<div className="countdown-box">
							<span>{ remainingTime?.days || 0 }</span>
							<small>Days</small>
						</div>
					) }
					{ showHours && (
						<div className="countdown-box">
							<span>{ remainingTime?.hours || 0 }</span>
							<small>Hours</small>
						</div>
					) }
					{ showMinutes && (
						<div className="countdown-box">
							<span>{ remainingTime?.minutes || 0 }</span>
							<small>Minutes</small>
						</div>
					) }
					{ showSeconds && (
						<div className="countdown-box">
							<span>{ remainingTime?.seconds || 0 }</span>
							<small>Seconds</small>
						</div>
					) }
				</div>
			) : (
				<div className="countdown-end-message">
					{ ( actionOnEnd === 'showMessage' && actionValue ) ||
						'Countdown Ended' }
				</div>
			) }
		</div>
	);
}
