const passport = require("passport");
const path = require("path");
var url = require('url');


var fonts = {
	Roboto: {
		normal: 'fonts/arial.ttf',
		bold: 'fonts/ARIALNB.ttf',
		italics: 'fonts/ariali.ttf',
		bolditalics: 'fonts/arialbi.ttf'
	}
};

var PdfPrinter = require('../fonts/fontjs/printer.js');
var printer = new PdfPrinter(fonts);

function tablaEtiquetas(req, res){
    var contenido = req.body.dataArr;
    req.session.continue = contenido;
    res.send("Todo OK!")
};

function generarPdf(req,res){
    var datos = JSON.parse(req.session.continue);
    var proveedor = url.parse(req.url,true).query.proveedor.toUpperCase();
    var fecha = url.parse(req.url,true).query.fecha;
    fecha = new Date(fecha);
    var height = [];
    var x;
    
    var acum = 0;
    for(var i = 1; i < datos.length; i++){
        acum += parseInt(datos[i][3],10);
    }
    var acum2 = acum;
    
    while(acum % 3 != 0){
        acum += 1;
    }
    var filas = acum / 3;
    for(var i = 0; i < filas; i++){
        height.push(100)
    }
    var listar = [];
    var itemLista = [];
    var countTres = 0;
    
    for(var i = 1; i < datos.length; i++){
        //console.log(datos[i]);
        for(var j = 0; j < parseInt(datos[i][3],10);j++){
            var fontSize = 15;
            var fontSizeNro = 13;
            var fontSizeCode = 10;

            var x = ""
            if(datos[i][1].length < 15){
                x = " ";
                fontSize = 17;
                fontSizeNro = 15
            }else if(datos[i][1].length > 45){
                fontSize = 13;
                fontSizeNro = 12;
                fontSizeCode = 9;
            }
            itemLista.push([{image: 'views/enunciado.png',width: 165},{alignment: 'center',fontSize:fontSize,bold:true,text:datos[i][1]},
                     {alignment: 'center',fontSize:fontSizeNro,text:datos[i][0]},{alignment: 'center',fontSize:fontSizeCode,text:(fecha.getDate()+1)+proveedor+0+(fecha.getMonth()+1)+(fecha.getFullYear()-2000)+"-"+Math.ceil(parseInt(datos[i][2],10))},{text:x}]);
            countTres += 1;
            if(countTres == 3){
                listar.push(itemLista);
                itemLista = [];
                countTres = 0
            }
        }
        
    }
    if(countTres == 1){
        itemLista.push([{image: 'views/enunciado.png',width: 165},{alignment: 'center',fontSize:15,bold:true,text:" "},
             {alignment: 'center',fontSize:13,text:" "},{alignment: 'center',fontSize:10,text:" "},{text:x}]);
        itemLista.push([{image: 'views/enunciado.png',width: 165},{alignment: 'center',fontSize:15,bold:true,text:" "},
             {alignment: 'center',fontSize:13,text:" "},{alignment: 'center',fontSize:10,text:" "}]);
        listar.push(itemLista);
    }else if(countTres == 2){
        itemLista.push([{image: 'views/enunciado.png',width: 165},{alignment: 'center',fontSize:15,bold:true,text:" "},
             {alignment: 'center',fontSize:13,text:" "},{alignment: 'center',fontSize:10,text:" "}]);
        listar.push(itemLista);
    }
    
    var docDefinition = {
                    content: [

                        {
                            style: 'tableExample',
                            table: {
                                widths: [ '*', '*','*'],
                                body: listar,

                            },
                            layout:{
                                fillColor: function (rowIndex, node, columnIndex) {
                                    return (rowIndex % 2 === 0) ? '#ffffff' :'#ffffff';
                                },
                                hLineWidth: function (i, node) {
                                    return (i === 0 || i === node.table.body.length) ? 1 : 1;
                                },
                                vLineWidth: function (i, node) {
                                    return (i === 0 || i === node.table.widths.length) ? 1 : 1;
                                },
                                hLineColor: function (i, node) {
                                    return (i === 0 || i === node.table.body.length) ? 'gray' : 'gray';
                                },
                                vLineColor: function (i, node) {
                                    return (i === 0 || i === node.table.widths.length) ? 'gray' : 'gray';
                                }
                            }
                        }
                    ],
                    styles: 'tableExample',
                    defaultStyle: {
                        alignment: 'justify'
                    }}

                    var pdfDoc = printer.createPdfKitDocument(docDefinition);
                      // Stream contents to a file
                     pdfDoc.pipe(res).on('finish', function () {
                        console.log('Archivo creado satisfactoriamente ....');
                     });


                    pdfDoc.end()
}

module.exports = {
    tablaEtiquetas,
    generarPdf
}