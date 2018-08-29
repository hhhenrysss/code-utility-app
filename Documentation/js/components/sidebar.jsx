const React = require('react');

class SideBarItemIcons extends React.Component {
    render() {
        return <em className={'SideBarItemIcons'}> {this.props.type} </em>
    }
}

class SideBarItemContents extends React.Component {
    render() {
        return <p className={'SideBarItemContents'}> {this.props.name} </p>
    }
}

class SideBarItem extends React.Component {
    render() {
        return [
            <li>
                <SideBarItemIcons type={this.props.type}/>,
                <SideBarItemContents name={this.props.name}/>
            </li>
        ]
    }
}

module.exports = class SideBar extends React.Component {

    render() {
        let items = [];
        items.push(
            <h3 className={'func_navigation_header'}> Documentation </h3>
        );
        for (name of this.props.module_list) {
            items.push(
                <SideBarItem name={name} type={'module'}/>
            )
        }
        return <nav className={'func_navigation'}><ul> {items} </ul></nav>
    }
};