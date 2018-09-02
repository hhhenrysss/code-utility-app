const React = require('react');
const extract = require(path.join(node_path, `Documentation/languages/${redirect.name}/js/extract.js`)).extract;
const receiver = extract();
const db_configs = receiver.db_configs;

class SideBarItemIcons extends React.Component {
    render() {
        return <em className={'SideBarItemIcons'}> {this.props.type} </em>
    }
}

class SideBarItemContents extends React.Component {
    constructor(props) {
        super(props);
        this.status = ['dropdown_header', 'dropdown_item']
    }

    // todo: differentiate two scenarios to better add css classes
    render() {
        if (this.props.status === 'dropdown_header' && this.props.css_related != null) {
            return <strong
                className={'SideBarItemContents'}
                aria-expanded={`${this.props.css_related.aria_expanded}`}
                data-toggle={"collapse"}
                onClick={() => {
                    this.props.onClick(this.props.name)
                }}>
                <a className={'actual_link'} href={'#' + this.props.css_related.children_id}> {this.props.name} </a>
            </strong>
        }
        else {
            return <strong
                className={'SideBarItemContents'}
                aria-expanded={"false"}
                onClick={() => {
                    this.props.onClick(this.props.name)
                }}>
                <a className={'simulate_link'}> {this.props.name} </a>
            </strong>
        }
    }
}

class SideBarItem extends React.Component {
    render() {
        return <li className={'SideBarItem'}>
            <SideBarItemIcons
                key={'icon_' + this.props.name}
                name={this.props.name}
                type={this.props.type}/>
            <SideBarItemContents
                key={'content_' + this.props.name}
                name={this.props.name}
                status={this.props.status}
                css_related={this.props.css_related}
                onClick={(curr_name) => this.props.onClick(curr_name)}/>
        </li>

    }
}

class SideBarSubGroup extends React.PureComponent {
    componentDidMount() {
        const curr_name = this.props.name;
        receiver.code.get_code_row(curr_name, [
            db_configs.names.code_code,
            db_configs.names.code_type
        ], db_configs.names.code_type)
            .then((code_array) => {
                this.props.updating_methods.update_current_displayed_functions({[curr_name]: code_array});
            })
            .catch((error) => {
                throw error;
            });
    }

    render() {
        let array_of_sub_lists = [];
        for (let item of this.props.state_values.current_displayed_functions) {
            if (item.hasOwnProperty(this.props.name)) {
                for (const obj of item[this.props.name]) {
                    array_of_sub_lists.push(
                        <SideBarItem
                            type={obj.type}
                            name={obj.code}
                            status={'dropdown_item'}
                            key={'function_' + obj.code}
                            onClick={() => {
                                receiver.code.get_code_row(obj.code, [
                                    db_configs.names.code_description
                                ])
                                    .then((description) => {
                                        this.props.updating_methods.update_current_active_function(description);
                                    })
                                    .catch((error) => {
                                        throw error;
                                    })
                                }
                            }
                        />
                    )
                }
                break;
            }
        }
        if (array_of_sub_lists.length === 0) {
            return null;
        }
        return <ul id={this.props.css_related.children_id} className={'SideBarSubGroupList collapse'}>
            {array_of_sub_lists}
        </ul>
    }
}

class SideBarGroup extends React.PureComponent {

    render() {
        if (this.props.current_module_state === true) {
            let children_id = 'children_id_' + this.props.name;
            return <div
                className={'SideBarSubGroup'}
                key={'SideBarSubGroup_div_' + this.props.name}>
                <SideBarItem
                    key={'SideBarSubGroup_SideBarItem_' + this.props.name}
                    type={'module'}
                    status={'dropdown_header'}
                    name={this.props.name}
                    css_related={(() => {
                        return {
                            children_id: children_id,
                            aria_expanded: true
                        }
                    })()}
                    onClick={(curr_name) => this.props.onClick(curr_name)}/>
                <SideBarSubGroup
                    key={'SideBarSubGroup_' + this.props.name}
                    name={this.props.name}
                    css_related={(() => {
                        return {
                            children_id: children_id
                        }
                    })()}
                    state_values={this.props.state_values}
                    updating_methods={this.props.updating_methods}/>
            </div>
        }
        else {
            return <div
                key={'SideBarGroup_div_' + this.props.name}>
                <SideBarItem
                    key={'SideBarGroup_SideBarItem_' + this.props.name}
                    type={'module'}
                    status={'dropdown_header'}
                    name={this.props.name}
                    onClick={(curr_name) => this.props.onClick(curr_name)}/>
            </div>
        }
    }
}

module.exports = {
    SideBar: class SideBar extends React.Component {

        constructor(props) {
            super(props);
        }

        render() {
            // todo: finish this drop down list
            let rendered_items = [];
            rendered_items.push(
                <div key={'SideBar_div'} className={'SideBar_navigation_header'}> <h2>Documentation</h2> </div>
            );


            for (const [index, name] of this.props.state_values.all_modules.entries()) {
                rendered_items.push(
                    <SideBarGroup
                        name={name}
                        key={'module_' + name}
                        current_module_state={this.props.state_values.all_module_states[index]}
                        state_values={this.props.state_values}
                        updating_methods={this.props.updating_methods}
                        onClick={(curr_name) => {
                            this.props.updating_methods.update_current_module_name(curr_name);
                            this.props.updating_methods.update_current_module_state(this.props.state_values.all_modules.indexOf(curr_name), curr_name);
                            if (!this.props.state_values.all_module_states[index]) {
                                receiver.module.get_module_row(curr_name, [
                                    db_configs.names.module_document,
                                    db_configs.names.module_description
                                ])
                                    .then((doc) => {
                                        this.props.updating_methods.update_current_content(doc[0])
                                    })
                                    .catch((error) => {
                                        throw error;
                                    })
                            }
                        }}
                    />
                )
            }

            return <nav
                className={this.props.state_values.is_SideBar_active ? 'SideBar_navigation' : 'SideBar_navigation active'}
                id={"sidebar"}>
                <ul> {rendered_items} </ul>
            </nav>
        }
    },
    SideBarControlButton: class SideBarControlButton extends React.Component {
        render() {
            return <div id="content">
                <nav className={"navbar navbar-expand-lg navbar-light bg-light"}>
                    <div className={"container-fluid"}>
                        <button type={"button"} id={"sidebarCollapse"} className={"btn btn-info"}
                                onClick={this.props.update_SideBar_states}>
                            <em className={"fas fa-align-left"}> </em>
                            <span>Toggle Sidebar</span>
                        </button>
                    </div>
                </nav>
            </div>
        }
    }
};