//Bamazon Manager level
//Created by: Sangeetha Kp

var mysql = require('mysql');

var connection = mysql.createConnection({
host: "localhost",
port:3306,
user: "root",
password:"Mykutties2",
database:"dubootcamp"
});

var gl_catalog = [];
var gl_totalorder = [];
console.log("\n=============================================================");
console.log("\nWelcome to Myamazon.com");
console.log("\n=============================================================");


enterChoice();

function getproducts()
{
    connection.connect(function(err)
    {
      if(err)throw err;

      //console.log('Connected :'+connection.threadId);
      displayProducts();
    }); // Database Connection establ
}



function enterChoice()
{
      var getit = require ('inquirer');
   
      getit.prompt([
        {
          message:"Menu options",
          type: 'rawlist',
          name: 'menu',
          choices:['View Products for Sale','View Low Inventory','Add to Inventory','Add New Product','Exit Application']
        }
      ]).then(function(data,err)
         {
                //console.log('data',data);
                if ( data.menu === 'View Products for Sale')
                {
                    displayCatalog()
                }
                else if ( data.menu === 'View Low Inventory')
                 {
                     displayInventory();
                }
                else if( data.menu === 'Add to Inventory')
                {
                       addInventory();
                }
                else if( data.menu === 'Add New Product')
                {
                 // console.log('option');
                  addProduct();
                }
                else if( data.menu === 'Exit Application')
                {
                  console.log('\nBye! See you soon!!!\n');
                  connection.end;
                  process.exit(0);
                }

         });
}

function displayCatalog()
{
    connection.query("select * from master_product where quantity > 0",function(error,results)
     {
         if(error) throw("Error Encountered!!",error);
         //console.log('The length', results.length);
         console.log("Catalogue :",JSON.stringify(results,null,2));
         enterChoice();
     });
}

function displayInventory()
{
      var getit = require ('inquirer');
      console.log("\n\nCheck Products less that entered quantity");
      console.log("---------------------------------------------------------------");
      getit.prompt([
        {
          message:'Enter Quantity : ',
          type: 'input',
          name: 'vqty'
        }
      ]).then(function(data,err)
        {
          console.log("\n=============================================\n");  
          console.log(`\nList of Products less than ${data.vqty}`);
            console.log("\n=============================================\n");
            connection.query("select * from master_product where quantity < ?",[data.vqty],function(error,results)
             {
                 if(error) throw("Error Encountered!!",error);
                 console.log("Catalogue :",JSON.stringify(results,null,2));
                 enterChoice();
             });
        });

}

function addInventory()
{
        var getit = require ('inquirer');
        console.log("\nAdd Inventory to Products");
        console.log("\n-----------------------------------------\n");
        getit.prompt([
          {
            message:'Enter Product ID : ',
            type: 'input',
            name: 'pid'
          },
          {
            message: "Enter quantity : ",
            type: 'input',
            name: 'pqty'
          }
        ]).then(function(data,err)
          {

              connection.query("update master_product set quantity = quantity + ? where product_id = ?",[data.pqty,data.pid],function(error,results)
               {
                   if(error) throw("Error Encountered!!",error);
                  // console.log("Catalogue :",JSON.stringify(results,null,2));
                    addmore('Add more Inventory',2);
               });
          });
}

function addProduct()
{
      var getit = require ('inquirer');
      console.log("\nAdd Products to Catalogue");
      console.log("-----------------------------------------");
      getit.prompt([
        {
          message:'Enter Product Name : ',
          type: 'input',
          name: 'pdesc'
        },
        {
          message: "Enter price : ",
          type: 'input',
          name:'pprice'
        },
        {
          message: "Enter quantity : ",
          type: 'input',
          name:'pqty'
        }
      ]).then(function(data,err)
        {
           connection.query("insert into master_product(product_name,price,quantity)values(?,?,?)",
           [data.pdesc,data.pprice,data.pqty],function(err,results)
           {
             if (err) throw err;
             console.log('Added New Product');
             addmore('Add more New Product',1);
           });

       });
}

function addmore(vtext,vch)
{
     var cont = require('inquirer');
     cont.prompt([
       {
         type:'confirm',
         message:vtext,
         name:'ans'
       }
     ]).then(function(data,err)
         {
           if (data.ans)
           {
             if(vch === 1)
             {
               addProduct();
             }
             else if(vch === 2)
             {
               addInventory();
             }
           }
           else {
             enterChoice();
           }
         });
}
