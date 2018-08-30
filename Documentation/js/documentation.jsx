const React = require('react');
const ReactDOM = require('react-dom');
const path = require('path');
const node_path = process.cwd();

const Redirect = require(path.join(node_path, 'Documentation/js/redirect.js')).Redirect;
const redirect = new Redirect();
const extract = require(path.join(node_path, `Documentation/languages/${redirect.name}/js/extract.js`)).extract;
const receiver = extract();

const SideBar = require(path.join(node_path, 'Documentation/js/components/sidebar.js'));
const Article = require(path.join(node_path, 'Documentation/js/components/main_content.js'));
const Header = require(path.join(node_path, 'Documentation/js/components/header.js'));
const Footer = require(path.join(node_path, 'Documentation/js/components/footer.js'));

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = (function () {
            return {
                all_modules: [],
                current_module_name: 'Test flight',
                current_content: 'xxx',
                current_active_function: 'undefined',
                current_displayed_functions: []
            }
        })()
    }

    update_current_module_name(module_name_string) {
        this.setState({
            current_module_name: module_name_string
        })
    }

    update_current_content(complete_doc) {
        this.setState({
            current_content: complete_doc
        })
    }

    update_current_displayed_functions(array_of_functions) {
        this.setState({
            current_displayed_functions: array_of_functions
        })
    }

    update_current_active_function(function_string) {
        this.setState({
            current_active_function: function_string
        })
    }


    componentDidMount() {
        receiver.module.get_all_module_names()
            .then((all_module_names) => {
            this.setState({all_modules: all_module_names});
        })
            .catch((error) => {
            throw error;
        })
    }

    render() {
        return [
            <SideBar updating_methods={(() => {
                return {
                    update_current_module_name: (module_name_string) => this.update_current_module_name(module_name_string),
                    update_current_displayed_functions: (array_of_functions) => this.update_current_displayed_functions(array_of_functions),
                    update_current_content: (complete_doc) => this.update_current_content(complete_doc),
                    update_current_active_function: (function_string) => this.update_current_active_function(function_string)
                }
            })()} state_values={(() => {
                return {
                    all_modules: this.state.all_modules,
                    current_module: this.state.current_module_name,
                    current_displayed_functions: this.state.current_displayed_functions,
                    current_active_function: this.state.current_active_function
                }
            })()}
            key={'Main_SideBar'}
            />,
            <Article key={'Main_Article'} current_module={this.state.current_module_name} currrent_state={this.state.current_function}/>,
            <Header key={'Main_Header'} current_module={this.state.current_module_name}/>,
            <Footer key={'Main_Footer'}/>
        ]
    }
}



ReactDOM.render(
    <Main/>,
    document.getElementsByClassName('react_dom')[0]
);