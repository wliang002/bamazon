var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'nodeUser',
    password: '',
    database: 'bamazon'
})

connection.connect(function(err){
    if(err) throw err;
    console.log('Connected as id '+ connection.threadId);
})