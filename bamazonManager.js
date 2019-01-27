var inquirer = require("inquirer");
var mysql = require("mysql");
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon_db"
})


function menu() {
    inquirer
        .prompt([
            {
                type: "list",
                name: "option",
                message: "Main Menu",
                choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
            }
        ])
        .then(answers => {
            var option = answers.option;
            connection.connect(function (err) {
                if (err) throw err;
                action(option);
            })
        })
};

function action(option) {
    switch (option) {
        case "View Products for Sale":
            listItems();
            break;
        case "View Low Inventory":
            lowItems();
            break;
        case "Add to Inventory":
            addItems();
            break;
        case "Add New Product":
            createProduct();

    }
};

function listItems() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log("\nID: " + res[i].item_id + "\nItem: " + res[i].product_name + "\nPrice: " + res[i].price + "\nQuantity: " + res[i].stock_quantity + "\n------------")
        };
        connection.end();
    })
};
function lowItems() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            if (res[i].stock_quantity < 5) {
                console.log("\nID: " + res[i].item_id + "\nItem: " + res[i].product_name + "\nPrice: " + res[i].price + "\nQuantity: " + res[i].stock_quantity + "\n------------")
            }
        };
        connection.end();
    })
};
function addItems() {
    inquirer
        .prompt([
            {
                type: "input",
                name: "id",
                message: "What is the ID-number of the item you want to restock?"
            },
            {
                type: "input",
                name: "quantity",
                message: "How much do you want to buy?"
            }
        ])
        .then(answers => {
            var id = answers.id;
            connection.query("SELECT * FROM products WHERE item_id =?", [id], function (err, res) {
                if (err) throw err;
                var inventory = parseFloat(answers.quantity) + res[0].stock_quantity;
                connection.query("UPDATE products SET stock_quantity =? WHERE item_id =?", [inventory, id], function (err, res) {
                    if (err) throw err;
                    connection.end();
                })
            })
        });
};

function createProduct() {
    inquirer
        .prompt([
            {
                type: "input",
                name: "product_name",
                message: "What is the name of the product?"
            },
            {
                type: "list",
                name: "department_name",
                message: "What department does this go in?",
                choices: ["Food", "Medicine", "Armor", "Weapons", "Other"]
            },
            {
                type: "input",
                name: "price",
                message: "What is the price?"
            },
            {
                type: "input",
                name: "stock_quantity",
                message: "How much is in stock?"
            },
        ])
        .then(answers => {
            connection.query("INSERT INTO products SET ?", answers, function (err, res) {
                if (err) throw err;
                connection.end();
            });
        })
};
menu();