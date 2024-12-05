/**
 * WordPress dependencies
 */
import {
	useBlockProps,
	InspectorControls,
	BlockControls,
} from '@wordpress/block-editor';
import {
	PanelBody,
	ToolbarGroup,
	ToolbarDropdownMenu,
} from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { resultsFound, displayingResults } from './icons';

export default function QueryTotalEdit( { attributes, setAttributes } ) {
	const { displayType } = attributes;

	// Mock values.
	const totalResults = 12;
	const currentPage = 1;
	const resultsPerPage = 10;

	// Helper to calculate the range for "Displaying X – Y of Z".
	const calculateRange = () => {
		const start = ( currentPage - 1 ) * resultsPerPage + 1;
		const end = Math.min( currentPage * resultsPerPage, totalResults );
		return `${ start } – ${ end }`;
	};

	// Block properties and classes.
	const blockProps = useBlockProps();

	const getButtonPositionIcon = () => {
		switch ( displayType ) {
			case 'total-results':
				return resultsFound;
			case 'range-display':
				return displayingResults;
		}
	};

	const buttonPositionControls = [
		{
			role: 'menuitemradio',
			title: __( 'Total results' ),
			isActive: displayType === 'total-results',
			icon: resultsFound,
			onClick: () => {
				setAttributes( { displayType: 'total-results' } );
			},
		},
		{
			role: 'menuitemradio',
			title: __( 'Range display' ),
			isActive: displayType === 'range-display',
			icon: displayingResults,
			onClick: () => {
				setAttributes( { displayType: 'range-display' } );
			},
		},
	];

	// Controls for the block.
	const controls = (
		<>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarDropdownMenu
						icon={ getButtonPositionIcon() }
						label={ __( 'Change display type' ) }
						controls={ buttonPositionControls }
					/>
				</ToolbarGroup>
			</BlockControls>
			<InspectorControls>
				<PanelBody title={ __( 'Display Settings' ) }>
					<p>
						{ __( 'Choose the type of information to display.' ) }
					</p>
				</PanelBody>
			</InspectorControls>
		</>
	);

	// Render output based on the selected display type.
	const renderDisplay = () => {
		if ( displayType === 'total-results' ) {
			return (
				<div>
					{ sprintf(
						/* translators: %d is the total number of results found. */
						__( '%d results found' ),
						totalResults
					) }
				</div>
			);
		}

		if ( displayType === 'range-display' ) {
			return (
				<div>
					{ sprintf(
						/* translators: %1$s is the range (e.g., 1–10), %2$d is the total number of results. */
						__( 'Displaying %1$s of %2$d' ),
						calculateRange(),
						totalResults
					) }
				</div>
			);
		}

		return null;
	};

	return (
		<div { ...blockProps }>
			{ controls }
			{ renderDisplay() }
		</div>
	);
}
