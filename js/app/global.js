//////////////////////////////////////
// Polyfills
//////////////////////////////////////

// endsWith polyfillfor IE (< Edge)

if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (searchString, position) {
        var subjectString = this.toString();
        if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
            position = subjectString.length;
        }
        position -= searchString.length;
        var lastIndex = subjectString.indexOf(searchString, position);
        return lastIndex !== -1 && lastIndex === position;
    };
}

// trimRight polyfill for IE

if (!String.prototype.trimRight) {
    String.prototype.trimRight = function() { return this.replace(/\s+$/, ''); };
}

// includes polyfill for IE

if (!String.prototype.includes) {
    String.prototype.includes = function (search, start) {
        'use strict';
        if (typeof start !== 'number') {
            start = 0;
        }

        if (start + search.length > this.length) {
            return false;
        } else {
            return this.indexOf(search, start) !== -1;
        }
    };
}

//////////////////////////////////////
// Global object
//////////////////////////////////////

Global = {

    isMobile: function() {

        var mql = window.matchMedia('(max-width: 991px)');

        return mql.matches;
    },

    allowTextAreaTab: function(textAreaId) {

        // Note that this works to allow tab, but nothing
        // is added in undo history.

        $(document).delegate('#' + textAreaId, 'keydown', function (e) {

            var keyCode = e.keyCode || e.which;

            if (keyCode === 9) {
                e.preventDefault();
                var start = this.selectionStart;
                var end = this.selectionEnd;

                // Set textarea value to: text before caret + tab + text after caret

                $(this).val($(this).val().substring(0, start)
                    + '\t'
                    + $(this).val().substring(end));

                // Put caret at right position again

                this.selectionStart =
                    this.selectionEnd = start + 1;
            }
        });
    },

    insertTextAtCaret: function(textAreaId, value) {

        console.log('insertTextAtCaret', textAreaId, value);

        var textAreaElem = document.getElementById(textAreaId);

        if (document.selection) {

            console.log('Journal file insert (IE)');

            textAreaElem.focus();

            var sel = document.selection.createRange();

            sel.text = '\r\n' + value + '\r\n';

        }

        else if (textAreaElem.selectionStart || textAreaElem.selectionStart === 0) {

            console.log('Journal file insert at position (not IE)');

            var startPos = textAreaElem.selectionStart;

            var endPos = textAreaElem.selectionEnd;

            textAreaElem.value = textAreaElem.value.substring(0, startPos)

                + '\r\n' + value + '\r\n'

                + textAreaElem.value.substring(endPos, textAreaElem.value.length);

        } else {

            console.log('Journal file insert at end (not IE)');

            textAreaElem.value += '\r\n' + value + '\r\n';
        }
    },

    copyToClipboard: function (textToCopy) {

        var el = document.createElement('textarea');    // Create a <textarea> element
        el.value = textToCopy;                          // Set its value to the string that you want copied
        el.setAttribute('readonly', '');                // Make it readonly to be tamper-proof
        el.style.position = 'absolute';
        el.style.left = '-9999px';                      // Move outside the screen to make it invisible
        document.body.appendChild(el);                  // Append the <textarea> element to the HTML document
        var selected =
            document.getSelection().rangeCount > 0      // Check if there is any content selected previously
                ? document.getSelection().getRangeAt(0) // Store selection if found
                : false;                                // Mark as false to know no selection existed before
        el.select();                                    // Select the <textarea> content
        document.execCommand('copy');                   // Copy - only works as a result of a user action (e.g. click events)
        document.body.removeChild(el);                  // Remove the <textarea> element
        if (selected) {                                 // If a selection existed before copying
            document.getSelection().removeAllRanges();  // Unselect everything on the HTML document
            document.getSelection().addRange(selected); // Restore the original selection
        }

        // https://hackernoon.com/copying-text-to-clipboard-with-javascript-df4d4988697f

        console.log('Copied text to clipboard: ' + textToCopy);
    },

    getQueryStringParameterByName: function(name, url) {

        if (!url) {

            url = window.location.href;
        }

        name = name.replace(/[\[\]]/g, '\\$&');

        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
        var results = regex.exec(url);

        if (!results) {

            return null;
        }

        if (!results[2]) {

            return '';
        }

        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    },

    displayLoader: function(id, display) {

        $('#' + id).css('display', display ? 'inline-block' : 'none');
    },

    displayStandardAlertModal: function(headerHtml, bodyHtml) {

        // headerHtml, bodyHtml can also just be plain text

        // Can press escape button to escape by keyboard

        $('#standard-alert-modal-header-html').html(headerHtml);
        $('#standard-alert-modal-body-html').html(bodyHtml);

        $('#standard-alert-modal').modal('show');
    },

    displayNoDismissAlertModal: function (headerHtml, bodyHtml) {

        // headerHtml, bodyHtml can also just be plain text

        // Can press escape button to escape by keyboard

        $('#no-dismiss-alert-modal-header-html').html(headerHtml);
        $('#no-dismiss-alert-modal-body-html').html(bodyHtml);

        $('#no-dismiss-alert-modal').modal('show');
    },

    displayStandardUiBlockOverlay: function(show, withLoader) {

        // standard-ui-block-overlay exists in layout file with styles in core.css

        if (show) {
            $('.standard-ui-block-overlay').removeClass('d-none');
            $('.standard-ui-block-overlay').addClass('d-block');

            if (withLoader) {

                $('.standard-ui-block-overlay-ajax-loader-container').removeClass('d-none');
                $('.standard-ui-block-overlay-ajax-loader-container').addClass('d-block');
            }

        } else {
            $('.standard-ui-block-overlay').removeClass('d-block');
            $('.standard-ui-block-overlay').addClass('d-none');

            $('.standard-ui-block-overlay-ajax-loader-container').removeClass('d-block');
            $('.standard-ui-block-overlay-ajax-loader-container').addClass('d-none');
        }
    },

    disableForm: function(id, disable) {

        $('#' + id + ' :input').prop('disabled', disable);
    },

    disableElement: function(id, disable) {

        if (disable) {

            $('#' + id).attr('disabled', 'disabled');

        } else {

            $('#' + id).removeAttr('disabled');
        }
    },

    jsonGet: function(url, authorizationHeaderValue, successHandler, failureHandler, alwaysHandler) {

        $.ajax({
                type: 'GET',
                url: url,
                dataType: 'json',
                beforeSend: function(xhr) {

                    if (authorizationHeaderValue) {

                        xhr.setRequestHeader('Authorization', authorizationHeaderValue);
                    }
                }
            })
            .done(function(data) {

                if (successHandler) {

                    successHandler(data);
                }
            })
            .fail(function(jqxhr, textStatus, err) {

                if (failureHandler) {

                    failureHandler(jqxhr, textStatus, err);
                }
            })
            .always(function() {

                if (alwaysHandler) {

                    alwaysHandler();
                }
            });
    },

    jsonPost: function(url, obj, headers, authorizationHeaderValue, successHandler, failureHandler, alwaysHandler) {

        $.ajax({
                type: 'POST',
                url: url,
                data: JSON.stringify(obj),
                headers: headers,
                beforeSend: function(xhr) {

                    if (authorizationHeaderValue) {

                        xhr.setRequestHeader('Authorization', authorizationHeaderValue);
                    }
                },
                contentType: 'application/json; charset=utf-8',
                dataType: 'json'
            })
            .done(function(data) {

                if (successHandler) {

                    successHandler(data);
                }
            })
            .fail(function(jqxhr, textStatus, err) {

                if (failureHandler) {

                    failureHandler(jqxhr, textStatus, err);
                }
            })
            .always(function() {

                if (alwaysHandler) {

                    alwaysHandler();
                }
            });
    }
};

