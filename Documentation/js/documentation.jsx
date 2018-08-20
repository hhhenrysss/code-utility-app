const React = require('react');
const ReactDOM = require('react-dom');
const path = require('path');
const Redirect = require(path.join(process.cwd(), 'Documentation/js/redirect.js')).Redirect;
const exec = require(path.join(process.cwd(), 'Documentation/js/exec.js')).Redirect;

class Main extends React.Component {
    render() {
        return [
            <SideBar/>,
            <Article/>,
            <Header/>,
            <Footer/>
        ]
    }
}

class SideBar extends React.Component {
    render() {
        return <aside></aside>
    }
}

class Article extends React.Component {
    render(){
        return <article></article>
    }
}

class Header extends React.Component {
    render() {
        return <header></header>
    }
}

class Footer extends React.Component {
    render() {
        return <footer></footer>
    }
}

ReactDOM.render(
    <Main/>,
    document.getElementsByClassName('react_dom')[0]
);
