const express = require("express");
const app = express();
const mysql = require("mysql2");
//motor de plantilla
const hbs = require("hbs");
//encontrar archivos
const path = require("path");
//para enviar mails
const nodemailer = require("nodemailer");
const { Console } = require("console");
//variables de entorno
require("dotenv").config();

//configuramos el puerto
const PORT = process.env.PORT || 9000;

//Middelware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

//configuamos el motor de plantillas de HBS
app.set("view engine", "hbs");
//configuramos la ubicacion de las plantillas
app.set("views", path.join(__dirname, "views"));
//configuramos los parciales de los motores de plantillas
hbs.registerPartials(path.join(__dirname, "views/partials"));

//conexion a la base de datos
const conexion = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DBPORT,
});

conexion.connect((err) => {
  if (err) throw err;
  console.log(`Conectado a la Database ${process.env.DATABASE}`);
});

//rutas de la aplicacion
app.get('/', (req, res) => {
  res.render('index', {
    titulo: '¡¡Bienvenidos!!',
  });
});

app.get('/menus', (req, res) => {
  let sql = "SELECT * FROM productos";
  conexion.query(sql, function(err, result){
    if (err) throw err;
    console.log(result);
    res.render('menus', {
        titulo: 'menus',
        datos: result
      })
  })
})

app.get('/admin', (req, res) => {

  let sql = "SELECT * FROM productos";

  conexion.query(sql, function(err, result){
    if (err) throw err;
    //console.log(result);
    res.render('admin', {
        titulo: 'admin',
        datos: result
      })
  })
});

app.get('/pedidos1', (req, res) => {

  res.render('saludo', {
    titulo: 'saludo',
  })
});

app.get('/galeria', (req, res) => {
  res.render('galeria', {
    titulo: 'galeria',
  })
});

app.get('/saludo', (req, res) => {
  res.render('saludo', {
    titulo: 'saludo',
  })
});

app.post('/menus', (req, res) =>{

  const idMenu = req.body.idMenus;
  const Menu = req.body.Menu;
  const precio = req.body.precio;
    
let datos = [{
    idMenus: idMenu,
    Menu: Menu,
    precio: precio,
    }]

  //let sql = "INSERT INTO productos set ?"; 
  
  /*conexion.query(sql, datos, function(err){
    if (err) throw err;*/
    console.log(`1 Registro insertado`);
    res.render('pedidos1', {
      titulo: 'Pedidos1',
      datos: datos
    })
//    })  
})


//creación de post de datos de clientes y envio de email
app.post("/index", (req, res) => {
  const nombre = req.body.nombre;
  const email = req.body.email;
  const phone = req.body.phone;

  //creamos una funcion para enviar Email al cliente
  async function envioMail(){
    //configuramos la cuenta del envio
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAILPASSWORD
      }
    });

    //Envio del mail
    let info = await transporter.sendMail({
      from: process.env.EMAIL,
      to: `${email}`,
      subject: "Gracias por elegirnos y vive la experiencia MenuClick",
      html: `Muchas gracias por elegirnos. <br>
      Estaremos enviando promociones y menus de nuestras comidas a esta dirección de correo. <br>
      Si necesitas más información de nuestros menus, con gusto te atenderemos.<br>
      Que tengas una buena semana.<br>
      Saludos,<br>
      Equipo MenuClick<br>`
    })

  }

  let datos = {
    nombre: nombre,
    email: email,
    phone: phone
  }

  let sql = "INSERT INTO usuarios set?";

  conexion.query(sql, datos, function(err){
    if(err) throw err;
    console.log(`1 Registro insertado`);
    //Email
    envioMail().catch(console.error);
    res. render('menus')
  })
})

//conectar modales
app.post('/delete', (req, res) => {

  console.log(req.body.idMenus);

  let sql = "DELETE FROM productos where idMenus = " + req.body.idMenus + "";
  console.log(sql);
  conexion.query(sql, function(err,result){
    if (err) throw err;
      console.log('Dato eliminado: ' + result.affectedRows);
      res.render('Menus')
    })
})

app.post('/update', (req, res) => {
  
  const idMenus = req.body.idMenus;
  const Menu = req.body.Menu;
  const precio = req.body.precio;  

  console.log(req.body.idMenus);

let sql = "UPDATE productos SET Menu = '" + Menu+ "', precio= '" + precio + "' WHERE idMenus = " + idMenus;
console.log(sql);
res.send(sql)
conexion.query(sql, function(err,result){
    if (err) throw err;
      console.log('Dato actualizado: ' + result.affectedRows);
      res.render('index')
    })
})


//servidor a la escucha de las peticiones
app.listen(PORT, () => {
  console.log(`Servidor trabajando en el puerto: ${PORT}`);
});

//para imprimir
//console.log(process.env.DATABASE);





