    $('#file').change(function(e){
        var reader = new FileReader();
        reader.readAsArrayBuffer(e.target.files[0]);
        reader.onload = function(e) {
            var data = new Uint8Array(reader.result);
            var wb = XLSX.read(data,{type:'array'});
            var htmlstr = XLSX.write(wb,{sheet:"Hoja1", type:'binary',bookType:'html'});
            
            $('#tabla-datos')[0].innerHTML += htmlstr;
            var arrInd = ["A","B","C","D","E","F"];
            var dataArr = [];
            var itemArr = [];
	
        
            for(var i = 1; i < 30; i++){
                itemArr = [];
                for(var j = 0; j < arrInd.length; j++){
                    if($("#sjs-"+arrInd[j]+i).length){
                        itemArr.push($("#sjs-"+arrInd[j]+i)[0].textContent)
                    }
                }
                if(itemArr.length){
                    dataArr.push(itemArr);
                }
                
            }

            
            $.ajax({
                url:"/generar",
                method: "post",
                data: {'dataArr': JSON.stringify(dataArr)},
                success: function(data){
                    console.log(data)
                }
            })
        }
    });

   



    function abre(){
      var fecha  = $("#fecha").val();
      var proveedor  = $("#proveedor").val();
        if(!proveedor){
            proveedor = "lfa";
        }
      window.open("/etiquetas?fecha=" + fecha +"&proveedor=" + proveedor);
    }

    function checkfile(sender) {
        var validExts = new Array(".xlsx", ".xls", ".csv");
        var fileExt = sender.value;
        fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
        if (validExts.indexOf(fileExt) < 0) {
          alert("Archivo incorrecto, no es Excel papu" +
                   validExts.toString() + " types.");
          return false;
        }
        else return true;
    }