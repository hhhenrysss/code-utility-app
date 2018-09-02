const React = require('react');
const extract = require(path.join(node_path, `Documentation/languages/${redirect.name}/js/extract.js`)).extract;
const receiver = extract();

module.exports = class Article extends React.Component {
    decode_html(string) {
        let text = document.createElement("textarea");
        text.innerHTML = string;
        return text.value;
    }
    render(){
        const configs = this.props.state_values;
        if (configs.current_active_function != null) {
            console.log(configs.current_active_function)
            return <article>
                {configs.current_active_function}
            </article>
        }
        else if (configs.current_content != null) {
            return <article dangerouslySetInnerHTML={{__html: this.decode_html(configs.current_content.document)}}/>
        }
        else {
            throw "current_content and current_active_function, one of them must be specified"
        }
    }
};