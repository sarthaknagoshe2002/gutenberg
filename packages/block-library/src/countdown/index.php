<?php
/**
 * Renders the Countdown block.
 *
 * @since 6.8.0
 *
 * @param array $attributes Block attributes.
 * @return string Rendered block content.
 */

function render_block_core_countdown( $attributes ) {
	$end_time      = $attributes['endTime'] ?? '';
	$show_days     = $attributes['showDays'] ?? true;
	$show_hours    = $attributes['showHours'] ?? true;
	$show_minutes  = $attributes['showMinutes'] ?? true;
	$show_seconds  = $attributes['showSeconds'] ?? true;
	$action_on_end = $attributes['actionOnEnd'] ?? 'hide';
	$action_value  = $attributes['actionValue'] ?? '';

	$bg_color     = isset( $attributes['bgColor'] ) ? esc_attr( $attributes['bgColor'] ) : '#ffffff';
	$border_color = isset( $attributes['borderColor'] ) ? esc_attr( $attributes['borderColor'] ) : '#000000';

	// Calculate the time remaining
	$current_time   = current_time( 'timestamp' );
	$end_time_ts    = strtotime( $end_time );
	$remaining_time = $end_time_ts - $current_time;

	if ( 0 <= $remaining_time ) {
		add_action( 'wp_enqueue_scripts', 'block_core_countdown_enqueue_custom_script' );
	}
	// If the countdown has ended and the action is redirect, perform the redirect
	if ( 0 >= $remaining_time && 'redirect' === $action_on_end && preg_match( '/^https?:\/\/[\w.-]+\.[a-z]{2,6}/i', $action_value ) && ! is_admin() ) {
		wp_redirect( esc_url( $action_value ) );
		return;
	}

	// If the action is "hide", don't render the countdown div
	if ( 'hide' === $action_on_end && 0 >= $remaining_time ) {
		// If the action is "hide" and countdown has ended, only show the message
		return;
	}

	// Calculate remaining days, hours, minutes, seconds
	$days_left    = floor( $remaining_time / ( 60 * 60 * 24 ) );
	$hours_left   = floor( ( $remaining_time / ( 60 * 60 ) ) % 24 );
	$minutes_left = floor( ( $remaining_time / 60 ) % 60 );
	$seconds_left = floor( $remaining_time % 60 );

	// Prepare data attributes for the countdown
	$data_attrs = array(
		'data-end-time="' . esc_attr( $end_time ) . '"',
		'data-show-days="' . ( $show_days ? 'true' : 'false' ) . '"',
		'data-show-hours="' . ( $show_hours ? 'true' : 'false' ) . '"',
		'data-show-minutes="' . ( $show_minutes ? 'true' : 'false' ) . '"',
		'data-show-seconds="' . ( $show_seconds ? 'true' : 'false' ) . '"',
		'data-action-on-end="' . esc_attr( $action_on_end ) . '"',
		'data-action-value="' . esc_attr( $action_value ) . '"',
	);

	$wrapper_attributes = get_block_wrapper_attributes();

	ob_start();
	?>
	<div <?php echo esc_attr( implode( ' ', $data_attrs ) ); ?> <?php echo $wrapper_attributes; ?> >
		<?php if ( $remaining_time >= 0 ) : ?>
			<div class="countdown">
				<?php if ( $show_days ) : ?>
					<div class="countdown-box countdown-days" style="background-color: <?php echo esc_attr( $bg_color ); ?>; 
			border-color: <?php echo esc_attr( $border_color ); ?>;">
						<span class="countdown-value"><?php echo esc_html( $days_left ); ?></span>
						<small>Days</small>
					</div>
				<?php endif; ?>
				<?php if ( $show_hours ) : ?>
					<div class="countdown-box countdown-hours" style="background-color: <?php echo esc_attr( $bg_color ); ?>; 
			border-color: <?php echo esc_attr( $border_color ); ?>;">
						<span class="countdown-value"><?php echo esc_html( $hours_left ); ?></span>
						<small>Hours</small>
					</div>
				<?php endif; ?>
				<?php if ( $show_minutes ) : ?>
					<div class="countdown-box countdown-minutes" style="background-color: <?php echo esc_attr( $bg_color ); ?>; 
			border-color: <?php echo esc_attr( $border_color ); ?>;">
						<span class="countdown-value"><?php echo esc_html( $minutes_left ); ?></span>
						<small>Minutes</small>
					</div>
				<?php endif; ?>
				<?php if ( $show_seconds ) : ?>
					<div class="countdown-box countdown-seconds" style="background-color: <?php echo esc_attr( $bg_color ); ?>; 
			border-color: <?php echo esc_attr( $border_color ); ?>;">
						<span class="countdown-value"><?php echo esc_html( $seconds_left ); ?></span>
						<small>Seconds</small>
					</div>
				<?php endif; ?>
			</div>
		<?php endif; ?>
		<?php if ( 'showMessage' === $action_on_end ) : ?>
			<div class="countdown-end-message" style="<?php echo $remaining_time <= 0 ? 'display: block;' : 'display: none;'; ?>">
				<?php echo esc_html( $action_value ? $action_value : 'Countdown Ended' ); ?>
			</div>
		<?php endif; ?>
	</div>
	<?php
	return ob_get_clean();
}

/**
 * Registers the `countdown` block.
 *
 * @since 6.8.0
 */
function register_block_core_countdown() {
	register_block_type_from_metadata(
		__DIR__ . '/countdown',
		array(
			'render_callback' => 'render_block_core_countdown',
		)
	);
}

/**
 * Conditionally enqueue the countdown JavaScript.
 *
 * @since 6.8.0
 */
function block_core_countdown_enqueue_custom_script() {
	wp_register_script(
		'core-countdown-script',
		'/wp-content/plugins/gutenberg/packages/block-library/src/countdown/view.js',
		array(),
		'1.0.0',
		true
	);
	wp_enqueue_script( 'core-countdown-script' );
}

if ( ! is_admin() ) {
	add_action( 'init', 'register_block_core_countdown' );
}