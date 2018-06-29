import React from 'react'
import { Card, Avatar, Tag } from 'antd'

/**
 * Reference the registerBlockType from the Gutenberg wp.blocks exports
 */
const { registerBlockType } = wp.blocks;
const { Component } = wp.element;
const { select } = wp.data;

/**
 * This is the GraphQL Query that we can use to fetch the data in the same shape as the mock data
 * we hard-coded.
 */
const RECENT_POSTS_QUERY = `
	query RecentPosts ($id:Int) {
		posts (where: {notIn: [$id] }) {
			nodes {
				id
				title
				date
				featuredImage {
					sourceUrl
				}
				author {
					firstName
					lastName
					avatar(size: 50) {
						avatarUrl: url
					}
				}
				tags {
					nodes {
						name
					}
				}
			}
		}
	}
`;

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
			<h2>{ sourceUrl && <Avatar size="large" src={sourceUrl} />} {title}</h2>
			<h4>{ avatarUrl && <Avatar size="small" shape="square" src={avatarUrl} />} By {firstName} {lastName} | {date}</h4>
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

	/**
	 * Setup the initial state for the component
	 */
	constructor( props ) {
		super(...props);
		console.log( props );
		this.state = {
			/**
			 * The default state will now be null, and when the results of our fetched GraphQL
			 * data get back, we'll update the state with the posts.
			 */
			posts: null
		};
	}

	/**
	 * Fetch the /graphql endpoint using the RECENT_POSTS_QUERY, then return the JSON from
	 * the response.
	 */
	fetchPosts = async () => {

		/**
		 * Get the ID of the post from Gutenberg's Data API
		 */
		const postId = select( 'core/editor' ).getEditedPostAttribute( 'id' );

		/**
		 * NOTE: There are specific libraries like Apollo Client (highly recommend!), and others,
		 * that make it easy to manage fetching data from GraphQL endpoints, but for the sake
		 * of simplicity we're just using fetch.
		 */
		const response = await fetch( '/graphql', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				query: RECENT_POSTS_QUERY,
				variables: {
					id: postId
				}
			})
		});

		/**
		 * Return the JSON
		 */
		return await response.json();
	};

	/**
	 * When the component mounts in the DOM, this will get executed.
	 */
	componentDidMount() {

		/**
		 * Here, we fetch the posts using our GraphQL query, and when the response comes back
		 * we set the state.posts with the posts from the response
		 */
		this.fetchPosts().then( response => {

			/**
			 * Set the state with the posts, if we received posts in the response
			 */
			if ( response.data && response.data.posts ) {
				this.setState({
					posts: response.data.posts
				});
			}
		})
	}

	render() {
		/**
		 * Pass the posts from state to the RenderPosts component.
		 * Anytime the state changes, the changes will be passed down to the RenderPosts component
		 * and React will re-render as needed.
		 */
		const { posts } = this.state;

		/**
		 * If there are no posts, return a loading indicator
		 */
		if ( ! posts || ! posts.nodes ) {
			return 'Loading...';
		/**
		 * If there are posts, map through the nodes and return the <PostCard> component
		 * which will render the data from the GraphQL request
		 */
		} else {
			return <RenderPosts posts={this.state.posts}/>
		}
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
