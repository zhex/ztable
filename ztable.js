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
				vColumnContainerClass:	'ztable-v-column-container',
				hColumnContainerClass:	'ztable-h-column-container',
				titleContainerClass:	'ztable-title-container',
				tableWidth:				'100%',
				tableHeight:			300,
				frozenRow:				1,
				frozenColumn:			1
			},

			opts = $.extend(defaults, options),

			$nodes = $(this),

			$table, // current table

			$dc, // data container

			$wrapper, // wrapper 
			
			$vcc,   // vertical column container

			$hcc,   // horizontal column container

			$tc,   //  fixed title container

			offset, // offset data of the table

			col_width, // frozen columns width

			col_height; // frozen columns height


		var init = function() {
			$nodes.each(function() {
				$table = $(this);
				createLayout();
				setStyle();
				bindEvt();
			});
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
			$vcc = $('<div />').addClass(opts.vColumnContainerClass);
			$wrapper.prepend($vcc.append($table.clone()));

			$hcc = $('<div />').addClass(opts.hColumnContainerClass);
			$wrapper.prepend($hcc.append($table.clone()));

			$tc = $('<div />').addClass(opts.titleContainerClass);
			$wrapper.prepend($tc.append($table.clone()));

		};

		// setup the style and position for divs
		var setStyle = function() {
			if (opts.tableWidth == '100%' || opts.tableWidth == '')
				opts.tableWidth = $wrapper.parent().css('width').split('px')[0];

			$wrapper.css({
				'width':		opts.tableWidth,
				'position':		'relative',
				'height':		opts.tableHeight
			});

			offset = $vcc.find('th:nth-child(' + (opts.frozenColumn + 1) + ')').offset();
			col_width = offset.left - $vcc.offset().left;

			offset = $hcc.find('tr:nth-child(' + (opts.frozenRow + 1) + ')').offset();
			col_height = offset.top - $hcc.offset().top;
			console.log(col_height);

			$vcc.css({
				'position':		'absolute',
				'width':		col_width,
				'top':			col_height,
				'height':		opts.tableHeight - col_height,		
				'overflow':		'hidden'
			}).find('table').css({
				'margin-top': col_height * -1
			});

			$hcc.css({
				'position':		'absolute',
				'left':			col_width,
				'width':		opts.tableWidth - col_width,
				'height':		col_height,
				'overflow':		'hidden',
				'z-index':		2

			}).find('table').css('margin-left', col_width * -1);

			$dc.css({
				'position':		'absolute',
				'top':			col_height,
				'left':			col_width,
				'width':		opts.tableWidth - col_width,
				'overflow-x':	'scroll',
				'height':		opts.tableHeight - col_height,		
				'z-index':		1

			}).find('table').css({
				'margin-left': col_width * -1,
				'margin-top': col_height * -1
			});

			$tc.css({
				'position':		'absolute',
				'width':		col_width,	
				'height':		col_height,		
				'overflow':		'hidden',
			});

		};

		// bind table events
		var bindEvt = function() {
			$dc.scroll(function(ev) {
				$hcc.find('table').css({
					'margin-left': (col_width * -1) - this.scrollLeft
				});
				$vcc.find('table').css({
					'margin-top': (col_height * -1) - this.scrollTop
				});
			});
		}


		// run...
		init();

	}
	
})(jQuery);
