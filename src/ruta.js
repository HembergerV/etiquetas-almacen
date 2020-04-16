var controlador = require("./controlador/acciones.js")

module.exports = (app,passport) => {
    app.get('/', (req, res) => {
        res.render('etiqueta-almacen.ejs');
    });
    
    app.post('/generar', controlador.tablaEtiquetas);
    app.get('/etiquetas', controlador.generarPdf);
}