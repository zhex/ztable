/* Copyright (c) 2011 ZheX (Xu Zhe)
 *
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) 
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Version 1.0
 */

(function($) {

	$.fn.ztable = function(options) {

		var defaults = {
				wrapperClass:			'ztable-wrapper',
				dataContainerClass:		'ztable-data-container',
				columnContainerClass:	'ztable-column-container',
				tableWidth:				'100%',
				frozenColumn:			1
			},

			opts = $.extend(defaults, options),

			$table = $(this),

			$dc, // data container

			$wrapper, // wrapper 
			
			$cc,   // column container

			offset, // offset data of the table

			col_width; // frozen columns width


		var init = function() {
			createLayout();
			setStyle();
		}

		// create divs for the table needed
		var createLayout = function() {
			$table.wrap('<div class="' + opts.wrapperClass + '" />')
				  .wrap('<div class="' + opts.dataContainerClass + '" />');

			// set min-width to table th to prevent the bad result when calculate the offset
			if ($table.find('th').css('min-width').split('px')[0] < 35)
				  $table.find('th').css('min-width', 35); 

			$dc = $table.parent();
			$wrapper = $dc.parent();
			$cc = $('<div />').addClass(opts.columnContainerClass);
			$wrapper.prepend($cc.append($table.clone()));

			offset = $table.find('th:nth-child(' + (opts.frozenColumn + 1) + ')').offset();
			col_width = offset.left - $cc.offset().left;
		};

		// setup the style and position for divs
		var setStyle = function() {
			if (opts.tableWidth == '100%' || opts.tableWidth == '')
				opts.tableWidth = $wrapper.parent().css('width').split('px')[0];

			$wrapper.css({
				'width':		opts.tableWidth,
				'position':		'relative'
			});

			$cc.css({
				'width':		col_width,
				'overflow':		'hidden'
			});

			$dc.css({
				'position':		'absolute',
				'top':			0,
				'left':			col_width,
				'width':		opts.tableWidth - col_width,
				'overflow-x':	'scroll'

			}).find('table').css('margin-left', col_width * -1);
		};


		// run...
		init();
		

	}
	
})(jQuery);
