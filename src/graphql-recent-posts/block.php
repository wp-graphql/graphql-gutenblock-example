<?php
register_block_type( 'graphql/recent-posts', [
	/**
	 * This is the server side callback for rendering a block when the frontend (theme) renders
	 * the content with the block in it.
	 *
	 * The callback receives the attributes from the block.
	 */
	'render_callback' => function( array $attributes ) {
		$output = '<h2>Frontend Output for Recent Posts!</h2>';
		return $output;
	}
] );
