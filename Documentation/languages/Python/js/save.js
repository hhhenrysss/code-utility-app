const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const SqliteInterface = require(path.join(process.cwd(), 'Documentation/js/utils/sqlite_interface.js')).SqliteInterface;
const minifier = require('html-minifier').minify;
const curr_dir = path.join(process.cwd(), 'Documentation/languages/Python/3.7.0/library');
const db_dir = path.join(process.cwd(), 'Documentation/languages/Python/db/');


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

class Parser extends PythonDocSpecifications{

    constructor(db_path, file_name, data) {
        super();
        this.$ = cheerio.load(data);
        this.name = file_name;
        this.structure = {};
        this.db = new SqliteInterface(db_path);

        (function initialize_db() {
            let db_configs = Parser.db_configurations;
            db.delete_table(db_configs.specifications_table_name);
            db.delete_table(db_configs.modules_table_name);


            db.create_table(db_configs.modules_table_name, db_configs.modules_table_configuration);
            db.create_table(db_configs.specifications_table_name, db_configs.specifications_table_configuration, [
                `FOREIGN KEY(${db_configs.names.code_module_id}) REFERENCES ${db_configs.modules_table_name}(${db_configs.names.module_id})`,
                'ON DELETE CASCADE ON UPDATE NO ACTION'
            ], [
                'PRAGMA foreign_keys = ON;'
            ]);
        })();
    }

    save() {
        let db = this.db;
        let dl_array = this.dl_name_and_descriptions;
        const configs = Parser.db_configurations;
        db.insert(
            Parser.db_configurations.modules_table_name,
            {
                [configs.names.module_title]: this.module_name,
                [configs.names.module_description]: this.module_h1_description,
                [configs.names.module_document]: this.document_body,
                [configs.names.module_table_of_contents]: this.table_of_contents_list
            }
        );
        for (let obj of dl_array) {
            db.insert(
                Parser.db_configurations.specifications_table_name,
                {
                    [configs.names.code_code]: obj.code,
                    [configs.names.code_description]: obj.description,
                    [configs.names.code_type]: obj.type,
                    [configs.names.code_module_name]: this.module_name,
                    [configs.names.code_module_id]: `(SELECT id FROM ${Parser.db_configurations.modules_table_name} WHERE title=\'${this.module_name}\')`
                },
                [configs.names.code_module_id]
            )
        }
    }

    static get db_configurations() {
        const specifications_name = 'specifications';
        const modules_name = 'python3_7_0';
        const code_id = 'id',
            code_code = 'code',
            code_description = 'description',
            code_type = 'type',
            code_module_name = 'module',
            code_module_id = 'module_id';

        const specifications_table_configuration = {
            [code_id]: 'INTEGER PRIMARY KEY',
            [code_code]: 'TEXT',
            [code_description]: 'TEXT',
            [code_type]: 'VARCHAR',
            [code_module_name]: 'VARCHAR',
            [code_module_id]: 'INTEGER'
        };

        const module_id = 'id',
            module_title = 'title',
            module_description = 'description',
            module_document = 'document',
            module_table_of_contents = 'table_of_contents';

        const modules_table_configuration = {
            [module_id]: 'INTEGER PRIMARY KEY',
            [module_title]: 'VARCHAR',
            [module_description]: 'TEXT',
            [module_document]: 'TEXT',
            [module_table_of_contents]: 'TEXT'
        };

        return {
            specifications_table_name: specifications_name,
            modules_table_name: modules_name,
            specifications_table_configuration: specifications_table_configuration,
            modules_table_configuration: modules_table_configuration,
            names: {
                code_id,
                code_code,
                code_description,
                code_type,
                code_module_name,
                code_module_id,
                module_id,
                module_title,
                module_description,
                module_document,
                module_table_of_contents
            }
        };
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
                        return dd == null ? null : description.trim()
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
        // console.log(this.$('.sphinxsidebarwrapper').html())
        let max_ul_length = 0;
        let max_ul = null;
        let $ = this.$;
        $('.sphinxsidebarwrapper').find('ul').each(function (i, element) {
            if ($(element).html().length > max_ul_length && $(element).find('a.reference.internal').length > 0) {
                max_ul = $(element);
                max_ul_length = $(element).html().length;
            }
        });
        return max_ul == null ? null : max_ul.html()
    }

}

module.exports = {
    Parser: Parser,
    PythonDocSpecifications: PythonDocSpecifications,
    save: function () {
        fs.readdir(curr_dir, (dir_error, files) => {
            if (dir_error) throw dir_error;
            files.forEach((file_name) => {
                let file_path = path.join(curr_dir, file_name);
                fs.readFile(file_path, (file_error, data) => {
                    if (file_error) throw file_error;
                    let file_parser = new Parser(path.join(db_dir, '3_7_0.db'), file_name, minifier(data.toString(), {
                        collapseWhitespace: true,
                        removeEmptyAttributes: true,
                        removeEmptyElements: true
                    }));
                    file_parser.save()
                })
            })
        });
    }
};
