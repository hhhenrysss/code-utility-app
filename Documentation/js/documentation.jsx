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
                current_module: 'Test flight',
                current_content: 'xxx',
                current_function: 'func',
                is_init_screen: true
            }
        })()
    }

    componentWillMount() {
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
            <SideBar module_list={this.state.all_modules}/>,
            <Article current_module={this.state.current_module} currrent_state={this.state.current_function}/>,
            <Header current_module={this.state.current_module}/>,
            <Footer/>
        ]
    }
}



ReactDOM.render(
    <Main/>,
    document.getElementsByClassName('react_dom')[0]
);