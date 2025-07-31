/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import {
	useBlockProps,
	useInnerBlocksProps,
	BlockContextProvider,
	BlockControls,
	store as blockEditorStore,
	__experimentalUseBlockPreview as useBlockPreview,
} from '@wordpress/block-editor';
import { ToolbarGroup, Spinner } from '@wordpress/components';
import { grid, list } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import { memo, useMemo, useState } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';

/**
 * External dependencies
 */
import clsx from 'clsx';

function getTemplateFromLayout( layout ) {
	switch ( layout ) {
		case 'title-link':
			return [ [ 'core/term-title', { isLink: true } ] ];
		case 'title-link-desc':
			return [
				[ 'core/term-title', { isLink: true } ],
				[ 'core/term-description' ],
			];
		case 'title-desc':
			return [ [ 'core/term-title' ], [ 'core/term-description' ] ];
		case 'image-title-link':
			return [
				[ 'core/term-title', { isLink: true } ],
				[ 'core/image' ],
			];
		case 'image-title-link-desc':
			return [
				[ 'core/term-title', { isLink: true } ],
				[ 'core/term-description' ],
				[ 'core/image' ],
			];
		default:
			return [ [ 'core/term-title' ] ];
	}
}

function TermTemplateInnerBlocks( { classList, template } ) {
	const innerBlocksProps = useInnerBlocksProps(
		{ className: clsx( 'wp-block-term', classList ) },
		{
			template,
			__unstableDisableLayoutClassNames: true,
		}
	);
	return <li { ...innerBlocksProps } />;
}

function TermTemplateBlockPreview( {
	blocks,
	blockContextId,
	classList,
	isHidden,
	setActiveBlockContextId,
} ) {
	const blockPreviewProps = useBlockPreview( {
		blocks,
		props: {
			className: clsx( 'wp-block-term', classList ),
		},
	} );

	const handleOnClick = () => {
		setActiveBlockContextId( blockContextId );
	};

	const style = {
		display: isHidden ? 'none' : undefined,
	};

	return (
		<li
			{ ...blockPreviewProps }
			tabIndex={ 0 }
			// eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
			role="button"
			onClick={ handleOnClick }
			onKeyPress={ handleOnClick }
			style={ style }
		/>
	);
}

const MemoizedTermTemplateBlockPreview = memo( TermTemplateBlockPreview );

export default function TermTemplateEdit( {
	context: { taxonomy, order, orderby, hideEmpty, perPage, templateOption },
	attributes,
	setAttributes,
	clientId,
	__unstableLayoutClassNames,
} ) {
	const { layout } = attributes;
	const { type: layoutType = 'default', columnCount = 3 } = layout || {};
	const [ activeBlockContextId, setActiveBlockContextId ] = useState();
	const { terms, blocks } = useSelect(
		( select ) => {
			const { getBlocks } = select( blockEditorStore );
			return {
				terms: select( coreStore ).getEntityRecords(
					'taxonomy',
					taxonomy,
					{
						per_page: perPage,
						order,
						orderby,
						hide_empty: hideEmpty,
					}
				),
				blocks: getBlocks( clientId ),
			};
		},
		[ taxonomy, perPage, order, orderby, hideEmpty, clientId ]
	);

	const termContexts = useMemo(
		() =>
			terms?.map( ( term ) => ( {
				termId: term.id,
				termLink: term.link,
				termName: term.name,
				termDescription: term.description,
				taxonomy,
				classList: term.class_list ?? '',
			} ) ),
		[ terms, taxonomy ]
	);

	const blockProps = useBlockProps( {
		className: clsx( __unstableLayoutClassNames, {
			'wp-block-term-template': true,
			[ `columns-${ columnCount }` ]:
				layoutType === 'grid' && columnCount,
		} ),
	} );

	const layoutControls = [
		{
			icon: list,
			title: __( 'List view' ),
			onClick: () =>
				setAttributes( {
					layout: { ...layout, ...{ type: 'default' } },
				} ),
			isActive: layoutType === 'default',
		},
		{
			icon: grid,
			title: __( 'Grid view' ),
			onClick: () =>
				setAttributes( {
					layout: { ...layout, ...{ type: 'grid', columnCount } },
				} ),
			isActive: layoutType === 'grid',
		},
	];

	if ( ! terms ) {
		return <Spinner />;
	}

	if ( terms.length === 0 ) {
		return <p>{ __( 'No terms found.' ) }</p>;
	}

	const template = getTemplateFromLayout( templateOption );

	return (
		<>
			<BlockControls>
				<ToolbarGroup controls={ layoutControls } />
			</BlockControls>
			<ul { ...blockProps }>
				{ termContexts &&
					termContexts.map( ( context ) => (
						<BlockContextProvider
							key={ context.termId }
							value={ context }
						>
							{ context.termId ===
							( activeBlockContextId ||
								termContexts?.[ 0 ]?.termId ) ? (
								<TermTemplateInnerBlocks
									classList={ context.classList }
									template={ template }
									uniqueId={ `${ clientId }-${ context.termId }` }
								/>
							) : null }
							<MemoizedTermTemplateBlockPreview
								blocks={ blocks }
								blockContextId={ context.termId }
								classList={ context.classList }
								setActiveBlockContextId={
									setActiveBlockContextId
								}
								isHidden={
									context.termId ===
									( activeBlockContextId ||
										termContexts?.[ 0 ]?.termId )
								}
							/>
						</BlockContextProvider>
					) ) }
			</ul>
		</>
	);
}
