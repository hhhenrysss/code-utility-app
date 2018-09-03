const React = require('react');

module.exports = {
    Header: class Header extends React.Component {
        constructor(props) {
            super(props)
        }

        render() {
            return <header><h3>Current at module: {this.props.current_module} </h3></header>
        }

    },
    SideBarControlButton: class SideBarControlButton extends React.Component {
        render() {
            return <div id="SideBarControlButton">
                <i id={"sidebarCollapse"} className={this.props.is_sidebar_active ? "fa fa-angle-left fa-2x" : "fa fa-angle-right fa-2x"}
                   onClick={this.props.update_SideBar_states}>
                </i>
            </div>
        }
    }
};