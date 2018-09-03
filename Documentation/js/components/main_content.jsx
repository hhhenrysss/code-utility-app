const React = require('react');
const extract = require(path.join(node_path, `Documentation/languages/${redirect.name}/js/extract.js`)).extract;
const receiver = extract();
const sanitizeHtml = require('sanitize-html');


const ArticleFuncName = (props) => {
    return <h1> {props.configs.current_active_function.func} </h1>
};

const ArticleFuncType = (props) => {
    return <p> {props.configs.current_active_function.type} </p>
};

const ArticleFuncModule = (props) => {
    return <p> {props.configs.current_module_name} </p>
};

const ArticleFuncDescription = (props) => {
    return <div className={'func_description'} dangerouslySetInnerHTML={{__html: Article.sanitize_html(Article.decode_html(props.configs.current_active_function.description))}}/>
};

class ArticleFuncList extends React.Component {
    render() {
        return [
            <ArticleFuncName key={'ArticleFuncList_title'} configs={this.props.configs}/>,
            <ul key={'ArticleFuncList_ul'}>
                <li>
                    <p>Type</p>
                    <ArticleFuncType configs={this.props.configs}/>
                </li>
                <li>
                    <p>Module</p>
                    <ArticleFuncModule configs={this.props.configs}/>
                </li>
                <li>
                    <p>Description</p>
                    <ArticleFuncDescription configs={this.props.configs}/>
                </li>
            </ul>
        ]
    }
}

module.exports = class Article extends React.Component {
    static sanitize_html(string) {
        return sanitizeHtml(string, {
            allowedTags: [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
                'nl', 'dl', 'dd', 'dt', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
                'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre'],
            allowedAttributes: {
                a: ['name', 'target' ],
                div: ['class']
            }
        })
    }
    static decode_html(string) {
        let text = document.createElement("textarea");
        text.innerHTML = string;
        return text.value;
    }
    render(){
        const configs = this.props.state_values;
        if (configs.current_active_function != null) {
            return <article id={'Article_generated'}>
                <ArticleFuncList configs={configs}/>
            </article>
        }
        else if (configs.current_content != null) {
            return <article id={'Article_extracted'} dangerouslySetInnerHTML={{__html: Article.sanitize_html(Article.decode_html(configs.current_content.document))}}/>
        }
        else {
            throw "current_content and current_active_function, one of them must be specified"
        }
    }
};