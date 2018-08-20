const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const SqliteInterface = require(path.join(process.cwd(), 'Documentation/js/utils/sqlite_interface.js')).SqliteInterface;
const minifier = require('html-minifier').minify;
const curr_dir = path.join(process.cwd(), 'Documentation/languages/Python/3.7.0/library');

const db_dir = path.join(process.cwd(), 'Documentation/languages/Python/db/');
// let db = new sqlite3.Database(path.join(db_dir, '3_7_0.db'));
let db = new SqliteInterface(path.join(db_dir, '3_7_0.db'));

let db_configurations = (function initialize_db() {
    const specifications_name = 'specifications';
    const modules_name = 'python3_7_0';
    const specifications_table_configuration = {
        id: 'INTEGER PRIMARY KEY',
        code: 'TEXT',
        description: 'TEXT',
        type: 'VARCHAR',
        module: 'VARCHAR'
    };
    const modules_table_configuration = {
        id: 'INTEGER PRIMARY KEY',
        title: 'VARCHAR',
        description: 'TEXT',
        document: 'TEXT',
        table_of_contents: 'TEXT',
        specification_id: 'INTEGER'
    };

    let db_configurations = {
        specifications_table_name: specifications_name,
        modules_table_name: modules_name,
        specifications_table_configuration: specifications_table_configuration,
        modules_table_configuration: modules_table_configuration
    };

    db.create_table(specifications_name, specifications_table_configuration);
    db.create_table(modules_name, modules_table_configuration, [
        `FOREIGN KEY(specification_id) REFERENCES ${specifications_name}(id)`,
        'ON DELETE CASCADE ON UPDATE NO ACTION'
    ]);

    db.configurations = db_configurations;

    return db_configurations
})();

class SyntacticLabels {
    constructor(name, description) {
        this.name = name == null ? null : name;
        this.description = description == null ? null : description;
    }
}

class PythonDocSpecifications {
    static generate_label(name, description) {
        return new SyntacticLabels(name, description)
    }

    get div_classes() {
        let l = PythonDocSpecifications.generate_label;
        return [
            l('bodywrapper'),
            l('section'),
            l('highlight-python3 notranslate'),
            l('deprecated'),
            l('admonition seealso'),
            l('admonition note'),
            l('highlight-pycon notranslate'),
            l('versionadded'),
            l('versionchanged'),
            l('deprecated-removed'),
            l('highlight-shell-session notranslate'),
            l('admonition warning'),
            l('highlight-python notranslate'),
            l('highlight-none notranslate'),
            l('highlight-sh notranslate'),
            l('impl-detail compound'),
            l('line-block'),
            l('highlight-yaml notranslate'),
            l('highlight-ini notranslate'),
            l('highlight-xml notranslate'),
            l('highlight-bash notranslate'),
            l('highlight-text notranslate'),
            l('sidebar')
        ]
    }

    get dl_classes() {
        let l = PythonDocSpecifications.generate_label;
        return [
            l('function'),
            l('exception'),
            l('class'),
            l('data'),
            l('method'),
            l('attribute'),
            l('docutils'),
            l('cmdoption'),
            l('describe'),
            l('pdbcommand'),
            l('2to3fixer'),
            l('classmethod'),
            l('opcode'),
            l('staticmethod')
        ]
    }
}

class parser extends PythonDocSpecifications{

    constructor(file_name, data) {
        super();
        this.$ = cheerio.load(data);
        this.name = file_name;
        this.structure = {}
    }

    save() {
        let dl_array = this.dl_name_and_descriptions;
        for (let obj of dl_array) {
            db.insert(
                db_configurations.specifications_table_name,
                {
                    code: obj.code,
                    description: obj.description,
                    type: obj.type,
                    module: this.module_name
                }
            )
        }
        db.insert(
            db_configurations.modules_table_name,
            {
                title: this.module_name,
                description: this.module_h1_description,
                document: this.document_body,
                table_of_contents: this.table_of_contents_list,
                specification_id: `(SELECT id FROM ${db_configurations.specifications_table_name} WHERE module='${this.module_name}')`
            }
        )
    }

    get module_name() {
        return this.name.replace('.html', '').trim()
    }

    get module_h1_description() {
        let raw = this.$('h1').text().replace(this.module_name, '').trim();
        let clean_number = raw.substring(raw.indexOf('. ') + 1).trim();
        let prefixes = ['—', ':', 's:'];
        for (let i = 0; i < prefixes.length; i += 1) {
            if (clean_number.startsWith(prefixes[i])) {
                clean_number = clean_number.substring(clean_number.indexOf(prefixes[i]) + 1).trim();
            }
        }
        return clean_number
    }

    get dl_name_and_descriptions() {
        let $ = this.$;
        let code_array = [];

        $('dl').each(function (index, element) {
            let type = $(element).attr('class');
            const utils = {
                get_code: function get_code($dt) {
                    let code_string = '';
                    $dt.children('code').each(function (i, elem) {
                        if ($(elem).attr('class').indexOf('docutils literal notranslate') === -1) {
                            code_string += $(elem).text()
                        }
                    });
                    return code_string
                },
                valid_clean_code: function valid_clean_code(code) {
                    let code_exist_flag = false;
                    for (let element of code_array) {
                        if (element['code'] === code) {
                            code_exist_flag = true;
                            break;
                        }
                    }
                    return code !== '' && !code_exist_flag
                },
                get_description: function get_description($dt) {
                    let $next = $dt.next();
                    let next_name = $next._root['0'].name;
                    let description = '';
                    if (next_name === 'dd') {
                        let dd = $dt.nextUntil('dt', 'dd');
                        dd.each((i, elem) => {
                            description += $(elem).html()
                        });
                        return description === '' ? null : description
                    }
                    else if (next_name === 'dt') {
                        let dd = $dt.nextUntil('dl', 'dd');
                        dd.each((i, elem) => {
                            description += $(elem).html()
                        });
                        return dd == null ? null : dd.trim()
                    }
                    else {
                        return null
                    }
                }
            };

            $(element).children('dt').each(function (i, dt) {
                let temp_cleaned_code = utils.get_code($(dt));
                let temp_cleaned_description = utils.get_description($(dt));
                if (utils.valid_clean_code(temp_cleaned_code)) {
                    code_array.push({
                        code: temp_cleaned_code,
                        description: temp_cleaned_description,
                        type: type
                    })
                }
            });
        });

        return code_array
    }

    get document_body() {
        return this.$('.bodywrapper').html()
    }

    get table_of_contents_list() {
        return this.$('.sphinxsidebarwrapper').children('ul').first().html()
    }

}

fs.readdir(curr_dir, (dir_error, files) => {
    if (dir_error) throw dir_error;
    files.forEach((file_name) => {
        let file_path = path.join(curr_dir, file_name);
        fs.readFile(file_path, (file_error, data) => {
            if (file_error) throw file_error;
            let file_parser = new parser(file_name, minifier(data.toString(), {
                collapseWhitespace: true,
                removeEmptyAttributes: true,
                removeEmptyElements: true
            }));
            file_parser.save()
        })
    })
});
