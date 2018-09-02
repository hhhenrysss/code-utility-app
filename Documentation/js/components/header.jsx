const React = require('react');

module.exports = class Header extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return <header> {this.props.current_module} </header>
    }
};