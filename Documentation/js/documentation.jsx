const React = require('react');
const ReactDOM = require('react-dom');
const path = require('path');
const Redirect = require(path.join(process.cwd(), 'Documentation/js/redirect.js')).Redirect;
const redirect = new Redirect();
const extract = require(path.join(process.cwd(), `Documentation/languages/${redirect.name}/js/extract.js`)).extract;
const receiver = extract();

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
            <Article/>,
            <Header/>,
            <Footer/>
        ]
    }
}

class SideBarItem extends React.Component {
    render() {
        return [
            <dt> {this.props.dt} </dt>,
            <dd> {this.props.dd} </dd>
        ]
    }
}

class SideBar extends React.Component {

    render() {
        let items = [];
        for (name of this.props.module_list) {
            items.push(
                <SideBarItem dd={name} dt={'module'}/>
            )
        }
        return <aside><dl> {items} </dl></aside>
    }
}



class Article extends React.Component {
    constructor(props) {
        super(props)
    }
    render(){
        return <article></article>
    }
}

class Header extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return <header></header>
    }
}

class Footer extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return <footer></footer>
    }
}


ReactDOM.render(
    <Main/>,
    document.getElementsByClassName('react_dom')[0]
);