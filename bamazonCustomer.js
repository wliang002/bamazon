var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table3');
var emoji = require('node-emoji');
var colors = require('colors');
var sku_len = 0;

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'nodeUser',
    password: '',
    database: 'bamazon'
})

connection.connect(function (err) {
    if (err) throw err;
    console.log('Connected as id ' + connection.threadId);
    display();
    setTimeout(shop, 2000);

    
    
})

function end(){
    connection.end();
}

function display() {
    connection.query('SELECT * FROM products', function (err, res) {
        if (err) throw err;
        sku_len = res.length;
        var keys = Object.keys(res[0]);
        var col_name = [];
        keys.forEach(ele => {
            col_name.push(colors.bold(colors.magenta(ele)))
        })

        var table = new Table({ head: [], border: [] });

        var icon = emoji.get('mermaid');
        var title = icon + icon + icon + colors.bold(colors.rainbow('  Shop at Bamazon! ')) + icon + icon + icon;
        table.push(
            [{ colSpan: 5, hAlign: 'center', content: title }],
            col_name
        )

        res.forEach(item => {
            table.push(Object.values(item))
        });

        console.log(table.toString());
    })


}


function shop() {
    connection.query('SELECT * FROM products', function (err, products) {
        if (err) throw err;
        var num_products = products.length;
        inquirer.prompt({
            type: 'number',
            name: 'sku',
            message: 'Please enter the SKU of the product you want to purchase: ',
            validate: function (value) {
                if (value < num_products + 1 && value > 0) {
                    return true;
                } else {
                    return 'Please enter a valid sku';
                }
            }
        })
            .then(function (answer) {
                var sku_chose = answer.sku;
                connection.query('SELECT * FROM products WHERE sku = ?', [sku_chose], function (err, row) {
                    if (err) throw err;
                    var stock = row[0].stock_quantity;
                    var price = row[0].price;
                    var item = row[0].product_name;
                    if (stock == 0){
                        console.log(`OUT OF STOCK!`)
                        shop();
                    } else {shopAmount(sku_chose,item, stock, price)}
                    
                })

            })

    })

}

function shopAmount(sku_chose, item, stock, price) {
    inquirer.prompt({
        type: 'number',
        name: 'quantity',
        message: 'Enter the number of the product you wish to buy: ',
        validate: function (value) {
            if (value > 0 && value < stock + 1) {
                return true;
            } if (value > stock) {
                return 'Insufficient quantity, come back when we restock';
            } else {
                return 'Please enter a valid quantity';
            }
        }
    })
        .then(function (answer) {
            var amount = answer.quantity;
            var quan = stock - amount;
            var total = price * amount;
            
            // console.log(`###########################`)
            // console.log(`Your totoal is: $${total}`)
            // console.log(`###########################`)
           // additional_purchase(item, amount, price, total);
            update_inventory(sku_chose, quan,item, amount, price, total);
        
            
        })
}


function additional_purchase(item, amount, price, total) {
    inquirer.prompt({
        type: 'list',
        name: 'answer',
        message: 'Would you like to buy more products?',
        choices: ['Shop more', 'Check out']
    })
        .then(function (ans) {
            switch (ans.answer) {
                case 'Shop more':
                    shop();
                    break;
                case 'Check out':
                    checkout(item, amount, price, total);                
                    break;
                default:
                    console.log('something went wrong')
                    break;
            }
        })
}

function checkout(item, amount, price, total){
    console.log(`###########################
    `)
    console.log(`Your item: ${item}`);
    console.log(`Price: $${price}`);
    console.log(`Subtotal (${amount} items): $${total}
  
    `)
    console.log(`Thank you for shopping with Bamazon!`)
    console.log(`............ Goodbye ............ `)
    console.log(`###########################`)
    setTimeout(end,5000)
}

function update_inventory(sku, quan,item, amount, price, total) {
    connection.query('UPDATE products SET ? WHERE ?',
        [{
            stock_quantity: quan
        },
        {
            sku: sku

        }],
        function (err, res) {
            if (err) throw err;
           // display();
        })
        checkout(item, amount, price, total) 
}
