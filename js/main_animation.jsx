const React = require('react');
const ReactDOM = require('react-dom');
const fs = require('fs');
const d = document;
const utils = {
    offset: function offset(elem) {
        let rect = elem.getBoundingClientRect();
        return {
            top: rect.top,
            left: rect.left,
            bottom: rect.bottom,
            right: rect.right
        }
    },
    outerHeight: function outerHeight(elem) {
        let rect = elem.getBoundingClientRect();
        return rect.bottom - rect.top;
    },
    height: function height(elem) {
        let style = getComputedStyle(elem);
        let padding = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
        return elem.clientHeight - padding;
    },
    css: function css(elem, style) {
        if (typeof style === typeof '') {
            let computed_style = getComputedStyle(elem);
            return computed_style.style;
        }
        else {
            let keys = Object.keys(style);
            let string = '';
            for (let i = 0; i < keys.length; i += 1) {
                string += keys[i] + ': ' + style[keys[i]] + '; ';
            }
            elem.setAttribute('style', string.trim());
        }
    },
    is_within_range: function is_within_range(range, actual) {
        return (range[1] > actual[0] && range[1] < actual[1]) || (range[0] > actual[0] && range[0] < actual[1])
    },
    is_valid_menu_item: function is_valid_menu_item(dict) {
        let list_of_attributes = ['title', 'content', 'sub_directories', 'title_link'];
        for (let i = 0; i < list_of_attributes.length; i += 1) {
            if (dict.hasOwnProperty(list_of_attributes[i])) {
                return true;
            }
        }
        return false;
    },
    generate_random_int: function generate_random_int(number) {
        let array = new Uint32Array(number);
        window.crypto.getRandomValues(array);
        return array;
    }
};

class MainMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = (() => {
            let data = JSON.parse(fs.readFileSync('data/main_selection.json', 'utf8'));
            let active = Array(data.length).fill(false);
            return {
                level: 0,
                data: data,
                active: active
            }
        })();
        this.keys = (() => {
            let array = utils.generate_random_int(3);
            return {
                MainMenuIcons: array[0],
                MainMenuHeader: array[1],
                MainMenuList: array[2]
            }
        })();
    }

    update_active_status (i, is_show) {
        let new_array = this.state.active.slice();
        new_array[i] = is_show;
        this.setState({
            active: new_array
        })
    }

    generate_data_array() {

        let array = [];
        let state = this.state;

        function find_all_dicts(dict, depth) {
            if (utils.is_valid_menu_item(dict)) {
                if (depth === state.level) {
                    array.push(dict);
                    return;
                }
                let keys = Object.keys(dict);
                for (let i = 0; i < keys.length; i += 1) {
                    let curr = dict[keys[i]];
                    if (utils.is_valid_menu_item(curr)) {
                        find_all_dicts(curr, depth+1);
                    }
                }
            }
        }

        let data = state.data;
        for (let i = 0; i < data.length; i += 1) {
            find_all_dicts(data[i], 0);
        }

        return array;
    }


    render() {
        return [
            <MainMenuIcons key={this.keys.MainMenuIcons}/>,
            <MainMenuHeader key={this.keys.MainMenuHeader}/>,
            <MainMenuList
                key={this.keys.MainMenuList}
                data={this.generate_data_array()}
                active={this.state.active}
                updateStatus={(i, is_show) => this.update_active_status(i, is_show)}
            />
        ]
    }
}

class MainMenuList extends React.Component {

    constructor(props) {
        super(props);
        this.keys = (() => {
            let length = this.props.data.length;
            return utils.generate_random_int(length)
        })();
    }

    render() {
        let data = this.props.data;
        let list = [];
        for (let i = 0; i < data.length; i += 1) {
            list.push(
                <MainMenuListItem
                    key={this.keys[i]}
                    dictionary={data[i]}
                    active={this.props.active[i]}
                    onMouseOver={() => this.props.updateStatus(i, true)}
                    onMouseOut={() => this.props.updateStatus(i, false)}
                />
            );
        }
        return <ul
            className='main_select'>
            {list}
            </ul>
    }
}

class MainMenuListItem extends React.Component {
    render() {
        let dict = this.props.dictionary;
        let title = (dict.hasOwnProperty('title') === -1) ? 'Example' : dict['title'];
        let content = (dict.hasOwnProperty('content') === -1) ? 'Example' : dict['content'];
        let title_link = (dict.hasOwnProperty('title_link') === -1) ? '#' : dict['title_link'];
        let li_status = this.props.active;


        let a = <a href={title_link}> {title} </a>;
        let h3 = <h3 className='title'> {a} </h3>;
        let p = <p className='content'> {content} </p>;

        let instruction = <p className='content'> Hover to see more </p>;

        if (li_status) {
            return <li className='show' onMouseOut={() => this.props.onMouseOut()}> {h3} {p} </li>;
        }
        else {
            return <li onMouseOver={() => this.props.onMouseOver()} > {h3} {instruction} </li>;
        }
    }
}

class MainMenuHeader extends React.Component {
    render() {
        return <h1>A Simple APP</h1>
    }
}

class MainMenuIcons extends React.Component {
    render() {
        return <div className='gear_icon'><p><a>Settings</a></p></div>
    }
}


ReactDOM.render(
    <MainMenu/>,
    d.getElementsByTagName('body')[0]
);


