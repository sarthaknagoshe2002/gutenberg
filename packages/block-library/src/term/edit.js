/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import {
	useBlockProps,
	InspectorControls,
	__experimentalBlockVariationPicker,
	useInnerBlocksProps,
	BlockContextProvider,
} from '@wordpress/block-editor';
import { store as coreStore } from '@wordpress/core-data';
import { PanelBody, ToggleControl, RangeControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useScopedBlockVariations } from './utils';

export default function Edit( { attributes, setAttributes } ) {
	const { taxonomy, order, orderby, hideEmpty, perPage, templateOption } =
		attributes;
	const blockProps = useBlockProps();
	const taxonomies =
		useSelect( ( select ) => select( coreStore ).getTaxonomies(), [] ) ||
		[];
	const terms = useSelect(
		( s ) =>
			taxonomy
				? s( coreStore ).getEntityRecords( 'taxonomy', taxonomy, {
						order,
						orderby,
						hide_empty: hideEmpty,
						per_page: perPage,
				  } )
				: null,
		[ taxonomy, order, orderby, hideEmpty, perPage ]
	);

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		template: [ [ 'core/term-template' ] ],
		allowedBlocks: [ 'core/term-template' ],
	} );

	let content;
	const scopeVariations = useScopedBlockVariations( attributes );

	if ( ! templateOption ) {
		content = (
			<__experimentalBlockVariationPicker
				label={ __( 'Choose a layout' ) }
				variations={ scopeVariations }
				onSelect={ ( v ) =>
					setAttributes( { templateOption: v.name } )
				}
			/>
		);
	} else if ( terms === null ) {
		content = <p>{ __( 'Loading…' ) }</p>;
	} else if ( terms.length === 0 ) {
		content = <p>{ __( 'No terms found.' ) }</p>;
	} else {
		content = (
			<BlockContextProvider
				key={ templateOption }
				value={ templateOption }
			>
				<div { ...innerBlocksProps } />
			</BlockContextProvider>
		);
	}

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Term Query Settings' ) }>
					<select
						value={ taxonomy }
						onChange={ ( evt ) =>
							setAttributes( { taxonomy: evt.target.value } )
						}
					>
						{ taxonomies.map( ( t ) => (
							<option key={ t.slug } value={ t.slug }>
								{ t.name }
							</option>
						) ) }
					</select>
					<ToggleControl
						label={ __( 'Hide empty' ) }
						checked={ hideEmpty }
						onChange={ ( v ) => setAttributes( { hideEmpty: v } ) }
						__nextHasNoMarginBottom
					/>
					<RangeControl
						label={ __( 'Number of terms' ) }
						value={ perPage }
						min={ 1 }
						max={ 20 }
						onChange={ ( v ) => setAttributes( { perPage: v } ) }
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
				</PanelBody>
			</InspectorControls>

			{ content }
		</>
	);
}
