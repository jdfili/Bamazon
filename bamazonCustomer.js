//Requiring npm packages
var inquirer = require("inquirer");
var mysql = require("mysql");
var cTable = require("console.table");
//Creates a connection to the MYSql server
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Dw2cb25141414!@",
    database: "bamazon_db"
})
connection.connect(function (err) {
    if (err) throw err;
    afterConnection()
})
//Function that makes a SQL query that selects all data from the 'products' table, and then displays it to the user
function afterConnection() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        var valArr = []
        for (var i = 0; i < res.length; i++) {
            var newArr = [];
            newArr.push(res[i].item_id, res[i].product_name,res[i].price)
            valArr.push(newArr);
        };
        console.table(['ID','Item','Price'],valArr);
        marketPlace();
    })
};
// Function to recieve user input using the 'Inquirier' npm 
function marketPlace() {
    inquirer
        .prompt([
            {
                type: "input",
                name: "id",
                message: "Input the ID-number of the item you'd like to purchase"
            },
            {
                type: "input",
                name: "quantity",
                message: "How many would you like to purchase?"
            }
        ])
        .then(answers => {
            //After the answers are logged, a new Sql query is ran to select the specific data that is equal
            //to the ID provided by the user. If the item is in stock, the user is provided with a cost amount
            //and the table is updated to reflect the purchase made. If the amount the user wants to purchase is 
            //greater than what is in stock, they are told the item is out of stock, and no change is made to the database.
            connection.query("SELECT * FROM products WHERE item_id=?", [answers.id], function(err, res) {
                var cost = answers.quantity * res[0].price;
                var inventory = res[0].stock_quantity - answers.quantity;
                if (err) throw err;
                if (answers.quantity > res[0].stock_quantity) {
                    console.log("I'm sorry, I seem to be out of stock on that item, please purchase something else :(");
                    connection.end();
                }
                if (answers.quantity <= res[0].stock_quantity) {
                    connection.query("UPDATE products SET stock_quantity =?, product_sales =? WHERE item_id =?", [inventory, cost, answers.id], function(err, res) {
                        if (err) throw err;
                        console.log ("Your total cost is " + cost + " caps")
                        connection.end();
                    })
                }
            })
        });
};



