<?php
/**
 * Renders the `core/post-template` block on the server.
 *
 * @since 6.3.0 Changed render_block_context priority to `1`.
 *
 * @global WP_Query $wp_query WordPress Query object.
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block default content.
 *
 * @return string Returns the output of the query, structured using the layout defined by the block's inner blocks.
 */
function render_block_core_term_template( $attributes, $content ) {
	$layout_type = $attributes['layout']['type'] ?? 'list';
	$column_count = $attributes['layout']['columnCount'] ?? 3;

	$classes = [ 'wp-block-term-template' ];
	if ( $layout_type === 'grid' ) {
		$classes[] = 'columns-' . intval( $column_count );
	}

	return sprintf(
		'<li class="%s">%s</li>',
		esc_attr( implode( ' ', $classes ) ),
		$content
	);
}

/**
 * Registers the `core/post-template` block on the server.
 *
 * @since 5.8.0
 */
function register_block_core_term_template() {
	register_block_type_from_metadata(
		__DIR__ . '/term-template',
		array(
			'render_callback'   => 'render_block_core_term_template',
			'skip_inner_blocks' => true,
		)
	);
}
add_action( 'init', 'register_block_core_term_template' );
