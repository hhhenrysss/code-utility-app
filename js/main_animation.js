let main_actions = (function drop_down_menu() {

    function scrolling_effects() {
        let $all_titles = $('.title');
        $('.title, .content').hover(function () {
            let $parent = $(this).parent();
            if (!$parent.hasClass('show')) {
                $parent.addClass('show');
            }
            $all_titles.not(this).each(function () {
                $(this).parent().removeClass('show')
            });
        });

        let $all_lis = $('li');
        $all_lis.hover(function () {
            let $this = $(this);
            if (!$this.hasClass('show')) {
                $this.addClass('show');
                $all_lis.not(this).each(function () {
                    $(this).removeClass('show')
                })
            }
        });

        $('ul').mouseleave(function () {
            $all_lis.removeClass('show');
        })
    }

    function change_view_box_length() {
        let $ul = $('ul');
        let calculated_height = Number($ul.css('height').replace('px', ''))+100;
        $ul.css('height', calculated_height+'px');
    }

    function init() {
        change_view_box_length();
        scrolling_effects();
    }

    return {
        'init': init
    }
})();