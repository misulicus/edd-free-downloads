/*global jQuery, document, edd_free_downloads_vars, jBox, isMobile*/
/*jslint newcap: true*/
jQuery(document.body).ready(function ($) {
    'use strict';

    var newModal;

    if ($('input[name="edd_options[price_id][]"]').length > 0) {
        var classes, wrapperPrefix, linkPrefix, linkSuffix, wrapperSuffix, href;

        classes = $('.edd_purchase_submit_wrapper').find('a.edd-add-to-cart').attr('class');

        if( ! classes ){
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
                    var dlUrl = $(this).parent().find('.edd-free-downloads-variable').attr('href');
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

        $(document.body).on('change', 'input[name="edd_options[price_id][]"]', function () {
            var total = 0;
            var checked = 0;
            var priceId = 0;
            var dlUrl = $(this).closest('.edd_download_purchase_form').find('a.edd-free-downloads-variable').attr('href');
            var dlId = $(this).closest('.edd_download_purchase_form').find('.edd_purchase_submit_wrapper').find('.edd-add-to-cart').attr('data-download-id');

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

    if (isMobile.any) {
        $(document.body).on('click', '.edd-free-download', function (e) {
            e.preventDefault();

            // Select email field on click
            $('input[name="edd_free_download_email"]').focus();
            $('input[name="edd_free_download_email"]').select();

            window.location.href = $(this).attr('href');
        });

        $(document.body).on('click', '.edd-free-download-cancel', function () {
            parent.history.back();
            return false;
        });
    } else {
        newModal = new jBox('Modal', {
            attach: $('.edd-free-download'),
            content: $('#edd-free-downloads-modal'),
            width: 350,
            delayClose: 3000,
            closeButton: edd_free_downloads_vars.close_button,
            onClose: function() {
                $('.edd-free-download-submit').removeAttr('disabled');
                $('.edd-free-download-submit span').html(edd_free_downloads_vars.modal_download_label);

                if ($('div#edd-free-downloads-modal .edd-free-downloads-direct-download-link').length > 0) {
                    $('div#edd-free-downloads-modal .edd-free-downloads-direct-download-link').css('display', 'block');
                }
            }
        });

        $(document.body).on('click', '.edd-free-download', function (e) {
            e.preventDefault();

            var button = $(this);
            var download_id = $(this).data('download-id');
            var button_html = $(this).html();

            button.append(' <i class="edd-icon-spinner edd-icon-spin"></i>');

            // Setup the notes field
            if (edd_free_downloads_vars.is_download === 'false') {
                $('.edd-free-downloads-note-content').html('<div style="text-align:center">' + edd_free_downloads_vars.loading_text + ' <i class="edd-icon-spinner edd-icon-spin"></i></div>');

                var postData = {
                    action : 'edd_free_downloads_get_notes',
                    download_id: download_id
                };

                $.ajax({
                    type: 'POST',
                    data: postData,
                    dataType: 'json',
                    url: edd_free_downloads_vars.ajaxurl,
                    success: function (response) {
                        if (response !== null) {
                            if (response.title !== '') {
                                $('.edd-free-downloads-note-title strong').html(response.title);
                            }

                            if (response.content !== '') {
                                $('.edd-free-downloads-note-content').html(response.content);
                            }
                        }

                        if (! isMobile.any) {
                            newModal.open();
                        }

                        button.html(button_html);
                    }
                }).fail(function (data) {
                    if ( window.console && window.console.log ) {
                        console.log( data );
                    }
                });
            } else {
                button.html(button_html);
            }

            // Select email field on click
            $('input[name="edd_free_download_email"]').focus();
            $('input[name="edd_free_download_email"]').select();

            $('input[name="edd_free_download_id"]').val(download_id);

            if ($(this).parent().parent().find('input[name="edd_options[price_id][]"]').length > 0) {
                $('input[name="edd_free_download_price_id[]"]').remove();

                $(this).parent().parent().find('input[name="edd_options[price_id][]"]').each(function () {
                    if ($(this).prop('checked') || $(this).attr('type') === 'hidden') {
                        $('.edd-free-download-submit').before('<input type="hidden" name="edd_free_download_price_id[]" value="' + $(this).val().toString() + '"/>');
                    }
                });
            }
        });
    }

    $(document.body).on('keypress', '.edd-free-download-field', function (e) {
        if (e.which === 13) {
            $('.edd-free-download-submit').click();
            return false;
        }
    });

    $(document.body).on('click', '.edd-free-download-submit', function (e) {
        var email, regex, has_error = 0;

        // Disable the submit button
        $('.edd-free-download-submit').attr('disabled', 'disabled');

        // Remove the direct download link
        if ($('.edd-free-downloads-direct-download-link').length > 0) {
            $('.edd-free-downloads-direct-download-link').fadeOut('fast', function () {
                $(this).css('display', 'none');
            });
        }

        email = $('input[name="edd_free_download_email"]');
        regex = /^((([A-Za-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([A-Za-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([A-Za-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([A-Za-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([A-Za-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([A-Za-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([A-Za-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([A-Za-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([A-Za-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([A-Za-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/;

        if (email.val() === '') {
            $('#edd-free-download-error-email-required').css('display', 'block');

            has_error++;
        } else {
            $('#edd-free-download-error-email-required').css('display', 'none');

            if (!regex.test(email.val())) {
                $('#edd-free-download-error-email-invalid').css('display', 'block');

                has_error++;
            } else {
                $('#edd-free-download-error-email-invalid').css('display', 'none');
            }
        }

        if (edd_free_downloads_vars.require_name === 'true') {
            var fname, lname;

            fname = $('input[name="edd_free_download_fname"]');
            lname = $('input[name="edd_free_download_lname"]');

            if (fname.val() === '') {
                $('#edd-free-download-error-fname-required').css('display', 'block');

                has_error++;
            } else {
                $('#edd-free-download-error-fname-required').css('display', 'none');
            }

            if (lname.val() === '') {
                $('#edd-free-download-error-lname-required').css('display', 'block');

                has_error++;
            } else {
                $('#edd-free-download-error-lname-required').css('display', 'none');
            }
        }


        if (edd_free_downloads_vars.user_registration === 'true') {
            var username, password, password2;

            username = $('input[name="edd_free_download_username"]');
            password = $('input[name="edd_free_download_pass"]');
            password2 = $('input[name="edd_free_download_pass2"]');

            if (username.val() === '') {
                $('#edd-free-download-error-username-required').css('display', 'block');

                has_error++;
            } else {
                $('#edd-free-download-error-username-required').css('display', 'none');
            }

            if (password.val() === '') {
                $('#edd-free-download-error-password-required').css('display', 'block');

                has_error++;
            } else {
                $('#edd-free-download-error-password-required').css('display', 'none');
            }

            if (password2.val() === '') {
                $('#edd-free-download-error-password2-required').css('display', 'block');

                has_error++;
            } else {
                $('#edd-free-download-error-password2-required').css('display', 'none');
            }

            if (password.val() !== '' && password2.val() !== '') {
                if (password.val() !== password2.val()) {
                    $('#edd-free-download-error-password-unmatch').css('display', 'block');

                    has_error++;
                } else {
                    $('#edd-free-download-error-password-unmatch').css('display', 'none');
                }
            }
        }

        if (has_error === 0) {
            $('#edd_free_download_form').submit();
            $('.edd-free-download-submit span').html(edd_free_downloads_vars.download_loading);
            $('.edd-free-download-submit span').append('<i class="edd-icon-spinner edd-icon-spin"></i>');
            $('.edd-free-download-submit').attr('disabled', 'disabled');
            newModal.close();
        } else {
            $('.edd-free-download-errors').css('display', 'block');
            $('.edd-free-download-submit').removeAttr('disabled');
            e.preventDefault();
        }
    });

    $(document.body).on('click', '.edd-free-downloads-direct-download-link', function (e) {
        e.preventDefault();

        if (! isMobile.any) {
            newModal.close();
        }

        var price_ids = '';
        var download_id = $(this).parent().parent().find('input[name="edd_free_download_id"]').val();

        if( ! download_id ) {
            download_id = $(this).parent().parent().find('.edd-free-download').data('download-id');
        }

        if( ! download_id ) {
            download_id = $(this).data('download-id');
        }

        if ($(this).parent().parent().find('input[name="edd_free_download_price_id[]"]').length > 0) {
            $(this).parent().parent().find('input[name="edd_free_download_price_id[]"]').each(function () {
                price_ids = price_ids + $(this).val().toString();
            });
        }

        if (isMobile.any) {
            window.location = window.location + '&edd_action=free_downloads_process_download&download_id=' + download_id + '&price_ids=' + price_ids;
        } else {

            /**
             * Checking if we already have a query param on the incoming URL.
             *
             * This would most likely come from a 3rd party such as email tracking links.
             */
            var url = window.location.toString(),
                paramCheck = url.split( '?' ),
                urlQuery = '?'; // This is the default query option

            if ( 'undefined' != typeof( paramCheck[1] ) && paramCheck[1].length > 0 ) {
                urlQuery = '&'; // Resetting the query option because the URL already has params
            }

            window.location = window.location + urlQuery + 'edd_action=free_downloads_process_download&download_id=' + download_id + '&price_ids=' + price_ids;
        }
    });
});
