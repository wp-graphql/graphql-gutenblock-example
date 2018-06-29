import React from 'react'

/**
 * Reference the registerBlockType from the Gutenberg wp.blocks exports
 */
const { registerBlockType } = wp.blocks;

/**
 * Register the block so that the Gutenberg client is aware of it
 */
registerBlockType( 'graphql/recent-posts', {
	title: 'GraphQL Recent Posts',
	category: 'widgets',
	icon: 'grid-view',
	edit: (props) => <h2>Edit Recent Posts</h2>,
	save: () => {
		// Nothing will be saved by this block. It's dynamically rendered in the Editor
		// and in the theme
		return null;
	}
} );
