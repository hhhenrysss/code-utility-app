const path = require('path');
const SqliteInterface = require(path.join(process.cwd(), 'Documentation/js/utils/sqlite_interface.js')).SqliteInterface;
const save = require(path.join(process.cwd(), 'Documentation/languages/Python/js/save.js'));
const PythonDocSpecifications = save.PythonDocSpecifications;
const Parser = save.Parser;


class Receiver extends PythonDocSpecifications {
    constructor(db_path) {
        super();
        this.db = new SqliteInterface(db_path);
    }

    get module() {
        const db_configs = Parser.db_configurations;
        let db = this.db;
        return {
            get_all_module_names: function get_all_module_names() {
                return db.query(db_configs.names.module_title, db_configs.modules_table_name);
            },
            get_module_description: function get_module_description(module_title) {
                if (module_title == null) {
                    throw TypeError('module title must be specified')
                }
                return db.query(
                    db_configs.names.module_description,
                    db_configs.modules_table_name,
                    {key: db_configs.names.module_title, value: module_title}
                )
            },
            get_module_document: function get_module_document(module_title) {
                if (module_title == null) {
                    throw TypeError('module title must be specified')
                }
                return db.query(
                    db_configs.names.module_document,
                    db_configs.modules_table_name,
                    {key: db_configs.names.module_title, value: module_title}
                )
            },
            get_module_table_of_contents: function get_module_table_of_contents(module_title) {
                if (module_title == null) {
                    throw TypeError('module title must be specified')
                }
                return db.query(
                    db_configs.names.module_table_of_contents,
                    db_configs.modules_table_name,
                    {key: db_configs.names.module_title, value: module_title}
                )
            }
        }
    }

    get code() {
        let db = this.db;
        let db_configs = Parser.db_configurations;
        return {
            get_all_code_ids: function get_all_code_ids(module_title) {
                if (module_title == null) {
                    return db.query(
                        db_configs.names.code_id,
                        db_configs.specifications_table_name
                    )
                }
                else {
                    return db.query(
                        db_configs.names.code_id,
                        db_configs.specifications_table_name,
                        {key: db_configs.names.code_module_name, value: module_title}
                    )
                }
            },
            get_code_description: function get_code_description(code_id) {
                if (code_id == null) {
                    throw TypeError('code id must be specified')
                }
                return db.query(
                    db_configs.names.code_description,
                    db_configs.specifications_table_name,
                    {key: db_configs.names.code_id, value: code_id}
                )
            }
        }
    }
}


let temp = new Receiver(path.join(process.cwd(), 'Documentation/languages/Python/db/3_7_0.db'));
console.log(temp.module.get_all_module_names());