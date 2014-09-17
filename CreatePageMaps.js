
$( document ).on( "pagecreate", "#content-app", function() {
    var defaultLatLng = new google.maps.LatLng(34.0983425, -118.3267434);  // Default to Hollywood, CA when no geolocation support
	var user_pos;
	var oro_pos;
    var cercanos;

    if (navigator.geolocation){
        
        function success(pos) {
            // Location found, show map with these coordinates
            var ZonasCercanas = [];
           
            user_pos = pos.coords.latitude+','+pos.coords.longitude;
			
			// dea_pos = new google.maps.LatLng(10.007999, -84.065008);
            user_pos2 = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);

            // funcion para obtener distancias
            $.ajax({
                type: "GET",
                url: "Your URL-- return JSON",
                dataType: 'json'
            })
            .done(function(data) {
                // var data = JSON.parse(data);
                var distancia;

                $.each(data, function(i, val){

                    distancia = google.maps.geometry.spherical.computeDistanceBetween(user_pos2,new google.maps.LatLng(val.lat, val.long));

                     // console.log(distancia);

                    objectZonas = {
                                        'id' : val.id,
                                        'name' : val.nombre,
                                        'adress':  val.direccion,
                                        'distance':  distancia,
                                        'latitud': val.lat,
                                        'longitud':val.long
                                        };

                    ZonasCercanas.push(objectZonas);

                });
                // ordenar el array según distancaia en de los puntos
                Array.prototype.orderByNumber=function(property,sortOrder){
                  // Primero se verifica que la propiedad sortOrder tenga un dato válido.
                  if (sortOrder!=-1 && sortOrder!=1) sortOrder=1;
                  this.sort(function(a,b){
                    // La función de ordenamiento devuelve la comparación entre property de a y b.
                    // El resultado será afectado por sortOrder.
                    return (a[property]-b[property])*sortOrder;
                  });
                };

                ZonasCercanas.orderByNumber('distancias',1);
                cercanos = ZonasCercanas.slice(0,6);
                var html = '';
                 var dea = '';
                 var distancia = '';
                
                for (index = 0; index < 6;++index){
                    if((cercanos[index].distancias/1000) < 1){
                        distancia = (cercanos[index].distancias).toFixed(1)+'m';
                    }else{
                         distancia = (cercanos[index].distancias/1000).toFixed(1)+'km';
                    }
                    console.log(distancia);


                } //FIN DEL FOR 

            });


            drawMap(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
        
        }

        
        function fail(error) {
            drawMap(defaultLatLng);  // Failed to find location, show default map
        }
        // Find the users current position.  Cache the location for 5 minutes, timeout after 6 seconds
        
        navigator.geolocation.getCurrentPosition(success, fail, {maximumAge: 500000, enableHighAccuracy:true, timeout: 6000});
    } else {
        
        drawMap(defaultLatLng);  // No geolocation support, show default map
    
    }
    function drawMap(latlng) {
        var myOptions = {
            zoom: 16,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            zoomControl: false,
			panControl: false,
			mapTypeControl: false
        };
        var map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);
        // Add an overlay to the map of current lat/lng
        var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            title: "Greetings!"
        });
    }
});

















