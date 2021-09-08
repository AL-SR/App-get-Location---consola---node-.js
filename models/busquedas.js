const fs = require('fs');
const  axios  =  require ( 'axios' ) ;


class Busquedas {
    historial = [];
    archivo =  './db/database.json';
    
    constructor(){
        // TODO: leer DB si existe
        this.leerDB();
    }

    get Historialcapitalizado(){

        return this.historial.map( lugar =>{
        
            let palabras = lugar.split(' ');
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1) );
            return palabras.join(' ');

        })
    }

    get paramsMaxbox(){
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit':5,
            'language':'es'
        }
    }

    get paramsOPENWEATHER_KEY(){
        return{

            'appid':process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'es'
        }
    }
    
    async ciudad( lugar = ''){

        try {
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: this.paramsMaxbox,
                timeout: 2000,
              });
              
            const resp = await instance.get();
            return resp.data.features.map( place => ({
                id: place.id,
                name: place.place_name,
                lng: place.center[0],
                lat: place.center[1]
            }));
            

        } catch (error) {
            
            console.log();
            return [];
        }
    }

    async clima(lat,lon){
        
        try {
            const instance = axios.create({
                baseURL: 'https://api.openweathermap.org/data/2.5/weather',
                params: {...this.paramsOPENWEATHER_KEY, lat, lon},
             
            });
            const resp = await instance.get();
            const {weather,main} = resp.data

            return{
                desc: weather[0].description,
                min: main.temp_min, // tem minima
                max: main.temp_max, // tem maxima
                temp:main.temp      // tem normal
            };
            
        } catch (error) {
            console.log(error);
        }
    }


    agregarHistorial(lugar = ''){ 
        
        if(this.historial.includes(lugar.toLocaleLowerCase())){
            return;
        }

        this.historial = this.historial.splice(0,5);
        this.historial.unshift( lugar.toLocaleLowerCase() );

        // Grabar en DB
        this.guardarDB();
    }
    
    guardarDB() {

        const payload = {
            historial: this.historial
        };
        fs.writeFileSync( this.archivo , JSON.stringify( payload ) );
    }

    leerDB(){
        
        if(!fs.existsSync( this.archivo )){
            return null;
        }

        const info = fs.readFileSync( this.archivo, {encoding: 'utf-8'});
        const data = JSON.parse(info);
        console.log(data);
        this.historial = data.historial;
    } 
}

module.exports = Busquedas;