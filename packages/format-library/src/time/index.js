/**
 * External dependencies
 */
import { gmdate, strtotime } from 'locutus/php/datetime';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { toggleFormat } from '@wordpress/rich-text';
import {
	RichTextToolbarButton,
	RichTextShortcut,
} from '@wordpress/block-editor';
import { postDate as icon } from '@wordpress/icons';

const name = 'core/time';
const title = __( 'Time' );

export const time = {
	name,
	title,
	tagName: 'time',
	className: null,
	attributes: {
		datetime: 'datetime',
	},
	edit( { isActive, value, onChange, onFocus } ) {
		function onClick() {
			const dateDescription = value.text
				.slice( value.start, value.end )
				.trim();

			// Exit early if no selection or format is already active
			if ( ! dateDescription || isActive ) {
				onChange(
					toggleFormat( value, {
						type: name,
					} )
				);
				return;
			}

			// Clean up the date string
			const dateCleaned = dateDescription
				.replace( 'at ', '' ) // Remove "at"
				.replace( 'UTC', 'GMT' ); // Replace "UTC" with "GMT"

			// Parse the date string using strtotime
			const timestamp = strtotime( dateCleaned );

			// If parsing fails, toggle format without enhancement
			if ( ! timestamp ) {
				onChange(
					toggleFormat( value, {
						type: name,
					} )
				);
				return;
			}

			// Format the datetime attributes using gmdate
			const datetime = gmdate( 'c', timestamp ); // ISO 8601 format
			const datetimeISO = gmdate( 'Ymd\\THi', timestamp ); // Compact ISO format

			// Apply the format with parsed datetime attributes
			onChange(
				toggleFormat( value, {
					type: name,
					attributes: {
						datetime,
						'data-iso': datetimeISO,
						style: 'text-decoration: underline; text-decoration-style: dotted',
					},
				} )
			);

			onFocus();
		}

		return (
			<>
				<RichTextShortcut
					type="access"
					character="d"
					onUse={ onClick }
				/>
				<RichTextToolbarButton
					icon={ icon }
					title={ title }
					onClick={ onClick }
					isActive={ isActive }
					role="menuitemcheckbox"
				/>
			</>
		);
	},
};
