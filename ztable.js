/* Copyright (c) 2011 ZheX (Xu Zhe)
 *
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) 
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Version 1.1
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
				frozenRow:				true,
				rowCount:				1,
				frozenColumn:			true,	
				columnCount:			1
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

			if (opts.frozenColumn) {
				$vcc = $('<div />').addClass(opts.vColumnContainerClass);
				$wrapper.prepend($vcc.append($table.clone()));
			}
			if (opts.frozenRow) {
				$hcc = $('<div />').addClass(opts.hColumnContainerClass);
				$wrapper.prepend($hcc.append($table.clone()));
			}
			if (opts.frozenColumn && opts.frozenRow) {
				$tc = $('<div />').addClass(opts.titleContainerClass);
				$wrapper.prepend($tc.append($table.clone()));
			}
		};

		// setup the style and position for divs
		var setStyle = function() {
			if (opts.tableWidth == '100%' || opts.tableWidth == '')
				opts.tableWidth = $wrapper.parent().css('width').split('px')[0];

			$wrapper.css({'position': 'relative'});

			if (opts.frozenColumn && opts.frozenRow)
				setStyleHV();
			else if (opts.frozenColumn)
				setStyleV();
			else if (opts.frozenRow)
				setStyleH();
		};

		var setStyleH = function() {
			$hcc.css({
				'overflow':		'hidden',
				'width':		'100%'
			});

			$dc.css({
				'position':		'absolute',
				'left':			col_width,
				'width':		$table.width(),
				'overflow-y':	'scroll',
			});

			offset = $dc.find('tr:nth-child(' + (opts.rowCount + 1) + ')').offset();
			col_height = offset.top - $dc.offset().top;

			$hcc.css('height', col_height);

			$dc.css({
				'top':			col_height,
				'height':		opts.tableHeight - col_height,
			}).find('table').css({'margin-top': col_height * -1});

			$wrapper.css({
				'width':		$table.width(),
				'height':		opts.tableHeight
			});

		};

		var setStyleV = function() {
			var wrapperStyle = {
				'width':		opts.tableWidth,
			};

			$wrapper.css(wrapperStyle); 

			offset = $vcc.find('th:nth-child(' + (opts.columnCount + 1) + ')').offset();
			col_width = offset.left - $vcc.offset().left;

			var dcStyle = {
				'position':		'absolute',
				'top':			0,
				'left':			col_width,
				'width':		opts.tableWidth - col_width,
				'overflow-x':	'scroll',
			};

			var vccStyle = {
				'width':		col_width,
				'overflow':		'hidden',
			};
			$vcc.css(vccStyle);

			$dc.css(dcStyle).find('table').css({
				'margin-left': col_width * -1,
			});
		};

		var setStyleHV = function() {
			$wrapper.css({
				'width':		opts.tableWidth,
				'height':		opts.tableHeight
			}); 

			offset = $dc.find('th:nth-child(' + (opts.columnCount + 1) + ')').offset();
			col_width = offset.left - $dc.offset().left;
			
			offset = $dc.find('tr:nth-child(' + (opts.rowCount + 1) + ')').offset();
			col_height = offset.top - $dc.offset().top;

			$vcc.css({
				'position':		'absolute',
				'width':		col_width,
				'top':			col_height,
				'overflow':		'hidden',
				'height':		opts.tableHeight - col_height
			}).find('table').css({
				'margin-top': col_height * -1
			});

			$hcc.css({
				'position':		'absolute',
				'left':			col_width,
				'width':		opts.tableWidth - col_width - 15,
				'height':		col_height,
				'overflow':		'hidden',
			}).find('table').css('margin-left', col_width * -1);

			$dc.css({
				'position':		'absolute',
				'top':			col_height,
				'left':			col_width,
				'width':		opts.tableWidth - col_width,
				'overflow':		'scroll',
				'height':		opts.tableHeight - col_height
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
		}

		// bind table events
		var bindEvt = function() {
			$dc.scroll(function(ev) {
				if (opts.frozenRow) {
					$hcc.find('table').css({
						'margin-left': (col_width * -1) - this.scrollLeft
					});
				}
				if (opts.frozenColumn) {
					$vcc.find('table').css({
						'margin-top': (col_height * -1) - this.scrollTop
					});
				}
			});
		}


		// run...
		init();

	}
	
})(jQuery);
