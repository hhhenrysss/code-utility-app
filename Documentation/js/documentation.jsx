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
                current_content: {document: 'Test flight'},
                current_active_function: null,
                current_displayed_functions: [],
                is_SideBar_active: true
            }
        })()
    }

    componentDidMount() {
        receiver.module.get_all_module_names()
            .then((all_module_names) => {
                this.setState({
                    all_modules: all_module_names.map(item => item[receiver.db_configs.names.module_title]),
                    all_module_states: Array(all_module_names.length).fill(false)
                });
            })
            .catch((error) => {
                throw error;
            })
    }

    update_current_module_name(module_name_string) {
        this.setState({
            current_module_name: module_name_string
        })
    }

    update_current_module_state(index, curr_module_name) {
        // Original strategy is to allow multiple dropdowns
        // let new_state = JSON.parse(JSON.stringify(this.state.all_module_states));
        // let new_array = JSON.parse(JSON.stringify(this.state.current_displayed_functions));
        // if (new_state[index] === false) {
        //     new_state[index] = true;
        //     this.setState({
        //         all_module_states: new_state
        //     })
        // }
        // else {
        //     new_state[index] = false;
        //     // let new_state = Array(this.state.all_module_states.length).fill(false);
        //     // delete corresponding functions
        //     let delete_flag = false;
        //     let location_index = 0;
        //     for (let [array_index, obj] of new_array.entries()) {
        //         if (obj.hasOwnProperty(curr_module_name)) {
        //             delete_flag = true;
        //             location_index = array_index;
        //             break;
        //         }
        //     }
        //     if (delete_flag) {
        //         new_array = new_array.slice(location_index);
        //     }
        //     this.setState({
        //         all_module_states: new_state,
        //         current_displayed_functions: new_array
        //     })
        // }

        // Changed to allow only one active at a time
        let new_state = Array(this.state.all_module_states.length).fill(false);
        let new_array = JSON.parse(JSON.stringify(this.state.current_displayed_functions));
        if (this.state.all_module_states[index] === false) {
            new_state[index] = true;
            this.setState({
                all_module_states: new_state
            })
        }
        else {
            // delete corresponding functions
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

    update_current_content(doc_obj) {
        this.setState({
            current_content: doc_obj,
            current_active_function: null
        });
    }

    update_current_active_function(func_obj) {
        this.setState({
            current_active_function: func_obj,
            current_content: null
        })
    }

    update_current_displayed_functions(function_obj) {
        let new_array = JSON.parse(JSON.stringify(this.state.current_displayed_functions));
        new_array.push(function_obj);
        this.setState({
            current_displayed_functions: new_array
        })
    }

    update_SideBar_states() {
        this.setState({
            is_SideBar_active: !this.state.is_SideBar_active
        })
    }

    generate_state_values() {
        return this.state
    }

    generate_updating_methods() {
        return {
            update_current_module_name: (module_name_string) => this.update_current_module_name(module_name_string),
            update_current_displayed_functions: (array_of_functions) => this.update_current_displayed_functions(array_of_functions),
            update_current_content: (complete_doc) => this.update_current_content(complete_doc),
            update_current_active_function: (function_string) => this.update_current_active_function(function_string),
            update_current_module_state: (index) => this.update_current_module_state(index)
        }
    }


    render() {
        return [
            <SideBar updating_methods={this.generate_updating_methods()}
                     state_values={this.generate_state_values()}
                     key={'Main_SideBar'}
            />,
            <div id={'content'} key={'div_content'}>
                <Header key={'Main_Header'} current_module={this.state.current_module_name}/>
                <SideBarControlButton key={'Main_SideBarControlButton'}
                                      update_SideBar_states={() => this.update_SideBar_states()}/>
                <Article key={'Main_Article'} state_values={this.generate_state_values()}/>
                <Footer key={'Main_Footer'}/>
            </div>
        ]
    }
}


ReactDOM.render(
    <Main/>,
    document.getElementsByClassName('react_dom')[0]
);