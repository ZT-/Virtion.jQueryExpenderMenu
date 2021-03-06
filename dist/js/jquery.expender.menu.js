"use strict";

(function ($, window, document, undefined) {

    var pluginName = "jQueryExpenderMenu";
    var defaults = {
        speed: 300,
        isExpend: true,
        showDelay: 0,
        hideDelay: 0,
        singleOpen: true,
        clickEffect: true,
        showMenuCallback: function () { },
        hideMenuCallback: function () { }
    };

    function Plugin(element, options) {
        this.element = element;
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init()
    };

    $.extend(Plugin.prototype, {
        init: function () {
            this.addSubmenuListener();
            this.addExpendButtonListener();
            this.submenuIndicators();
            if (defaults.clickEffect) {
                this.addClickEffect()
            }
        },

        openSubmenu: function (that) {
            that.children(".submenu").delay(defaults.showDelay).slideDown(defaults.speed);
            that.children(".submenu").siblings("a").addClass("submenu-indicator-minus");
            if (defaults.singleOpen) {
                that.siblings().children(".submenu").slideUp(defaults.speed);
                that.siblings().children(".submenu").siblings("a").removeClass("submenu-indicator-minus")
            }
            defaults.showMenuCallback();
        },

        expendMenu: function (isExpend) {
            if (isExpend == true) {
                defaults.showMenuCallback();
            } else {
                defaults.hideMenuCallback();
            }
            defaults.isExpend = isExpend;
        },

        addSearchSource: function (element, textChangeCallback) {
            var header = $("#search-form");
            var form = $("<form>").attr({
                "class": "filterform",
                action: "#"
            }),
				input = $("<input>").attr({
				    "class": "filterinput",
				    type: "text"
				});
            $(form).append(input).appendTo(header);
            $(input).change(function () {
                textChangeCallback($(input).val());
            }).keyup(function () {
                $(input).change();
            });
        },

        addExpendButtonListener: function () {
            $("#jquery-expender-menu-expender-button").click(function () {
                if (defaults.isExpend == false) {
                    Plugin.prototype.expendMenu(true);
                } else {
                    Plugin.prototype.expendMenu(false);
                }
            });
        },

        addSubmenuListener: function () {

            $(this.element).children("ul").find("li").bind("click touchstart",

			function (e) {
			    e.stopPropagation();
			    e.preventDefault();
			    if ($(this).children(".submenu").length > 0) {
			        if ($(this).children(".submenu").css("display") == "none") {
			            Plugin.prototype.openSubmenu($(this));
			            return false
			        } else {
			            $(this).children(".submenu").delay(defaults.hideDelay).slideUp(defaults.speed);
			            //defaults.hideMenuCallback();
			        }
			        if ($(this).children(".submenu").siblings("a").hasClass("submenu-indicator-minus")) {
			            $(this).children(".submenu").siblings("a").removeClass("submenu-indicator-minus")
			        }
			    }
			    //window.location.href = $(this).children("a").attr("href")
			})

        },

        submenuIndicators: function () {
            if ($(this.element).find(".submenu").length > 0) {
                $(this.element).find(".submenu").siblings("a").append("<span class='submenu-indicator'>+</span>")
            }
        },

        addClickEffect: function () {
            var ink, d, x, y;
            $(this.element).find("a").bind("click touchstart", function (e) {
                $(".ink").remove();
                if ($(this).children(".ink").length === 0) {
                    $(this).prepend("<span class='ink'></span>")
                }
                ink = $(this).find(".ink");
                ink.removeClass("animate-ink");
                if (!ink.height() && !ink.width()) {
                    d = Math.max($(this).outerWidth(), $(this).outerHeight());
                    ink.css({
                        height: d,
                        width: d
                    })
                }
                x = e.pageX - $(this).offset().left - ink.width() / 2;
                y = e.pageY - $(this).offset().top - ink.height() / 2;
                ink.css({
                    top: y + 'px',
                    left: x + 'px'
                }).addClass("animate-ink")
            })
        }

    });

    $.fn[pluginName] = function (options) {
        this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options))
            }
        });
        return this;
    }

    $.fn["OpenSubmenu"] = function (obj) {
        Plugin.prototype.openSubmenu(obj);
    }

    $.fn["SetShowHideMenuCallBack"] = function (showCallback, hideCallBack) {
        defaults.showMenuCallback = showCallback;
        defaults.hideMenuCallback = hideCallBack;
    }

    $.fn["ExpendMenu"] = function (isExpend) {
        Plugin.prototype.expendMenu(isExpend);
    }

    $.fn["IsExpend"] = function () {
        return defaults.isExpend;
    }

    $.fn["AddSearchSource"] = function (element, textChangeCallback) {
        Plugin.prototype.addSearchSource(element, textChangeCallback);
    }

})(jQuery, window, document);