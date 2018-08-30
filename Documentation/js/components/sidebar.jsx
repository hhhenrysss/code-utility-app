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
        return <strong className={'SideBarItemContents'} onClick={this.props.onClick}> <a href={'#'}> {this.props.name} </a> </strong>
    }
}

class SideBarItem extends React.Component {
    render() {
        return <li className={'SideBarItem'}>
                <SideBarItemIcons key={'icon_'+this.props.name} name={this.props.name} type={this.props.type}/>
                <SideBarItemContents key={'content_'+this.props.name} name={this.props.name} onClick={() => this.props.onClick()}/>
            </li>

    }
}


class SideBarGroup extends React.Component {


    // the behavior is to expand the list and update other interfaces at the same time
    componentDidUpdate() {
        console.log('a')
        this.expand_and_update()
    }
    componentDidMount() {
        this.expand_and_update()
    }

    shouldComponentUpdate() {
        return this.props.if_current_module;
    }

    expand_and_update() {
        if (this.props.if_current_module) {
            receiver.code.get_code_code(this.props.name)
                .then((code_array) => {
                    this.props.updating_methods.update_current_displayed_functions(code_array.map(item => item.code));
                })
                .catch((error) => {
                    throw error;
                });
        }
    }

    render() {
        if (this.props.if_current_module) {
            let array_of_sub_lists = [];
            for (const func of this.props.state_values.current_displayed_functions) {
                array_of_sub_lists.push(
                    <SideBarItem type={'function'} name={func} key={'function_'+func}/>
                )
            }
            return <div className={'SideBarSubGroup'} key={'SideBarSubGroup_div_'+this.props.name}>
                <SideBarItem key={'SideBarSubGroup_SideBarItem'+this.props.name} type={'module'} name={this.props.name} onClick={() => this.props.onClick()}/>
                <ul key={'SideBarSubGroup_ul_'+this.props.name} className={'SideBarSubGroupList'}> {array_of_sub_lists} </ul>
            </div>
        }
        else {
            return <div key={'SideBarGroup_div_'+this.props.name}>
                <SideBarItem key={'SideBarGroup_SideBarItem_'+this.props.name} type={'module'} name={this.props.name} onClick={() => this.props.onClick()}/>
            </div>
        }
    }
}

// todo: add key for each child
module.exports = class SideBar extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        // todo: finish this drop down list
        let rendered_items = [];
        rendered_items.push(
            <div key={'SideBar_div'} className={'SideBar_navigation_header'}> Documentation </div>
        );


        for (const name of this.props.state_values.all_modules) {
            rendered_items.push(
                <SideBarGroup
                    name={name}
                    key={'module_'+name}
                    if_current_module={ name === this.props.state_values.current_module }
                    updating_methods={this.props.updating_methods}
                    state_values={this.props.state_values}
                    onClick={() => {
                        this.props.updating_methods.update_current_module_name(name)
                    }}
                />
            )
        }

        return <nav className={'SideBar_navigation'}><ul> {rendered_items} </ul></nav>
    }
};