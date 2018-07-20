 const main_actions = (function drop_down_menu() {

    let utils = {
        'tag_name': function tag_name($element) {
            return $element.prop('tagName').toLowerCase();
        }
    };

    function scrolling_effects() {

        let $ul = $('ul');
        let $all_li = $('li');
        let height = $ul.outerHeight();


        $(window).resize(function () {
            height = $ul.outerHeight();
        });

        $ul.scroll(function () {
            $all_li.each(function () {
                let $this = $(this);
                let top = $this.position().top;
                let bottom = $this.height();
                let optimal = height / 1.5;

                if (optimal > top && optimal < top + bottom) {
                    if ((!$this.hasClass('show')) && $('.show').length === 0) {
                        $this.addClass('show')
                    }
                }
                else {
                    $(this).removeClass('show');
                }
            })
        })




        // $ul.scroll(function () {
        //     const curr_scroll = $ul.scrollTop();
        //     const $curr_show = $('li.show');
        //     if ($ul.is(':animated')) {
        //         return
        //     }
        //     if (curr_scroll > last_scroll +50) {
        //         // means scrolling down
        //         let $next = $curr_show.next('li');
        //         if ($next.length) {
        //             $next.addClass('show');
        //             last_scroll = curr_scroll;
        //             $ul.animate({scrollTop: $next.position().top}, 650, 'linear');
        //             $curr_show.removeClass('show');
        //         }
        //     }
        //     else if (curr_scroll +50< last_scroll) {
        //         // means scrolling up
        //         let $prev = $curr_show.prev('li');
        //         if ($prev.length) {
        //             $prev.addClass('show');
        //             last_scroll = curr_scroll;
        //             $ul.animate({scrollTop: $prev.position().top}, 650, 'linear');
        //             $curr_show.removeClass('show');
        //         }
        //     }
        //     console.log(last_scroll);
        //     console.log('  '+curr_scroll)
        // });

        // $('.title, .content, li').on('scroll', function () {
        //     const $this = $(this);
        //     if (utils.tag_name($this) !== 'li') {
        //         let $parent = $this.parent();
        //         if (!$parent.hasClass('show')) {
        //             $parent.addClass('show');
        //         }
        //         $all_titles.not(this).each(function () {
        //             $(this).parent().removeClass('show')
        //         });
        //     }
        //     else {
        //         if (!$this.hasClass('show')){
        //             $this.addClass('show')
        //         }
        //         $all_lis.not(this).each(function () {
        //             $(this).removeClass('show')
        //         })
        //     }
        // });
    }


    function init() {
        scrolling_effects();
    }

    return {
        'init': init
    }
})();