const sqlite3 = require('sqlite3').verbose();

// todo: use a separate module for this

class SqliteInterface {
    constructor(path, configurations) {
        this.db = new sqlite3.Database(path);
        this.configurations = configurations == null ? null : configurations;
        this.db.run('PRAGMA foreign_keys = ON;');
    }

    delete_table(table_name) {
        let sql = `DROP TABLE IF EXISTS ${table_name};`;
        this.db.run(sql, undefined, function (error) {
            if (error) {
                throw error;
            }
        })
    }

    generate_table_columns(obj, array, line_separator) {
        let delimiter = line_separator === undefined ? ',\n' : line_separator;
        let result = Object.entries(obj).reduce(function (string, key_value) {
            const [key, value] = key_value;
            let prev = (string === '') ? '' : string + delimiter;
            return  prev + key + ' ' + value;
        }, '');

        if (array != null) {
            for (let i = 0; i < array.length; i += 1) {
                let item = '\n' + array[i];
                result += i === 0 ? ',' + item : item;
            }
        }

        return result
    }

    create_table(table_name, specification_obj, configration_array, db_configuration_array) {
        let specifications = this.generate_table_columns(specification_obj, configration_array);
        this.db.run(`CREATE TABLE IF NOT EXISTS ${table_name} ( ${specifications} );`);
        if (db_configuration_array != null) {
            for (let item of db_configuration_array) {
                let temp = item.endsWith(';') ? item : item + ';';
                this.db.run(temp)
            }
        }
    }

    insert(table_name, obj, sql_instruction_keys) {
        let columns = [];
        let values = [];
        let special_values = [];
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (sql_instruction_keys != null && sql_instruction_keys.indexOf(key) !== -1 ) {
                    special_values.push(obj[key]);
                }
                columns.push(key);
                values.push(obj[key]);
            }
        }
        if (columns.length !== values.length) {
            throw TypeError('columns and values must be of the same length');
        }

        let column_string = columns.join(',');
        let value_placeholders = values.map(item => {
            if (sql_instruction_keys != null && special_values.indexOf(item) !== -1) {
                return item;
            }
            else {
                return '?'
            }
        }).join(',');

        let actual_values = values.filter(element => special_values.indexOf(element) === -1);


        this.db.run(`INSERT INTO ${table_name} (${column_string}) VALUES (${value_placeholders});`, actual_values, function (error) {
            if (error) {
                throw error;
            }
        })
    }

    query(select, from, where, order_by) {

        // todo: query is too simple and inefficient
        return new Promise((resolve, reject) => {
            let rows = [];

            let config_dict = {};
            config_dict.SELECT = Array.isArray(select) ? select.join(', ') : select;
            config_dict.FROM = from;
            if (where != null) {
                config_dict.WHERE = where.key + '=' + `"${where.value}"`;
            }
            if (order_by != null) {
                config_dict['ORDER BY'] = Object.entries(order_by).reduce((acc, item, index) => {
                    const [key, value] = item;
                    let string = key + ' ' + value;
                    return index === 0 ? string : acc+', '+string
                }, '');
            }

            let sql = this.generate_table_columns(config_dict, null, '\n');
            this.db.each(sql + ';', undefined, (error, row) => {
                if (error) {
                    console.log(error);
                }
                rows.push(row);
            }, (error, n) => {
                if (error) {
                    console.log(error);
                }
                else {
                    resolve(rows)
                }
            });
        });
    }
}


module.exports.SqliteInterface = SqliteInterface;