let main_actions = (function drop_down_menu() {

    let $ul = $('ul');
    let $all_li = $('li');
    let $h1 = $('h1');

    let utils = {
        'tag_name': function tag_name($element) {
            return $element.prop('tagName').toLowerCase();
        },
        'is_within_range': function is_within_range(range, actual) {
            return (range[1] > actual[0] && range[1] < actual[1]) || (range[0] > actual[0] && range[0] < actual[1])
        }
    };

    function update_li_position() {
        let h1_top = $h1.offset().top;
        let h1_height = $h1.height();
        let h1_padding_top = ($h1.outerHeight() - h1_height) / 2;
        let ul_top = $ul.offset().top;
        let li_padding_top = $all_li.eq(1).css('padding-top').replace('px', '');
        let padding_top = h1_top + h1_padding_top - li_padding_top * 2 - ul_top;
        let padding_bottom = h1_top + h1_padding_top - ul_top;
        $ul.css({
            'padding-top': padding_top,
            'padding-bottom': padding_bottom
        });
    }


    function scrolling_effects() {

        let height = $ul.outerHeight();
        let center = $h1.offset().top + $h1.outerHeight()/2;

        $(window).resize(function () {
            height = $ul.outerHeight();
            center = $h1.offset().top + $h1.outerHeight()/2;
            update_li_position()
        });

        $ul.scroll(function () {
            $all_li.each(function () {
                let $this = $(this);
                let top = $this.offset().top;
                console.log(center)
                let bottom = $this.outerHeight();
                let optimal_range = [center - 25, center + 25];
                if (utils.is_within_range(optimal_range, [top, top + bottom])) {
                    if ((!$this.hasClass('show')) && $('.show').length === 0) {
                        $this.addClass('show')
                    }
                }
                else {
                    $(this).removeClass('show');
                }
            })
        })
    }

    function load_elements() {
        let React = require('react');
    }


    function init() {
        update_li_position();
        scrolling_effects();
    }

    return {
        'init': init
    }
})();


