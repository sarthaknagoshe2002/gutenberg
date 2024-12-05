/**
 * External dependencies
 */
import clsx from 'clsx';

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
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { resultsFound, displayingResults } from './icons';

export default function QueryTotalEdit( {
	attributes,
	setAttributes,
	className,
} ) {
	const { displayType } = attributes;

	const [ totalResults, setTotalResults ] = useState( 0 );
	const [ currentPage, setCurrentPage ] = useState( 1 );
	const [ resultsPerPage, setResultsPerPage ] = useState( 10 );

	// Fetch or calculate the total results, current page, and results per page.
	useEffect( () => {
		// Mock values for demonstration. Replace with actual query data.
		const mockTotalResults = 12;
		const mockCurrentPage = 1;
		const mockResultsPerPage = 10;

		setTotalResults( mockTotalResults );
		setCurrentPage( mockCurrentPage );
		setResultsPerPage( mockResultsPerPage );
	}, [] );

	// Helper to calculate the range for "Displaying X – Y of Z".
	const calculateRange = () => {
		const start = ( currentPage - 1 ) * resultsPerPage + 1;
		const end = Math.min( currentPage * resultsPerPage, totalResults );
		return `${ start } – ${ end }`;
	};

	// Block properties and classes.
	const blockProps = useBlockProps( {
		className: clsx( className, 'query-total-block' ),
	} );

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
			return <div>{ `${ totalResults } results found` }</div>;
		}

		if ( displayType === 'range-display' ) {
			return (
				<div>{ `Displaying ${ calculateRange() } of ${ totalResults }` }</div>
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
