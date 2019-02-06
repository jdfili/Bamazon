//Requiring npm packages
var inquirer = require("inquirer");
var mysql = require("mysql");
var cTable = require("console.table");
//Creates connection to the MYSql server
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Dw2cb25141414!@",
    database: "bamazon_db"
})

//Function that prompts the user to select which action they would like to take
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
            //Once the answer is logged, the users choice is then passed through a new function, 
            //and a connection is made to the SQL server
            var option = answers.option;
            connection.connect(function (err) {
                if (err) throw err;
                action(option);
            })
        })
};
//Switch statement that takes in user-input and then runs the appropriate function
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
// Function that lists all the items currently in the database
function listItems() {

    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        var valArr = []
        for (var i = 0; i < res.length; i++) {
            var newArr = [];
            newArr.push(res[i].item_id, res[i].product_name,res[i].price,res[i].stock_quantity);
            valArr.push(newArr);
        };
        console.table(['ID','Item','Price','Quantity'],valArr);
        connection.end();
    })
};
// Function that only displays items that have a stock-quantity of less than 5. 
function lowItems() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        var valArr = []
        for (var i = 0; i < res.length; i++) {
            if (res[i].stock_quantity < 5) {
                var newArr = [];
                newArr.push(res[i].item_id, res[i].product_name,res[i].price,res[i].stock_quantity);
                valArr.push(newArr);
            };
        };
        console.table(['ID','Item','Price','Quantity'],valArr);
        connection.end();
    })
};
//Function that resupplies inventory into the database
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
                    console.log("Your transaction was accepted! " + answers.quantity + " items have been added to the inventory")
                    connection.end();
                })
            })
        });
};
//Function that creates a new product based on the user-input provided. The new product is then inserted into the database.
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
                choices: ["Food", "Medicine", "Armor", "Weapons", "Misc"]
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
                console.log("Your transaction was accepted! " + answers.product_name + " has been added to the " + answers.department_name + " department");
                connection.end();
            });
        })
};
menu();