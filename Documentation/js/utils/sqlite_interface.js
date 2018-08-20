const sqlite3 = require('sqlite3').verbose();

class SqliteInterface {
    constructor(path, configurations) {
        this.db = new sqlite3.Database(path);
        this.configurations = configurations == null ? null : configurations
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

    create_table(table_name, specification_obj, configration_array) {
        let specifications = this.generate_table_columns(specification_obj, configration_array);
        this.db.run(`CREATE TABLE IF NOT EXISTS ${table_name} ( ${specifications} )`);
    }

    insert(table_name, obj) {
        let columns = [];
        let values = [];
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                columns.push(key);
                values.push(obj[key]);
            }
        }
        if (columns.length !== values.length) {
            throw TypeError('columns and values must be of the same length');
        }
        let column_string = columns.reduce((string, item) => {
            return string === '' ? string + item : string + ',' + item
        }, '');

        let value_string = values.reduce((string, item) => {
            return string === '' ? string + item : string + ',' + item
        }, '');
        this.db.run(`INSERT INTO ${table_name}(${column_string}) VALUES(?)`, [value_string], function (error) {
            if (error) {
                return console.log(error.message);
            }
        })
    }

    query(select, from, where, order_by) {
        let sql = this.generate_table_columns(Object.entries({
            SELECT: select.join(', '),
            FROM: from,
            WHERE: where + '= ?',
            'ORDER BY': order_by
        }), null, '\n');
        this.db.each(sql, [where], function (error, row) {
            if (error) {
                throw error;
            }
            console.log(row.code);
        })
    }
}


module.exports.SqliteInterface = SqliteInterface;