/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	DateTimePicker,
	Popover,
	Button,
	__experimentalHStack as HStack,
} from '@wordpress/components';
import { RichTextToolbarButton } from '@wordpress/block-editor';
import { useState } from '@wordpress/element';
import { removeFormat, applyFormat, useAnchor } from '@wordpress/rich-text';
import { postDate as icon } from '@wordpress/icons';
import { dateI18n, getSettings } from '@wordpress/date';

const name = 'core/time';
const title = __( 'Time' );

export const time = {
	name,
	title,
	tagName: 'time',
	className: null,
	edit: Edit,
	attributes: {
		datetime: 'datetime',
	},
};

function Edit( { isActive, value, onChange, contentRef } ) {
	const [ date, setDate ] = useState( new Date() );
	const [ isPopoverVisible, setIsPopoverVisible ] = useState( false );
	const togglePopover = () => setIsPopoverVisible( ( state ) => ! state );
	const dateTimeSettings = getSettings();

	const applyDate = () => {
		const formattedDate = dateI18n( 'c', date );
		const attributes = {
			datetime: formattedDate,
		};
		onChange(
			applyFormat( value, {
				type: name,
				attributes,
			} )
		);
		setIsPopoverVisible( false );
	};

	return (
		<>
			<RichTextToolbarButton
				icon={ icon }
				label={ title }
				title={ title }
				onClick={ () => {
					if ( isActive ) {
						onChange( removeFormat( value, name ) );
					} else {
						togglePopover();
					}
				} }
				isActive={ isActive }
				role="menuitemcheckbox"
			/>
			{ isPopoverVisible && (
				<InlineDateUI
					contentRef={ contentRef }
					onClose={ togglePopover }
					onApply={ applyDate }
					date={ date }
					onChangeDate={ setDate }
					dateTimeSettings={ dateTimeSettings }
				/>
			) }
		</>
	);
}

function InlineDateUI( {
	contentRef,
	onClose,
	onApply,
	date,
	onChangeDate,
	dateTimeSettings,
} ) {
	const popoverAnchor = useAnchor( {
		editableContentElement: contentRef.current,
		settings: time,
	} );

	return (
		<Popover
			className="block-editor-format-toolbar__date-popover"
			anchor={ popoverAnchor }
			onClose={ onClose }
		>
			<DateTimePicker
				is12Hour={ dateTimeSettings.formats.time }
				currentDate={ date }
				onChange={ onChangeDate }
				startOfWeek={ dateTimeSettings.l10n.startOfWeek }
			/>
			<HStack alignment="right">
				<Button
					__next40pxDefaultSize
					variant="primary"
					text={ __( 'Apply' ) }
					onClick={ onApply }
				/>
			</HStack>
		</Popover>
	);
}
