const React = require('react');
const ReactDOM = require('react-dom');
const path = require('path');
const node_path = process.cwd();

const Redirect = require(path.join(node_path, 'Documentation/js/redirect.js')).Redirect;
const redirect = new Redirect();
const extract = require(path.join(node_path, `Documentation/languages/${redirect.name}/js/extract.js`)).extract;
const receiver = extract();

const SideBar = require(path.join(node_path, 'Documentation/js/components/sidebar.js')).SideBar;
const SideBarControlButton = require(path.join(node_path, 'Documentation/js/components/sidebar.js')).SideBarControlButton;
const Article = require(path.join(node_path, 'Documentation/js/components/main_content.js'));
const Header = require(path.join(node_path, 'Documentation/js/components/header.js'));
const Footer = require(path.join(node_path, 'Documentation/js/components/footer.js'));

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = (function () {
            return {
                all_modules: [],
                all_module_states: [],
                current_module_name: 'Test flight',
                current_content: 'xxx',
                current_active_function: 'undefined',
                current_displayed_functions: [],
                is_SideBar_active: true
            }
        })()
    }

    update_current_module_name(module_name_string) {
        this.setState({
            current_module_name: module_name_string
        })
    }

    update_current_module_state(index, curr_module_name) {
        let new_state = JSON.parse(JSON.stringify(this.state.all_module_states));
        let new_array = JSON.parse(JSON.stringify(this.state.current_displayed_functions));
        if (new_state[index] === false) {
            new_state[index] = true;
            this.setState({
                all_module_states: new_state
            })
        }
        else {
            new_state[index] = false;
            let delete_flag = false;
            let location_index = 0;
            for (let [array_index, obj] of new_array.entries()) {
                if (obj.hasOwnProperty(curr_module_name)) {
                    delete_flag = true;
                    location_index = array_index;
                    break;
                }
            }
            if (delete_flag) {
                new_array = new_array.slice(location_index);
            }
            this.setState({
                all_module_states: new_state,
                current_displayed_functions: new_array
            })
        }
    }

    update_current_content(complete_doc) {
        this.setState({
            current_content: complete_doc
        })
    }

    update_current_displayed_functions(function_obj) {
        let new_array = JSON.parse(JSON.stringify(this.state.current_displayed_functions));
        new_array.push(function_obj);
        this.setState({
            current_displayed_functions: new_array
        })
    }

    update_current_active_function(function_string) {
        this.setState({
            current_active_function: function_string
        })
    }

    update_SideBar_states() {
        this.setState({
            is_SideBar_active: !this.state.is_SideBar_active
        })
    }


    componentDidMount() {
        receiver.module.get_all_module_names()
            .then((all_module_names) => {
            this.setState({
                all_modules: all_module_names,
                all_module_states: Array(all_module_names.length).fill(false)
            });
        })
            .catch((error) => {
            throw error;
        })
    }

    render() {
        return [
            <Header key={'Main_Header'} current_module={this.state.current_module_name}/>,
            <SideBar updating_methods={(() => {
                return {
                    update_current_module_name: (module_name_string) => this.update_current_module_name(module_name_string),
                    update_current_displayed_functions: (array_of_functions) => this.update_current_displayed_functions(array_of_functions),
                    update_current_content: (complete_doc) => this.update_current_content(complete_doc),
                    update_current_active_function: (function_string) => this.update_current_active_function(function_string),
                    update_current_module_state: (index) => this.update_current_module_state(index)
                }
            })()} state_values={(() => {
                return {
                    all_modules: this.state.all_modules,
                    all_module_states: this.state.all_module_states,
                    current_module: this.state.current_module_name,
                    current_displayed_functions: this.state.current_displayed_functions,
                    current_active_function: this.state.current_active_function,
                    is_SideBar_active: this.state.is_SideBar_active
                }
            })()}
            key={'Main_SideBar'}
            />,
            <SideBarControlButton key={'Main_SideBarControlButton'} update_SideBar_states={() => this.update_SideBar_states()}/>,
            <Article key={'Main_Article'} current_module={this.state.current_module_name} currrent_state={this.state.current_function}/>,
            <Footer key={'Main_Footer'}/>
        ]
    }
}



ReactDOM.render(
    <Main/>,
    document.getElementsByClassName('react_dom')[0]
);