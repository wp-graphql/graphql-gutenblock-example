<?php
/**
 * Plugin Name: GraphQL Gutenblock Example
 * Plugin URI: https://github.com/wp-graphql/graphql-gutenblock-example
 * Description: An example Gutenberg block using GraphQL to populate data
 * Author: jasonbahl
 * Author URI: https://wpgraphql.com/
 * Version: 1.0.0
 * License: GPL2+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 *
 * @package CGB
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Block Initializer.
 */
require_once plugin_dir_path( __FILE__ ) . 'src/init.php';
