const sql = require('mysql');
const fs = require('fs');
const logger = require('./logger.js');

const config = JSON.parse(fs.readFileSync(`${__dirname.split('utils')[0]}manifest.json`));

let pool = sql.createPool({
    host: config.sql.host,
    user: config.sql.user,
    password: config.sql.password,
    database: config.sql.database
});

let manager = {};

/**
 * Function to create all of the tables the database needs.
 * @param {Function} callback Send data back to executor
 */
manager.createTables = (callback) => {

    pool.query(`CREATE TABLE IF NOT EXISTS orders(cid TEXT, id TEXT)`, err => {

        if(err) return callback(err);
        
        logger.info("Orders table has been created.");

    });

}

/**
 * Function to drop a table from the database
 * @param {String} table Name of the table to drop 
 * @param {Function} callback Send data back to executor
 */
manager.deleteTable = (table, callback) => {

    pool.query("DROP TABLE " + table, err => {
        if(err) return callback(err);

        callback();

    });

}

/**
 * Function to populate our order column 
 * @param {String} cid Client id the order belongs to
 * @param {String} id ID of the order.
 * @param {Function} callback Send data back to executor
 */
manager.populateOrder = (cid, id, callback) => {

    pool.query(`INSERT INTO orders (cid, id) VALUES (?, ?)`, [cid, id], err => {

        if(err) return callback(err, "GX1");

        callback();

    });

}

/**
 * Function to get an order number's data
 * @param {String} cid Client id to query the order
 * @param {Function} callback Send data back to executor
 */
manager.getOrderNumber = (cid, callback) => {

    pool.query(`SELECT * FROM orders WHERE cid = ?`, [cid], (err, res) => {

        if(err) return callback("", err, "GO-4000-1C");

        // hand the res off to the executor to handle
        callback(res);

    });

}

/**
 * Function to update an order via client id
 * @param {Function} callback Send data back to executor 
 * @param {Integer} amount Amount to add to the data
 * @param {String} cid Client id of the user's order to update.
 */
manager.updateOrder = (callback, amount, cid) => {

    // first we're going to get the current order number
    manager.getOrderNumber(cid, (res, err) => {

        // place an exit code here to add to our log saving
        if(err) return callback("", err, "OU-4000-1C");

        // throw a null pointer
        if(res == null || !res) return callback("", "Refer to code.", "OU-4000-2C");

        // convert the result to an integer
        let converted = parseInt(res);

        // go ahead and update to our value we want
        let final = converted + amount;

        // execute the update
        pool.query(`UPDATE orders SET number = ? WHERE uuid = 1`, [final], err => {

            if(err) return callback("", err, "OU-4000-1C");

            callback();

        });

    });



}


module.exports = manager;