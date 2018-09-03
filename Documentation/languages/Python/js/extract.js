const path = require('path');
const SqliteInterface = require(path.join(process.cwd(), 'Documentation/js/utils/sqlite_interface.js')).SqliteInterface;
const save = require(path.join(process.cwd(), 'Documentation/languages/Python/js/save.js'));
const PythonDocSpecifications = save.PythonDocSpecifications;
const Parser = save.Parser;


class Receiver extends PythonDocSpecifications {
    // all methods return Promises
    constructor(db_path) {
        super();
        this.db = new SqliteInterface(db_path);
        this.db_configs = Parser.db_configurations;
    }

    get module() {
        const db_configs = this.db_configs;
        let db = this.db;
        return {
            get_all_module_names: function get_all_module_names() {
                return db.query(db_configs.names.module_title, db_configs.modules_table_name, undefined, {[db_configs.names.module_title]: 'ASC'});
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
            get_module_row: function get_module_document(module_title, select, order_by_select) {
                if (module_title == null) {
                    throw TypeError('module title must be specified')
                }
                return db.query(
                    select,
                    db_configs.modules_table_name,
                    {key: db_configs.names.module_title, value: module_title},
                    order_by_select == null ? order_by_select : {[order_by_select]: 'ASC'}
                )
            }
        }
    }

    get code() {
        let db = this.db;
        const db_configs = this.db_configs;
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
            get_code_row: function get_code_code(string, select, order_by_select) {
              if (!isNaN(string)) {
                  return db.query(
                      select,
                      db_configs.specifications_table_name,
                      {key: db_configs.names.code_id, value: string},
                      order_by_select == null ? order_by_select : {[order_by_select]: 'ASC'}
                  )
              }
              else {
                  return db.query(
                      select,
                      db_configs.specifications_table_name,
                      {key: db_configs.names.code_module_name, value: string},
                      order_by_select == null ? order_by_select : {[order_by_select]: 'ASC'}
                  )
              }
            },
            get_code_by_code(code, select, order_by_select) {
                return db.query(
                    select,
                    db_configs.specifications_table_name,
                    {key: db_configs.names.code_code, value: code},
                    order_by_select == null ? order_by_select : {[order_by_select]: 'ASC'}
                )
            }
        }
    }
}


function extract() {
    return new Receiver(path.join(process.cwd(), 'Documentation/languages/Python/db/3_7_0.db'));
}

module.exports.extract = extract;


