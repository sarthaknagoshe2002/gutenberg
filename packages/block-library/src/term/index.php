<?php
/**
 * Server-side rendering for the Term Query Loop block.
 *
 * @param array $attributes The block attributes.
 *
 * @return string
 */
function render_block_core_term_query_loop( $attributes ) {
	$taxonomy        = $attributes['taxonomy'] ?? '';
	$order           = $attributes['order'] ?? 'asc';
	$orderby         = $attributes['orderby'] ?? 'name';
	$hide_empty      = $attributes['hideEmpty'] ?? false;
	$per_page        = $attributes['perPage'] ?? 10;
	$template_option = $attributes['templateOption'] ?? 'title-link';

	if ( empty( $taxonomy ) ) {
		return '';
	}

	$terms = get_terms( [
		'taxonomy'   => $taxonomy,
		'orderby'    => $orderby,
		'order'      => $order,
		'hide_empty' => $hide_empty,
		'number'     => $per_page,
	] );

	if ( is_wp_error( $terms ) || empty( $terms ) ) {
		return '<p>' . esc_html__( 'No terms found.', 'text-domain' ) . '</p>';
	}

	$output = '<ul class="wp-block-term-loop">';
	foreach ( $terms as $term ) {
		$inner_blocks = new WP_Block(
			[
				'blockName' => 'core/term-template',
				'attrs'     => array_merge(
					$attributes,
					[
						'termId'          => $term->term_id,
						'termName'        => $term->name,
						'termLink'        => get_term_link( $term ),
						'termDescription' => $term->description,
						'templateOptionName' => $template_option,
					]
				),
			]
		);
		$output .= $inner_blocks->render();
	}
	$output .= '</ul>';

	return $output;
}

function register_block_core_term_query_loop() {
	register_block_type_from_metadata(
		__DIR__ . '/term',
		array(
			'render_callback' => 'render_block_core_term_query_loop',
		)
	);
}
add_action( 'init', 'register_block_core_term_query_loop' );
