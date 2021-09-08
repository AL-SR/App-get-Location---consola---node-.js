require('dotenv').config()
require("colors");

const { leerInput,
        inquirerMenu,
        inquirerPausa, 
        listarLugares} = require("./helpers/inquirer");

const Busquedas = require("./models/busquedas");

const main = async()=>{
   

    let opt = '';
    const busquedas = new Busquedas();

    do {
    opt = await inquirerMenu();

    switch (opt) {

        case '1':
            // Mostrar mensaje
            const busquedad = await leerInput('Ciudad: ');
            // Buscar los lugares 
            const lugares =  await busquedas.ciudad( busquedad );
            const id = await listarLugares( lugares );
            
            if(id === '0') continue;

            
            // seleccionar el lugar
            const lugarSel = lugares.find( l => l.id === id);
            const {name, lat, lng} = lugarSel;
            
            //Guardar en DB
            busquedas.agregarHistorial( name );

            // Clima
            const clima = await busquedas.clima(lat,lng);
            const {temp, max, min, desc} = clima
            // Mostrar resultados
            console.clear();
            console.log('\nInformación de la ciudad\n'.green);
            console.log('Ciudad:',name.toUpperCase().green);
            console.log('Lat:', lat);
            console.log('Lng:', lng);
            console.log('Temperatura',temp );
            console.log('Maxima',max);
            console.log('Minima:',min);
            console.log('Como esta el clima:',desc.green,'\n');

            break;
    
        case '2':
            busquedas.Historialcapitalizado.forEach((lugar,idx) => {
                let i = idx+1;
                console.log( `${i}. ${lugar}` )});
            break;
    }

    if(opt !== '0')await inquirerPausa();
    } while (opt !== '0');
}

main();
