const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
nunjucks.configure('views', {
    autoescape: true,
    express: app
});
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const MongoClient = require('mongodb').MongoClient;
const MONGO_URL = process.env.MONGOURL  || 'mongodb://localhost:27017/';

app.all('/', (req, res)=>{
  MongoClient.connect(MONGO_URL,{ useUnifiedTopology: true }, (err, db) => {
    const dbo = db.db("restaurante");
    dbo.collection("menu").find().toArray(function(err, data) {
      res.render('index.html',{data:data})
    });
  });
});

app.all('/categorias', (req, res)=>{
  MongoClient.connect(MONGO_URL,{ useUnifiedTopology: true }, (err, db) => {  
    const dbo = db.db("restaurante");
    dbo.collection("categorias").find().toArray(function(err, data) {
      res.render('categorias.html',{data:data})
    });
  });
});

app.all('/alta_productos', (req, res)=>{
  MongoClient.connect(MONGO_URL,{ useUnifiedTopology: true }, (err, db) => {
    const dbo = db.db("restaurante");
    dbo.collection("categorias").find().toArray(function(err, data) {
        res.render('alta_productos.html',{data:data});
    });
  });
});

app.all('/alta_categorias', (req, res)=>{
  res.render('alta_categorias.html')
});

app.post('/agegarproductos', (req, res)=>{
  var t = new Date();
  var plato = {
    id: t.getTime(),
    plato: req.body.titulo,
    photo: req.body.foto,
    description: req.body.descripcion,
    categoria: req.body.categoria
  };
  MongoClient.connect(MONGO_URL,{ useUnifiedTopology: true }, (err, db) => {  
    const dbo = db.db("restaurante");
    dbo.collection("menu").insertOne(plato,
        function (err, data) {
          if(data){
            res.send(`<h1>plato: ${req.body.titulo} agregado</h1>`);
          }
          else{
              res.send("No se pudo agregar"+err);
          }
        }
      )
  });	
});

app.post('/agregarcategorias', (req, res)=>{
  MongoClient.connect(MONGO_URL,{ useUnifiedTopology: true }, (err, db) => {  
    const dbo = db.db("restaurante");
    dbo.collection("categorias").insertOne({categoria: req.body.categoria},
        function (err, data) {
          if(data){
            res.send(`<h1>categoria: ${req.body.categoria} agregado</h1>`);
          }
          else{
              res.send("No encontrado");
          }
        }
      );
  });	
});

app.all('/categoria/:id', (req, res)=>{
  MongoClient.connect(MONGO_URL,{ useUnifiedTopology: true }, (err, db) => {  
    var categoria = req.params.id;
    const dbo = db.db("restaurante");
    dbo.collection("menu").find({"categoria":categoria}).toArray(function(err, data) {
      res.render('lista_por_categoria.html',{data:data});
    });
  });
});

app.all('/plato/:id', (req, res)=>{
  MongoClient.connect(MONGO_URL,{ useUnifiedTopology: true }, (err, db) => {  
    var plato = req.params.id;
    const dbo = db.db("restaurante");
    dbo.collection("menu").findOne({"plato":plato},function(err, data) {
      res.render('plato.html',{data:data});
    });
  });
});

app.listen(8080);