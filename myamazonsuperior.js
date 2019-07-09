//Bamazon Supervisor level
//Created by: Sangeetha Kp

var mysql = require('mysql');
var Inquirer = require('inquirer');

var connection = mysql.createConnection({
host: "localhost",
port:3306,
user: "root",
password:"",
database:"dubootcamp"
});

var gl_prodid = [];

startdb();
displaywhattodo();


function startdb()
{
    connection.connect(function(err)
    {
      if(err)throw err;
      //console.log('Connected :'+connection.threadId);
    }); // Database Connection established
}
/*
function productSales()
 {
   connection.query("select m.product_id,m.product_name,sum(order_qunatity)*(m.price) from master_product m,order_products o where m.product_id = o.product_id group by m.product_id",function(error,results)
    {
        if(error) throw("Error Encountered!!",error);
        //console.log('The length', results.length);
        console.log("Catalogue :",JSON.stringify(results,null,2));
        checksales();
        connection.end;
    });
 }
*/


function displayproduct()
{
  connection.query("select product_id,product_name from master_product",function(err,results)
  {
        if (err) throw err;
        //console.log("List of all Products");
          console.log("\n\nProduct Catalogue");
          console.log("-----------------------");
        for(var i =0; i < results.length; i++)
        {
          console.log('ID : ',results[i].product_id,'Description',results[i].product_name);
          gl_prodid.push(results[i].product_id) ;
        }

        var getit = require('inquirer');


         console.log('\n\nSales Report for a product');
         console.log("----------------------------");
         getit.prompt([
             {
               message: 'Enter Product ID',
               type: 'input',
               name: 'prodlist',
             }
           ]).then(function(data,err)
             {
                  //connection.query("select count(*) rcnt from master_product where product_id = ?",[data.inprodid],function(err,resp)
                  var foundit = false;
                  var input_2 = parseInt(data.prodlist.trim());
                  for(var i =0 ; i < gl_prodid.length ; i++)
                  {
                     if( gl_prodid[i] === input_2)
                     {
                       foundit = true;
                     } //end if
                  } //end for

                       if (foundit)
                       {
                          //console.log('when entry is a valid product id',input_2);
                         salereport(input_2);
                       }
                       else {
                         console.log("Invalid Product ID Please check the Product Catalogue");
                         displayproduct();
                       }

             });

     });
}

function allsalesreport()
{

  connection.query("select m.product_id,m.product_name,sum(order_qunatity) total_quantity,sum(order_qunatity)*(m.price) amount from master_product m,order_products o where m.product_id = o.product_id group by m.product_id;",function(error,results)
   {
       if(error) throw("Error Encountered!!",error);
       //console.log('The length', results.length);
       for(var i =0;i< results.length ; i++)
       {
           console.log("Product ID: ",results[i].product_id);
           console.log("Product Name: ",results[i].product_name);
           console.log("Total Quantity Sold:",results[i].total_quantity);
           console.log("Amount : ",results[i].amount);
       }
       //console.log("Catalogue :",JSON.stringify(results,null,2));
        displaywhattodo();
   });
}

function salereport(pid)
{
   var totalsales = 0;

    connection.query("select m.product_id,m.product_name,o.order_id,o.order_qunatity,o.order_qunatity * m.price amount from master_product m, order_products o where m.product_id = ? and m.product_id = o.product_id ;",[pid],function(err,qresult)
    {
       if (qresult.length > 0)
       {
          console.log(`Sales Report of ${qresult[0].product_id}   ${qresult[0].product_name}`);
          console.log('--------------------------------------------------------------------');
           for(var i = 0; i < qresult.length; i++)
           {

             console.log(`Order: ${qresult[i].order_id}   ${qresult[i].order_qunatity}   ${qresult[i].amount}`);
             totalsales = totalsales + qresult[i].amount ;

           }
           console.log(`Total Sale value of ${qresult[0].product_name} is ${totalsales}`);
           displaywhattodo();
       }
       else {
         console.log('There are no Sales for this product!!!');
         displaywhattodo();
       }
    });
}

function displaywhattodo()
{
        //var getit = require('inquirer');
        console.log("My Amazon - Supervisor role");
        Inquirer.prompt([
          {
            type:'list',
            name:'opt',
            choices:['All Products','Specific Product','Exit Application'],
            message:'Select an option'
          }
        ]).then(function(reply)
           {
             console.log('Cont',reply.opt);
             if(reply.opt === 'All Products' )
             {
               allsalesreport();
             }
             else if(reply.opt === 'Specific Product' ){
               displayproduct();
             }
             else if (reply.opt === 'Exit Application')
             {
               connection.end;
               console.log('See you next time!!');
               //process.exit(0);
             }
           });
           console.log("After inquire");
}
