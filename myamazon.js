//Bamazon (inspired by) amazon
//Created by: Sangeetha K.
//mysql,express,inquirer are used.

var mysql = require('mysql');

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Mykutties2",
  database: "dubootcamp"
});

var gl_catalog = [];
var gl_totalorder = [];
var gl_amount = 0;
//Main Program
establishConnection();

function establishConnection() {
  connection.connect(function (err) {
    if (err) throw err;

    //console.log('Connected :'+connection.threadId);
    displayProducts();
  }); // Database Connection establishment
}

function displayProducts() {
  connection.query("select * from master_product where quantity > 0", function (error, results) {
    if (error) throw ("Error Encountered!!", error);
    //console.log('The length', results.length);
    console.log("Catalogue :", JSON.stringify(results, null, 2));
    for (var i = 0; i < results.length; i++) {
      let record = {
        "product_id": results[i].product_id,
        "product_name": results[i].product_name,
        "price": results[i].price,
        "quantity": results[i].quantity
      }
      gl_catalog.push(record);
    }

    //console.log('gl catalog',gl_catalog);
    confirmOrder('\nReady to Order?..');
  });
}

function confirmOrder(vtext) {
  var getit = require('inquirer');
  getit.prompt([
    {
      message: vtext,
      type: 'confirm',
      name: 'ordercont'
    }
  ]).then(function (result, err) {
    if (err) throw console.log('The Error : ', err);
    if (result.ordercont) {
      placeOrder();
    }
    else {
      connection.end;
      displaytotalorder();
    }
  });

}


function placeOrder() {
  var getorder = require('inquirer');
  getorder.prompt([
    {
      type: "input",
      message: "Enter Product ID: ",
      name: 'pid'

    },
    {
      type: "input",
      message: "Enter Quantity: ",
      name: 'pqty',

    }
  ]).then(function (data, err) {
    {
      //for(var i = 0; i < gl_catalog.length; i++)
      var i = 0;
      var rec_updated = false;
      while (i < gl_catalog.length && !rec_updated) {
        var v1 = String(gl_catalog[i].product_id);
        if (v1 === data.pid) {
            if ((data.pqty) <= parseInt(gl_catalog[i].quantity)) {
              rec_updated = true;
              updateTables(data.pid, data.pqty, gl_catalog[i].quantity);
            }
            else {
              console.log("\nWe do not have that much in stock for this item!!!");
              confirmOrder('\nDo you like to order anything else');
            }
        }
        i++;
      }
    }

  });
}


function updateTables(prodid, prodqty, stock) {
  var updatedstock = stock - prodqty
  var v2 = prodid.trim();

 // console.log("Stock issue",stock,prodqty,updatedstock);
  // Update Database
  var query = connection.query("update master_product set ? where ?",
    [
      {
        quantity: updatedstock
      },
      {
        product_id: v2
      }

    ], function (err, res) {
      if (err) throw err;
      //console.log("res", res);
      var q1 = connection.query("insert into order_products(product_id,order_qunatity) values(?,?)",
        [
          prodid, prodqty
        ], function (err, res) {
          if (err) throw err;
          //console.log('Insertinto', res);
          
          for (var i = 0; i < gl_catalog.length; i++) {
           // console.log(gl_catalog[i].product_id,prodid,Number(prodid));
            if(gl_catalog[i].product_id === Number(prodid))
            {    gl_totalorder.push({
                  "ProductId: ": gl_catalog[i].product_id,
                  "Product Name: ": gl_catalog[i].product_name,
                  "Order quantity: ": prodqty,
                  "Unit Price": gl_catalog[i].price,
                  "Amount : ": (prodqty * gl_catalog[i].price)
                });
                gl_amount += (prodqty * gl_catalog[i].price);
              }
          } 
          confirmOrder('Order more items');       
          //updateCatalog(prodid, prodqty);
        });
    });
}

function updateCatalog(prodid, prodqty) {
  for (var i = 0; i < gl_catalog.length; i++) {
    //  console.log(gl_catalog[i]);

    var v1 = String(gl_catalog[i].product_id);
    var v3 = v1.trim();
    if (v3 === prodid) {
     
      gl_totalorder.push({
        "ProductId: ": gl_catalog[i].product_id,
        "Product Name: ": gl_catalog[i].product_name,
        "Order quantity: ": prodqty,
        "Unit Price": gl_catalog[i].price,
        "Amount : ": (prodqty * gl_catalog[i].price)
      });
      //gl_catalog[i].quantity = gl_catalog[i].quantity - prodqty;

    }
  }
  //console.log(gl_catalog);
  //console.log(gl_totalorder);
  confirmOrder('Order more items');

}

function displaytotalorder() {
  
  //console.log(gl_totalorder);
  

  if (gl_totalorder.length> 0) {
   
    console.log('\nYour Order details\n==================\n',gl_totalorder);
    console.log("Total Order: ", gl_amount);
    process.exit(0);
  }
  else {
    console.log('No Orders made !!!!');
    process.exit(0);
  }
  //return ;
}
