const React = require('react');
const extract = require(path.join(node_path, `Documentation/languages/${redirect.name}/js/extract.js`)).extract;
const receiver = extract();
const sanitizeHtml = require('sanitize-html');

module.exports = class Article extends React.Component {
    sanitize_html(string) {
        return sanitizeHtml(string, {
            allowedTags: [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
                'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
                'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre'],
            allowedAttributes: {
                a: ['name', 'target' ]
            }
        })
    }
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
            return <article dangerouslySetInnerHTML={{__html: this.sanitize_html(this.decode_html(configs.current_content.document))}}/>
        }
        else {
            throw "current_content and current_active_function, one of them must be specified"
        }
    }
};