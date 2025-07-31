/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import {
	AlignmentControl,
	BlockControls,
	InspectorControls,
	useBlockProps,
	PlainText,
	HeadingLevelDropdown,
	useBlockEditingMode,
} from '@wordpress/block-editor';
import { ToggleControl, TextControl, PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function TermTitleEdit( {
	attributes: { level, levelOptions, textAlign, isLink, rel, linkTarget },
	setAttributes,
	context: { termName, termLink },
} ) {
	const TagName = level === 0 ? 'p' : `h${ level }`;
	const blockProps = useBlockProps( {
		className: clsx( {
			[ `has-text-align-${ textAlign }` ]: textAlign,
		} ),
	} );
	const blockEditingMode = useBlockEditingMode();

	let titleElement = (
		<TagName { ...blockProps }>{ __( 'Term Name' ) }</TagName>
	);

	if ( termName ) {
		titleElement = (
			<PlainText
				tagName={ TagName }
				placeholder={ __( 'No title' ) }
				value={ termName }
				__experimentalVersion={ 2 }
				{ ...blockProps }
			/>
		);
	}
	const finalIsLink = typeof isLink === 'boolean' ? isLink : false;
	if ( finalIsLink && termLink && termName ) {
		titleElement = (
			<TagName { ...blockProps }>
				<PlainText
					tagName="a"
					href={ termLink }
					target={ linkTarget }
					rel={ rel }
					placeholder={ ! termName.length ? __( 'No title' ) : null }
					value={ termName }
					__experimentalVersion={ 2 }
				/>
			</TagName>
		);
	}

	return (
		<>
			{ blockEditingMode === 'default' && (
				<>
					<BlockControls group="block">
						<HeadingLevelDropdown
							value={ level }
							options={ levelOptions }
							onChange={ ( newLevel ) =>
								setAttributes( { level: newLevel } )
							}
						/>
						<AlignmentControl
							value={ textAlign }
							onChange={ ( nextAlign ) => {
								setAttributes( { textAlign: nextAlign } );
							} }
						/>
					</BlockControls>
					<InspectorControls>
						<PanelBody title={ __( 'Settings' ) }>
							<ToggleControl
								__nextHasNoMarginBottom
								label={ __( 'Make title a link' ) }
								onChange={ () =>
									setAttributes( { isLink: ! isLink } )
								}
								checked={ isLink }
							/>
							{ isLink && (
								<>
									<ToggleControl
										__nextHasNoMarginBottom
										label={ __( 'Open in new tab' ) }
										onChange={ ( value ) =>
											setAttributes( {
												linkTarget: value
													? '_blank'
													: '_self',
											} )
										}
										checked={ linkTarget === '_blank' }
									/>
									<TextControl
										__next40pxDefaultSize
										__nextHasNoMarginBottom
										label={ __( 'Link rel' ) }
										value={ rel }
										onChange={ ( newRel ) =>
											setAttributes( { rel: newRel } )
										}
									/>
								</>
							) }
						</PanelBody>
					</InspectorControls>
				</>
			) }
			{ titleElement }
		</>
	);
}
