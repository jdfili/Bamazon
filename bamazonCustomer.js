var inquirer = require("inquirer");
var mysql = require("mysql");


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon_db"
})
connection.connect(function (err) {
    if (err) throw err;
    afterConnection()
})

function afterConnection() {
    connection.query("SELECT * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log("\nID: " + res[i].item_id + "\nItem: " + res[i].product_name + "\nPrice: " + res[i].price + "\n------------")
        };
    })
    marketPlace();
};

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
            connection.query("SELECT * FROM products WHERE item_id=?", [answers.id], function(err, res) {
                var cost = answers.quantity * res[0].price;
                var inventory = res[0].stock_quantity - answers.quantity;
                if (err) throw err;
                if (answers.quantity > res[0].stock_quantity) {
                    console.log("I'm sorry, my lowly shop doesn't have enough of what you desire :(");
                    connection.end();
                }
                if (answers.quantity <= res[0].stock_quantity) {
                    connection.query("UPDATE products SET stock_quantity =? WHERE item_id =?", [inventory, answers.id], function(err, res) {
                        if (err) throw err;
                        console.log ("Your total cost is " + cost + " gold")
                        connection.end();
                    })
                }
            })
        });
};



