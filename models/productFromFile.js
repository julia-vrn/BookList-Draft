const fs = require('fs');
const path = require('path');
const filePath = path.join(path.dirname(require.main.filename), 'data', 'products.json');
const Cart = require('./cart');

//const products = [];

const getProductsFromFile = (cb) => {
    fs.readFile(filePath, (error, fileContent) =>{
        if(error){
            return cb([]);
        }

        cb(JSON.parse(fileContent));
    });
}

module.exports = class Product {
    constructor(id, title, url, price, description) {
        this.id = id;
        this.title = title;
        this.imageUrl = url;
        this.price = price;
        this.description = description;
    }

    save(){
        
        getProductsFromFile(products => {
            if(this.id){
            //update the existing product
            const existingProductIndex = products.findIndex(product => product.id === this.id);
            const updatedProducts = [...products]; //pull out existing products and store them in a new array
            updatedProducts[existingProductIndex] = this; //this is a current product
            fs.writeFile(filePath, JSON.stringify(updatedProducts), (error) =>{
                console.log(error);
            });
            } else {
                this.id = Math.random().toString();
                products.push(this);
                fs.writeFile(filePath, JSON.stringify(products), (error) =>{
                    console.log(error);
                });
            }

            
        });
        
    }

    static fetchAll(cb){
        getProductsFromFile(cb);
      
    };


    static findById(id, cb){
       getProductsFromFile(products => {
            //filter a product by its id
            const product = products.find(p => p.id === id);
            cb(product);
       });
    }

    static deleteById(id) {
        getProductsFromFile(products => {
            const product = products.find(product => product.id === id);
            const updatedProducts = products.filter(product => product.id !== id);
            fs.writeFile(filePath, JSON.stringify(updatedProducts), (error)=>{
                if(!error){
                    Cart.deleteProduct(product.id, product.price);
                }
            });
        });
    }

}