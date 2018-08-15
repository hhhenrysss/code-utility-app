const React = require('react');
const ReactDOM = require('react-dom');
const fs = require('fs');
const LinkedList = require('./js/data_structures').LinkedList;

const utils = {
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
    },
    extract_dict_data: function extract_dict_data(dict, key, default_value) {
        let fallback = default_value === undefined ? 'Example' : default_value;
        return (dict.hasOwnProperty(key)) ? dict[key] : fallback;
    },
    generate_object_depth: function generate_object_depth(obj) {
        function find_all_dictionaries(dict) {
            if (utils.is_valid_menu_item(dict)) {
                let max = -1;
                for (const key of Object.keys(dict)) {
                    let curr = dict[key];
                    let temp = find_all_dictionaries(curr);
                    max = temp > max ? temp : max;
                }
                return max + 1;
            }
            else if (Array.isArray(dict)) {
                let max = -1;
                for (let i = 0; i < dict.length; i += 1) {
                    let curr = dict[i];
                    let temp = find_all_dictionaries(curr);
                    max = temp > max ? temp : max;
                }
                return max;
            }
            else {
                return -1;
            }
        }

        return find_all_dictionaries(obj);
    },
    generate_data_array: function generate_data_array(data, new_level) {

        let array = [];
        let level = new_level;

        function find_all_dictionaries(dict, depth) {
            if (utils.is_valid_menu_item(dict)) {
                if (depth === level) {
                    array.push(dict);
                    return;
                }
                for (const key of Object.keys(dict)) {
                    let curr = dict[key];
                    find_all_dictionaries(curr, depth + 1);
                }
            }
            else if (Array.isArray(dict)) {
                for (let i = 0; i < dict.length; i += 1) {
                    let curr = dict[i];
                    find_all_dictionaries(curr, depth);
                }
            }
        }

        for (let i = 0; i < data.length; i += 1) {
            find_all_dictionaries(data[i], 0);
        }
        return array;
    }
};

class t_Icon {
    constructor(name, method) {
        this.name = name;
        this.method = method;
    }

    generate_icon_dict() {
        return {name: this.name, method: this.method}
    }

    generate_icon_element(key) {
        if (!this.method) {
            return <a key={key} href='#' className='icons'> {this.name} </a>
        }
        else {
            return <a key={key} href='#' className='icons' onClick={this.method}> {this.name} </a>
        }
    }
}


class Main extends React.Component {
    constructor(props) {
        super(props);
        this.keys = utils.generate_random_int(1);
        this.state = (() => {
            const data = JSON.parse(fs.readFileSync('data/main_selection.json', 'utf8'));
            let active = Array(data.length).fill(false);
            let history = new LinkedList(data);
            let icon_setting = new t_Icon('Setting', null);
            let icons = [icon_setting];
            icons.does_icon_exist = function does_icon_exist (name){
                for (let i = 0; i < this.length; i += 1) {
                    if (this[i].name === name) {
                        return i
                    }
                }
                return -1
            };
            return {
                data: data,
                active: active,
                history: history,
                icons: icons
            }
        })();
    }
    
    get is_history_end() {
        return this.state.history.length <= 1
    }

    update_active_status(i, is_show) {
        let new_array = this.state.active.slice();
        new_array[i] = is_show;
        this.setState({
            active: new_array
        })
    }


    update_current_menu(new_menu) {
        let prev = this.state.history;
        prev.push(new_menu);
        this.setState({
            history: prev
        })
    }

    return_previous_menu() {
        let prev = this.state.history;
        prev.pop();
        this.setState({
            history: prev
        });
        this.update_icons()
    }

    update_icons() {
        let prev = this.state.icons;
        if (!this.is_history_end) {
            let back_btn = new t_Icon('Back', () => {this.return_previous_menu()});
            prev.unshift(back_btn);
            this.setState({
                icons: prev
            });
            return
        }
        let index = prev.does_icon_exist('Back');
        if (index !== -1) {
            prev.splice(index, 1);
            this.setState({
                icons: prev
            })
        }
    }

    get_current_menu() {
        let curr = this.state.history.first;
        if (Array.isArray(curr)) {
            return curr
        }
        else if (curr.hasOwnProperty('sub_directories')) {
            return curr.sub_directories
        }
    }

    get_current_title() {
        let title = this.state.history.first.title;
        return !title ? 'A Simple APP' : title;
    }


    render() {
        return <MainMenu
            key={this.keys[0]}
            active={this.state.active}
            data={this.get_current_menu()}
            title={this.get_current_title()}
            icons={this.state.icons}
            updateStatus={(i, is_show) => this.update_active_status(i, is_show)}
            updateMenu={(new_data) => {this.update_current_menu(new_data); this.update_icons()}}
        />
    }
}


class MainMenu extends React.Component {
    constructor(props) {
        super(props);
        this.keys = (() => {
            let array = utils.generate_random_int(3);
            return {
                MainMenuIcons: array[0],
                MainMenuHeader: array[1],
                MainMenuList: array[2]
            }
        })();
    }

    render() {
        return [
            <MainMenuIcons key={this.keys.MainMenuIcons} icons={this.props.icons}/>,
            <MainMenuHeader key={this.keys.MainMenuHeader} title={this.props.title}/>,
            <MainMenuList
                key={this.keys.MainMenuList}
                data={this.props.data}
                active={this.props.active}
                updateStatus={(i, is_show) => this.props.updateStatus(i, is_show)}
                updateMenu={(new_data) => {this.props.updateMenu(new_data)}}
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
                    on_mouse_over={() => this.props.updateStatus(i, true)}
                    on_mouse_out={() => this.props.updateStatus(i, false)}
                    on_click={(new_data) => this.props.updateMenu(new_data)}
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

    redirect(dict, link) {
        if (dict.hasOwnProperty('sub_directories')) {
            this.props.on_click(dict);
        }
        else if (link !== undefined) {
            window.location.href = link
        }
    }

    render() {
        let dict = this.props.dictionary;
        let title = utils.extract_dict_data(dict, 'title');
        let content = utils.extract_dict_data(dict, 'content');
        let title_link = utils.extract_dict_data(dict, 'title_link', '#');
        let li_status = this.props.active;

        let a = <a href='#' onClick={() => this.redirect(dict, title_link)}> {title} </a>;
        let h3 = <h3 className='title'> {a} </h3>;
        let p = <p className='content'> {content} </p>;

        let empty = <p className='content'> </p>;
        // let instruction = <p className='content'> Hover to see more </p>;

        if (li_status) {
            return <li className='show' onMouseOut={() => this.props.on_mouse_out()}> {h3} {p} </li>;
        }
        else {
            return <li onMouseOver={() => this.props.on_mouse_over()}> {h3} {empty} </li>;
        }
    }
}


class MainMenuHeader extends React.Component {
    render() {
        return <h1> {this.props.title} </h1>
    }
}


class MainMenuIcons extends React.Component {
    constructor(props) {
        super(props);
        this.keys = utils.generate_random_int(2);
    }

    generate_icon_array() {
        let array = [];
        let icons = this.props.icons;
        for(let i = 0; i < icons.length; i += 1) {
            array.push(icons[i].generate_icon_element(this.keys[i]));
        }
        return array;
    }

    render() {
        return <div className='gear_icon'> {this.generate_icon_array()} </div>;
    }
}


ReactDOM.render(
    <Main/>,
    document.getElementsByClassName('react_dom')[0]
);
