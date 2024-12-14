/**
 * WordPress dependencies
 */
import {
	useBlockProps,
	BlockControls,
	RichText,
} from '@wordpress/block-editor';
import {
	ToolbarGroup,
	ToolbarDropdownMenu,
	ToolbarButton,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { resultsFound, displayingResults } from './icons';

export default function QueryTotalEdit( { attributes, setAttributes } ) {
	const {
		displayType,
		totalResultsText,
		rangeDisplayTextPrimary,
		rangeDisplayTextSecondary,
		showTotal,
	} = attributes;

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
					{ /* Show toggle for "showTotal" only when range-display is selected */ }
					{ displayType === 'range-display' && (
						<ToolbarButton
							icon={ showTotal ? 'visibility' : 'hidden' }
							label={ __( 'Toggle total visibility' ) }
							onClick={ () =>
								setAttributes( { showTotal: ! showTotal } )
							}
						>
							{ __( 'Toggle Total visibility' ) }
						</ToolbarButton>
					) }
				</ToolbarGroup>
			</BlockControls>
		</>
	);

	// Render output based on the selected display type.
	const renderDisplay = () => {
		if ( displayType === 'total-results' ) {
			return (
				<div>
					<span>
						<strong>12</strong>{ ' ' }
					</span>
					<RichText
						tagName="span"
						value={ totalResultsText }
						placeholder={ totalResultsText }
						onChange={ ( value ) =>
							setAttributes( { totalResultsText: value } )
						}
					/>
				</div>
			);
		}

		if ( displayType === 'range-display' ) {
			return (
				<div>
					<RichText
						tagName="span"
						value={ rangeDisplayTextPrimary }
						placeholder={ rangeDisplayTextPrimary }
						onChange={ ( value ) =>
							setAttributes( { rangeDisplayTextPrimary: value } )
						}
					/>
					<span>
						{ ' ' }
						<strong>1 – 10</strong>{ ' ' }
					</span>
					{ showTotal && (
						<>
							<RichText
								tagName="span"
								value={ rangeDisplayTextSecondary }
								placeholder={ rangeDisplayTextSecondary }
								onChange={ ( value ) =>
									setAttributes( {
										rangeDisplayTextSecondary: value,
									} )
								}
							/>
							<span>
								{ ' ' }
								<strong>12</strong>
							</span>
						</>
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
