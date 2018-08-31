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
        return <strong className={'SideBarItemContents'} onClick={() => {this.props.onClick(this.props.name)}}> <a className={'simulate_link'}> {this.props.name} </a> </strong>
    }
}

class SideBarItem extends React.Component {
    render() {
        return <li className={'SideBarItem'}>
                <SideBarItemIcons key={'icon_'+this.props.name} name={this.props.name} type={this.props.type}/>
                <SideBarItemContents key={'content_'+this.props.name} name={this.props.name} onClick={(curr_name) => this.props.onClick(curr_name)}/>
            </li>

    }
}

class SideBarSubGroup extends React.PureComponent {
    componentDidMount() {
        const curr_name = this.props.name;
        receiver.code.get_code_code(curr_name)
            .then((code_array) => {
                this.props.updating_methods.update_current_displayed_functions({[curr_name]: code_array.map(item => item.code)});
            })
            .catch((error) => {
                throw error;
            });
    }

    render() {
        let array_of_sub_lists = [];
        for (let item of this.props.state_values.current_displayed_functions) {
            if (item.hasOwnProperty(this.props.name)) {
                for (const func of item[this.props.name]) {
                    array_of_sub_lists.push(
                        <SideBarItem type={'function'} name={func} key={'function_'+func}/>
                    )
                }
                break;
            }
        }
        return <ul className={'SideBarSubGroupList'}>
            {array_of_sub_lists.length === 0 ? ' ' : array_of_sub_lists}
            </ul>
    }
}

class SideBarGroup extends React.PureComponent {

    render() {
        if (this.props.current_module_state === true) {
            return <div
                className={'SideBarSubGroup'}
                key={'SideBarSubGroup_div_'+this.props.name}>
                <SideBarItem
                    key={'SideBarSubGroup_SideBarItem_'+this.props.name}
                    type={'module'}
                    name={this.props.name}
                    onClick={(curr_name) => this.props.onClick(curr_name)}/>
                <SideBarSubGroup
                    key={'SideBarSubGroup_'+this.props.name}
                    name={this.props.name}
                    state_values={this.props.state_values}
                    updating_methods={this.props.updating_methods}/>
            </div>
        }
        else {
            return <div
                key={'SideBarGroup_div_'+this.props.name}>
                <SideBarItem
                    key={'SideBarGroup_SideBarItem_'+this.props.name}
                    type={'module'}
                    name={this.props.name}
                    onClick={(curr_name) => this.props.onClick(curr_name)}/>
            </div>
        }
    }
}

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


        for (const [index, name] of this.props.state_values.all_modules.entries()) {
            rendered_items.push(
                <SideBarGroup
                    name={name}
                    key={'module_'+name}
                    current_module_state={this.props.state_values.all_module_states[index]}
                    state_values={this.props.state_values}
                    updating_methods={this.props.updating_methods}
                    onClick={(curr_name) => {
                        this.props.updating_methods.update_current_module_name(curr_name);
                        this.props.updating_methods.update_current_module_state(this.props.state_values.all_modules.indexOf(curr_name), curr_name);
                    }}
                />
            )
        }

        return <nav className={'SideBar_navigation'}><ul> {rendered_items} </ul></nav>
    }
};