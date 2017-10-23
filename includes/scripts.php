<?php
/**
 * Scripts
 *
 * @package     EDD\FreeDownloads\Scripts
 * @since       1.0.0
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Load scripts
 *
 * @since       1.0.0
 * @return      void
 */
function edd_free_downloads_scripts() {
	$close_button   = edd_get_option( 'edd_free_downloads_close_button', false );
	$close_button   = ( $close_button ? 'box' : 'overlay' );
	$download_label = edd_get_option( 'edd_free_downloads_button_label', __( 'Download Now', 'edd-free-downloads' ) );

	// Use minified libraries if EDD_FREE_DOWNLOADS_SCRIPT_DEBUG is turned off
	$suffix = ( defined( 'EDD_FREE_DOWNLOADS_SCRIPT_DEBUG' ) && EDD_FREE_DOWNLOADS_SCRIPT_DEBUG ) ? '' : '.min';

	wp_enqueue_script( 'edd-free-downloads-mobile', EDD_FREE_DOWNLOADS_URL . 'assets/js/isMobile'. $suffix . '.js', array( 'jquery' ) );
	wp_enqueue_style( 'edd-free-downloads-modal', EDD_FREE_DOWNLOADS_URL . 'assets/js/jBox/Source/jBox.css' );
	wp_enqueue_script( 'edd-free-downloads-modal', EDD_FREE_DOWNLOADS_URL . 'assets/js/jBox/Source/jBox.min.js', array( 'jquery' ) );
	wp_enqueue_style( 'edd-free-downloads', EDD_FREE_DOWNLOADS_URL . 'assets/css/style' . $suffix . '.css', array(), EDD_FREE_DOWNLOADS_VER  );
	wp_enqueue_script( 'edd-free-downloads', EDD_FREE_DOWNLOADS_URL . 'assets/js/edd-free-downloads' . $suffix . '.js', array( 'edd-free-downloads-modal' ), EDD_FREE_DOWNLOADS_VER );
	wp_localize_script( 'edd-free-downloads', 'edd_free_downloads_vars', array(
		'close_button'         => $close_button,
		'user_registration'    => ( edd_get_option( 'edd_free_downloads_user_registration', false ) && ! class_exists( 'EDD_Auto_Register' ) ) ? 'true' : 'false',
		'require_name'         => edd_get_option( 'edd_free_downloads_require_name', false ) ? 'true' : 'false',
		'download_loading'     => __( 'Please Wait... ', 'edd-free-downloads' ),
		'download_label'       => $download_label,
		'modal_download_label' => edd_get_option( 'edd_free_downloads_modal_button_label', __( 'Download Now', 'edd-free-downloads' ) ),
		'has_ajax'             => edd_is_ajax_enabled(),
		'ajaxurl'              => edd_get_ajax_url(),
		'mobile_url'           => esc_url( add_query_arg( array( 'edd-free-download' => 'true' ) ) ),
		'form_class'           => apply_filters( 'edd_free_downloads_form_class', 'edd_purchase_submit_wrapper' ),
		'bypass_logged_in'     => edd_get_option( 'edd_free_downloads_bypass_logged_in', false ) ? 'true' : 'false',
		'is_download'          => ( is_singular( 'download' ) ? 'true' : 'false' ),
		'loading_text'         => edd_get_option( 'edd_free_downloads_notes_loading_label', __( 'Loading...', 'edd-free-downloads' ) )
	) );
}
add_action( 'wp_enqueue_scripts', 'edd_free_downloads_scripts' );


/**
 * Load admin scripts
 *
 * @since       1.3.0
 * @return      void
 */
function edd_free_downloads_admin_scripts() {
	// Use minified libraries if EDD_FREE_DOWNLOADS_SCRIPT_DEBUG is turned off
	$suffix = ( defined( 'EDD_FREE_DOWNLOADS_SCRIPT_DEBUG' ) && EDD_FREE_DOWNLOADS_SCRIPT_DEBUG ) ? '' : '.min';

	wp_enqueue_style( 'edd-free-downloads', EDD_FREE_DOWNLOADS_URL . 'assets/css/admin'. $suffix . '.css', array(), EDD_FREE_DOWNLOADS_VER );
	wp_enqueue_script( 'edd-free-downloads', EDD_FREE_DOWNLOADS_URL . 'assets/js/admin'. $suffix . '.js', array( 'jquery' ), EDD_FREE_DOWNLOADS_VER );
}
add_action( 'admin_enqueue_scripts', 'edd_free_downloads_admin_scripts' );
