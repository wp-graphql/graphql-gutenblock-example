import React from 'react'
import { Card, Avatar, Tag } from 'antd'

/**
 * Reference the registerBlockType from the Gutenberg wp.blocks exports
 */
const { registerBlockType } = wp.blocks;
const { Component } = wp.element;

/**
 * Hard-code some data that we can use to populate our Block components.
 *
 * We will replace this later with live data fetched from our WPGraphQL endpoint.
 */
const data = {
	posts: {
		nodes: [
			{
				id: 'post1',
				title: 'JS for WP Conf',
				date: 'Jun 29, 2018',
				featuredImage: {
					sourceUrl: 'https://placehold.it/100x100'
				},
				author: {
					firstName: 'Jason',
					lastName: 'Bahl',
					avatar: {
						avatarUrl: 'https://placehold.it/100x100'
					}
				},
				tags: {
					nodes: [
						{
							name: 'Example Tag 1'
						},
						{
							name: 'Example Tag 2'
						}
					]
				}
			},
			{
				id: 'post2',
				title: 'Use GraphQL with WordPress',
				date: 'Jun 29, 2018',
				featuredImage: {
					sourceUrl: 'https://placehold.it/100x100'
				},
				author: {
					firstName: 'Jason',
					lastName: 'Bahl',
					avatar: {
						avatarUrl: 'https://placehold.it/100x100'
					}
				},
				tags: {
					nodes: [
						{
							name: 'WordPress + GraphQL'
						},
						{
							name: 'JSforWP Conference'
						}
					]
				}
			}
		]
	}
};

/**
 * This Component renders our actual Markup & Layout. This makes use of some handy components
 * from Ant Design: https://ant.design/docs/react/introduce
 *
 * Note: The styles to go with these components are enqueued in the wp-admin in `/src/init.php`
 */
const PostCard = ({node}) => {
	const { title, featuredImage: { sourceUrl }, author: { avatar: { avatarUrl }, firstName, lastName }, date, tagNodes } = node;
	return(
		<Card>
			<h2><Avatar size="large" src={sourceUrl} /> {title}</h2>
			<h4><Avatar size="small" shape="square" src={avatarUrl} /> By {firstName} {lastName} | {date}</h4>
			<div>{ tagNodes && tagNodes.map( tag => <Tag>{tag.name}</Tag> ) }</div>
		</Card>
	);
};

/**
 * This component accepts an array of Posts, maps over the array and renders the PostCard component.
 */
const RenderPosts = ({posts}) => {
	return (
		<div>
			{
				posts.nodes.map( node => {
					return <PostCard key={ node.id } node={node} />;
				})
			}
		</div>
	);
};

/**
 * This is the EditPosts component. For now, it just returns another component <RenderPosts>, passing
 * along our hard-coded data.posts. This component will be responsible for fetching the post data
 * using a GraphQL query and passing the data down to RenderPosts
 */
class EditPosts extends Component {
	render() {
		return <RenderPosts posts={data.posts} />
	}
}

/**
 * Register the block so that the Gutenberg client is aware of it
 */
registerBlockType( 'graphql/recent-posts', {
	title: 'GraphQL Recent Posts',
	category: 'widgets',
	icon: 'grid-view',
	/**
	 * When the block is in a post, Gutenberg will use this Edit component to render the interface
	 * for interacting with the block in the admin.
	 *
	 * We take the props that Gutenberg is passing, and send them along to the <EditPosts> component
	 * so that component can make use of them if needed.
	 */
	edit: (props) => <EditPosts {...props} />,
	save: () => {
		// Nothing will be saved by this block. It's dynamically rendered in the Editor
		// and in the theme
		return null;
	}
} );
