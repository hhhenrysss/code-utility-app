const React = require('react');
const extract = require(path.join(node_path, `Documentation/languages/${redirect.name}/js/extract.js`)).extract;
const receiver = extract();

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
            <li className={'SideBarItem'}>
                <SideBarItemIcons type={this.props.type}/>
                <SideBarItemContents name={this.props.name}/>
            </li>
        ]
    }
}

class SideBarGroup extends React.Component {


    expand_group() {
        if (this.props.if_current_module) {
            receiver.code.get_all_code_ids(this.state.current_module_name)
                .then((code_ids) => {
                    this.props.updating_methods.update_current_module_name(this.props.name);
                    let promise_array
                    for (id of code_ids) {

                    }
                })
                .catch((error) => {
                    throw error;
                });
        }
    }

    render() {
        return
    }
}

// todo: add key for each child
module.exports = class SideBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = (() => {
            return {
                active_group_index: 0
            }
        })()
    }

    render() {
        // todo: finish this drop down list
        let rendered_items = [];
        rendered_items.push(
            <div className={'SideBar_navigation_header'}> Documentation </div>
        );


        for (name of this.props.module_list) {
            rendered_items.push(
                <SideBarGroup name={name} if_current_module={ name === this.props.current_module } updating_methods={this.props.updating_methods}/>
            )
        }

        return <nav className={'SideBar_navigation'}><ul> {rendered_items} </ul></nav>
    }
};