/*global jQuery, document, edd_free_downloads_vars, isMobile*/
/*jslint newcap: true*/
jQuery(document.body).ready(function ($) {
    'use strict';

    var body = $(document.body);
    /**
     * This function controls the closing of the modal by either
     * clicking the close 'x', outside the modal, or pressing the escape key.
     */
    function eddFreeDownloadCloseModal() {
        $( '.edd-free-downloads-modal-wrapper' ).fadeOut( 250 ); // Hiding the modal wrapper again
        $( '#edd-free-downloads-modal' ).hide().html('');
        $( 'body' ).removeClass( 'edd-frozen' );
    }

    if ($('input[name="edd_options[price_id][]"]').length > 0) {
        var classes, wrapperPrefix, linkPrefix, linkSuffix, wrapperSuffix, href;

        classes = $('.edd_purchase_submit_wrapper').find('a.edd-add-to-cart').attr('class');

        if (!classes) {
            return;
        }

        classes = classes.replace('edd-add-to-cart', '');

        if (isMobile.any) {
            href = edd_free_downloads_vars.mobile_url;
        } else {
            href = '#edd-free-download-modal';
        }

        if (edd_free_downloads_vars.has_ajax === '1') {
            wrapperPrefix = '<div class="edd-free-downloads-variable-wrapper">';
            linkPrefix    = '<a class="edd-free-downloads-variable edd-free-download ' + classes + '" href="' + href + '" data-download-id=""><span>';
            linkSuffix    = '</span></a>';
            wrapperSuffix = '</div>';
        } else {
            wrapperPrefix = '';
            linkPrefix    = '<input type="submit" class="edd-free-downloads-variable edd-free-download ' + classes + '" name="edd_purchase_download" value="';
            linkSuffix    = '" href="' + href + '" data-download-id="" />';
            wrapperSuffix = '';
        }

        $('.edd_purchase_submit_wrapper').each(function (i) {
            if ($('.edd_purchase_submit_wrapper').eq(i).find('.edd-add-to-cart').data('variable-price') === 'yes') {
                var download_id = $(this).closest('form').attr('id').replace('edd_purchase_', '');

                if (edd_free_downloads_vars.bypass_logged_in === 'true') {
                    $(this).after(wrapperPrefix + '<a href="#" class="edd-free-downloads-direct-download-link ' + classes + '" data-download-id="' + download_id + '">' + edd_free_downloads_vars.download_label + '</a>' + wrapperSuffix);
                } else {
                    $(this).after(wrapperPrefix + linkPrefix + edd_free_downloads_vars.download_label + linkSuffix + wrapperSuffix);
                }

                $(this).parent().find('.edd-free-downloads-variable').attr('data-download-id', download_id);

                if ($(this).prev().find('input[name="edd_options[price_id][]"]:checked').attr('data-price') === '0.00') {
                    var dlUrl    = $(this).parent().find('.edd-free-downloads-variable').attr('href');
                    var selected = $(this).prev().find('input[name="edd_options[price_id][]"]:checked').val();

                    $(this).css('display', 'none');
                    $(this).parent().find('.edd-free-downloads-variable-wrapper').css('display', 'block');
                    $(this).parent().find('.edd-free-downloads-variable').attr('href', dlUrl + '&download_id=' + download_id + '&price_ids=' + selected);
                } else {
                    if ($(this).prev().find('input[name="edd_options[price_id][]"]:checked').attr('data-price') === '0.00') {
                        $(this).css('display', 'none');
                        $(this).parent().find('.edd-free-downloads-variable-wrapper').css('display', 'block');
                    } else {
                        $(this).css('display', 'block');
                        $(this).parent().find('.edd-free-downloads-variable-wrapper').css('display', 'none');
                    }
                }
            }
        });

        body.on('change', 'input[name="edd_options[price_id][]"]', function () {
            var total   = 0;
            var checked = 0;
            var priceId = 0;
            var dlUrl   = $(this).closest('.edd_download_purchase_form').find('a.edd-free-downloads-variable').attr('href');
            var dlId    = $(this).closest('.edd_download_purchase_form').find('.edd_purchase_submit_wrapper').find('.edd-add-to-cart').attr('data-download-id');

            $(this).closest('ul').find('input[name="edd_options[price_id][]"]').each(function () {
                if ($(this).is(':checked')) {
                    total += parseFloat($(this).attr('data-price'));
                    checked += 1;
                    priceId = $(this).val();
                }
            });

            if (checked !== 0) {
                if (total === 0) {
                    $(this).closest('.edd_download_purchase_form').find('.edd_purchase_submit_wrapper').css('display', 'none');
                    $(this).closest('.edd_download_purchase_form').find('.edd-free-downloads-variable-wrapper').css('display', 'block');

                    $(this).closest('.edd_download_purchase_form').find('a.edd-free-downloads-variable').attr('href', dlUrl + '&download_id=' + dlId + '&price_ids=' + priceId);
                } else {
                    $(this).closest('.edd_download_purchase_form').find('.edd_purchase_submit_wrapper').css('display', 'block');
                    $(this).closest('.edd_download_purchase_form').find('.edd-free-downloads-variable-wrapper').css('display', 'none');

                    $(this).closest('.edd_download_purchase_form').find('a.edd-free-downloads-variable').attr('href', dlUrl);
                }
            } else {
                $(this).closest('.edd_download_purchase_form').find('.edd_purchase_submit_wrapper').css('display', 'block');
                $(this).closest('.edd_download_purchase_form').find('.edd-free-downloads-variable-wrapper').css('display', 'none');

                $(this).closest('.edd_download_purchase_form').find('a.edd-free-downloads-variable').attr('href', dlUrl);
            }
        });

        $(document.body).on('click', '.edd-free-downloads-variable', function (e) {
            e.preventDefault();
        });
    }

    /**
     * The user clicked the download button from the shortcode output.
     * We will use an ajax call to populate the modal.
     */
    if (isMobile.any) {
        body.on( 'click', 'a.edd-free-download', function(e) {
            e.preventDefault();

            // Select email field on click
            $('input[name="edd_free_download_email"]').focus();
            $('input[name="edd_free_download_email"]').select();

            window.location.href = $(this).attr('href');
        });

        body.on('click', '.edd-free-download-cancel', function () {
            parent.history.back();
            return false;
        });
    } else {
        body.on( 'click', 'a.edd-free-download', function() {

            var edd_download_id = $( this ).data( 'download-id' );
            var price_ids       = [];
            var variable_prices = $(this).parent().parent().find('input[name="edd_options[price_id][]"]');
            if (variable_prices.length > 0) {
                variable_prices.each(function () {
                    $(this).parent().parent().find('input[name="edd_options[price_id][]"]').each(function () {
                        if ($(this).prop('checked') || $(this).attr('type') === 'hidden') {
                            price_ids.push($(this).val().toString());
                        }
                    });
                });
            }

            var modal_wrapper = $('.edd-free-downloads-modal-wrapper');
            modal_wrapper.fadeIn( 250 );

            $.ajax({
                url: edd_free_downloads_vars.ajaxurl,
                type: 'GET',
                data: {
                    'action': 'edd_free_downloads_get_modal',
                    'download_id': edd_download_id,
                    'price_ids' : price_ids,
                    'edd_is_mobile': edd_free_downloads_vars.edd_is_mobile,
                    'require_name': edd_free_downloads_vars.require_name,
                    'success_page': edd_free_downloads_vars.success_page,
                },
                success: function( data ) {

                    /**
                     * Caching `body` as it is used on key presses and clicks below.
                     * Setting closeButtonDOM to allow for an empty value by default.
                     */
                    var closeButtonDOM = '';

                    body.addClass( 'edd-frozen' );

                    var modal_container = $('#edd-free-downloads-modal');
                    modal_container.prepend( data ).fadeIn(250);


                    $( '.edd-free-downloads-modal-wrapper .edd-free-downloads-modal-close' ).on( 'click', function() {
                        eddFreeDownloadCloseModal();
                    } );

                    modal_container.find('input').first().focus();

                    modal_container.on( 'click', '.edd-free-download-submit', function(e) {

                        var has_error = 0;
                        /**
                         * Making sure we have a valid email address
                         */
                        var email = modal_wrapper.find('input[name="edd_free_download_email"]');
                        var regex = /^((([A-Za-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([A-Za-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([A-Za-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([A-Za-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([A-Za-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([A-Za-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([A-Za-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([A-Za-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([A-Za-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([A-Za-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/;

                        if ( email.val() === '' ) {

                            $( '.edd-free-download-errors' ).show();
                            $('#edd-free-download-error-email-required').css('display', 'block');

                            has_error++;
                            e.preventDefault();

                        } else {
                            $('#edd-free-download-error-email-required').css('display', 'none');

                            if ( ! regex.test( email.val() ) ) {
                                $( '.edd-free-download-errors' ).show();
                                $('#edd-free-download-error-email-invalid').css('display', 'block');

                                has_error++;
                                e.preventDefault();
                            } else {
                                $('#edd-free-download-error-email-invalid').css('display', 'none');
                            }
                        }
                        /**
                         * End email check
                         */

                        /**
                         * First and Last name check if the option is set
                         */
                        if ( 'true' === edd_free_downloads_vars.require_name ) {

                            var fname = $( '.edd-free-downloads-modal-wrapper input[name="edd_free_download_fname"]' );
                            var lname = $( '.edd-free-downloads-modal-wrapper input[name="edd_free_download_lname"]' );

                            if ('' === fname.val()) {
                                $( '.edd-free-download-errors' ).show();
                                $('#edd-free-download-error-fname-required').css('display', 'block');

                                has_error++;
                                e.preventDefault();
                            } else {
                                $('#edd-free-download-error-fname-required').css('display', 'none');
                            } // End checking first name

                            if ('' === lname.val()) {
                                $( '.edd-free-download-errors' ).show();
                                $('#edd-free-download-error-lname-required').css('display', 'block');

                                has_error++;
                                e.preventDefault();
                            } else {
                                $('#edd-free-download-error-lname-required').css('display', 'none');
                            } // End checking last name

                        } // End true check on required_name

                        /**
                         * If edd_free_downloads_vars.optional_fields is empty then
                         * a user registration is NOT required
                         */
                        if ( 'true' === edd_free_downloads_vars.user_registration ) {
                            var username, password, password2, registration_required;

                            username  = $('input[name="edd_free_download_username"]');
                            password  = $('input[name="edd_free_download_pass"]');
                            password2 = $('input[name="edd_free_download_pass2"]');
                            registration_required = edd_free_downloads_vars.guest_checkout_disabled === '1';

                            if (username.val() === '' && registration_required ) {

                                    $('#edd-free-download-error-username-required').css('display', 'block');

                                    has_error++;

                            }

                            if (password.val() === '' && ( registration_required || '' !== username.val() ) ) {

                                    $('#edd-free-download-error-password-required').css('display', 'block');

                                    has_error++;

                            }

                            if (password2.val() === '' && ( registration_required || '' !== username.val() ) ) {

                                    $('#edd-free-download-error-password2-required').css('display', 'block');

                                    has_error++;

                            }

                            if (password.val() !== '' && password2.val() !== '') {

                                if (password.val() !== password2.val() && (registration_required || '' !== username.val()) ) {

                                        $('#edd-free-download-error-password-unmatch').css('display', 'block');

                                        has_error++;

                                } else {
                                    $('#edd-free-download-error-password-unmatch').css('display', 'none');
                                }
                            }
                        }

                        if (has_error === 0) {
                            if ( edd_free_downloads_vars.email_verification === '1' ) {
                                e.preventDefault();
                                var data = $('#edd_free_download_form').serialize();
                                $.ajax({
                                    url      : edd_free_downloads_vars.ajaxurl,
                                    type     : 'POST',
                                    data     : data,
                                    success: function (response) {
                                        $('.edd-free-downloads-verification-message').html(response.message).fadeIn();
                                        $('.edd-free-downloads-verification-message-wrapper').removeClass('edd-alert-info');
                                        if ( response.success ) {
                                            $('.edd-free-downloads-verification-message-wrapper').addClass('edd-alert-success', 250);
                                            $('.edd-free-download-submit').hide();
                                        } else {
                                            $('.edd-free-downloads-verification-message-wrapper').addClass('edd-alert-error', 250);
                                        }
                                    }
                                });
                            } else {
                                $('#edd_free_download_form').submit();
                                $('.edd-free-download-submit span').html(edd_free_downloads_vars.download_loading);
                                $('.edd-free-download-submit span').append('<i class="edd-icon-spinner edd-icon-spin"></i>');
                                $('.edd-free-download-submit').attr('disabled', 'disabled');
                                eddFreeDownloadCloseModal();
                            }
                        } else {
                            $('.edd-free-download-errors').css('display', 'block');
                            $('.edd-free-download-submit').removeAttr('disabled');
                            e.preventDefault();
                        }

                    }); // End validation checks

                    $( '#edd-free-downloads-modal' ).on( 'click', 'a.edd-free-downloads-direct-download-link', function( e ) {
                        e.preventDefault();
                        edd_fd_process_direct_download_link($(this ));
                    });

                    /**
                     * Stopping propagation here allows the user to click on the modal without closing it
                     */
                    $( '#edd-free-downloads-modal' ).on( 'click', function(e) {
                        e.stopPropagation();
                    });

                    /**
                     * If the user clicks outside the modal we remove it here
                     * and hide the wrapper again
                     */
                    $( '#edd-free-downloads-modal' ).parent('.edd-free-downloads-modal-wrapper').on( 'click', function() {
                        eddFreeDownloadCloseModal();
                    });

                    /**
                     * If you user is focused on the email field and presses enter
                     * this will "click" the download botton
                     */
                    body.on('keypress', '.edd-free-download-field', function (e) {
                        if (e.which === 13) {
                            $('.edd-free-download-submit').click();
                            return false;
                        }
                    });

                    /**
                     * Allowing for pressing escape key to close modal
                     */
                    body.on( 'keyup', function( e ) {
                        if ( 27 === e.keyCode ) {
                            eddFreeDownloadCloseModal();
                        }
                    });

                } // End success.

            }); // End AJAX call.

        });
    }  // End on click.

    body.on( 'click', 'a.edd-free-downloads-direct-download-link', function( e ) {
        e.preventDefault();
        edd_fd_process_direct_download_link($(this ));
    });

    function edd_fd_process_direct_download_link( target ) {

        var price_ids = [];
        var download_id = target.parent().parent().find('input[name="edd_free_download_id"]').val();

        if( ! download_id ) {
            download_id = target.parent().parent().find('.edd-free-download').data('download-id');
        }

        if( ! download_id ) {
            download_id = target.data('download-id');
        }

        if (target.parent().parent().find('input[name="edd_free_download_price_id[]"]').length > 0) {
            target.parent().parent().find('input[name="edd_free_download_price_id[]"]').each(function () {
                price_ids.push($(this).val().toString());
            });
        } else if (target.parent().parent().find('input[name="edd_options[price_id][]"]:checked').length > 0) {
            target.parent().parent().find('input[name="edd_options[price_id][]"]:checked').each(function () {
                price_ids.push($(this).val().toString());
            });
        }

        var redirect = window.location.href;

        if ( redirect.indexOf('?') !== -1 ) {
            redirect = redirect + '&';
        } else {
            redirect = redirect + '?';
        }

        if (! isMobile.any) {
            eddFreeDownloadCloseModal();
        }

        window.location = redirect + 'edd_action=free_downloads_process_download&download_id=' + download_id + '&price_ids=' + price_ids;

    }
});
