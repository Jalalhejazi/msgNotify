/*
        jQuery plugin
 */

; (function (define) {
    define(['jquery'], function ($) {
        return (function () {
            var $container,

                defaults = {
                    tapToDismiss: true,
                    msgNotifyClass: 'msgNotify',
                    containerId: 'msgNotify-container',
                    debug: false,
                    fadeIn: 300,
                    fadeOut: 1000,
                    extendedTimeOut: 1000,
                    iconClasses: {
                        error: 'msgNotify-error',
                        info: 'msgNotify-info',
                        success: 'msgNotify-success',
                        warning: 'msgNotify-warning'
                    },
                    iconClass: 'msgNotify-info',
                    positionClass: 'msgNotify-top-right',
                    timeOut: 5000, // Set timeOut to 0 to make it sticky
                    titleClass: 'msgNotify-title',
                    messageClass: 'msgNotify-message',
                    target: 'body'
                },

                error = function (message, title, optionsOverride) {
                    return notify({
                        iconClass: getOptions().iconClasses.error,
                        message: message,
                        optionsOverride: optionsOverride,
                        title: title
                    });
                },

                info = function (message, title, optionsOverride) {
                    return notify({
                        iconClass: getOptions().iconClasses.info,
                        message: message,
                        optionsOverride: optionsOverride,
                        title: title
                    });
                },

                notify = function (map) {
                    var
                        options = getOptions(),
                        iconClass = map.iconClass || options.iconClass;

                    if (typeof (map.optionsOverride) !== 'undefined') {
                        options = $.extend(options, map.optionsOverride);
                        iconClass = map.optionsOverride.iconClass || iconClass;
                    }

                    var
                        intervalId = null,
                        $container = getContainer(options),
                        $msgNotifyElement = $('<div/>'),
                        $titleElement = $('<div/>'),
                        $messageElement = $('<div/>'),
                        response = { options: options, map: map };

                    if (map.iconClass) {
                        $msgNotifyElement.addClass(options.msgNotifyClass).addClass(iconClass);
                    }

                    if (map.title) {
                        $titleElement.append(map.title).addClass(options.titleClass);
                        $msgNotifyElement.append($titleElement);
                    }

                    if (map.message) {
                        $messageElement.append(map.message).addClass(options.messageClass);
                        $msgNotifyElement.append($messageElement);
                    }

                    $msgNotifyElement.hide();
                    $container.prepend($msgNotifyElement);
                    $msgNotifyElement.fadeIn(options.fadeIn);
                    if (options.timeOut > 0) {
                        intervalId = setTimeout(fadeAway, options.timeOut);
                    }

                    $msgNotifyElement.hover(stickAround, delayedFadeAway);
                    if (!options.onclick && options.tapToDismiss) {
                        $msgNotifyElement.click(fadeAway);
                    }

                    if (options.onclick) {
                        $msgNotifyElement.click(function () {
                            options.onclick() && fadeAway();
                        });
                    }

                    if (options.debug && console) {
                        console.log(response);
                    }

                    return $msgNotifyElement;

                    function fadeAway() {
                        if ($(':focus', $msgNotifyElement).length > 0) {
                            return;
                        }
                        return $msgNotifyElement.fadeOut(options.fadeOut, function () {
                            removemsgNotify($msgNotifyElement);
                        });
                    }

                    function delayedFadeAway() {
                        if (options.timeOut > 0 || options.extendedTimeOut > 0) {
                            intervalId = setTimeout(fadeAway, options.extendedTimeOut);
                        }
                    }

                    function stickAround() {
                        clearTimeout(intervalId);
                        $msgNotifyElement.stop(true, true).fadeIn(options.fadeIn);
                    }
                },

                success = function (message, title, optionsOverride) {
                    return notify({
                        iconClass: getOptions().iconClasses.success,
                        message: message,
                        optionsOverride: optionsOverride,
                        title: title
                    });
                },

                warning = function (message, title, optionsOverride) {
                    return notify({
                        iconClass: getOptions().iconClasses.warning,
                        message: message,
                        optionsOverride: optionsOverride,
                        title: title
                    });
                },

                clear = function ($msgNotifyElement) {
                    var options = getOptions();
                    if (!$container) { getContainer(options) };
                    if ($msgNotifyElement && $(':focus', $msgNotifyElement).length === 0) {
                        $msgNotifyElement.fadeOut(options.fadeOut, function () {
                            removemsgNotify($msgNotifyElement);
                        });
                        return;
                    }
                    if ($container.children().length) {
                        $container.fadeOut(options.fadeOut, function () {
                            $container.remove();
                        });
                    }
                };

            var msgNotify = {
                clear: clear,
                error: error,
                getContainer: getContainer,
                info: info,
                options: {},
                success: success,
                version: '1.2.2',
                warning: warning
            };

            return msgNotify;

            //#region Internal Methods

            function getContainer(options) {
                if (!options) { options = getOptions(); }
                container = $('#' + options.containerId);
                if (container.children().length) {
                    return container;
                }
                container = $('<div/>')
                    .attr('id', options.containerId)
                    .addClass(options.positionClass);
                container.appendTo($(options.target));
                $container = container;
                return container;
            };

            function getOptions() {
                return $.extend({}, defaults, msgNotify.options);
            };

            function removemsgNotify($msgNotifyElement) {
                if (!$container) { $container = getContainer(); }
                if ($msgNotifyElement.is(':visible')) {
                    return;
                }
                $msgNotifyElement.remove();
                $msgNotifyElement = null;
                if ($container.children().length === 0) {
                    $container.remove();
                }
            }
            //#endregion

        })();
    });
}(typeof define === 'function' && define.amd ? define : function (deps, factory) {
    if (typeof module !== 'undefined' && module.exports) { //Node
        module.exports = factory(require(deps[0]));
    } else {
        window['msgNotify'] = factory(window['jQuery']);
    }
}));
