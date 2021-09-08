require("colors");
const { green } = require("colors");
const inquirer = require("inquirer");

const preguntas = [
    {
    type:'list',
    name: 'opcion',
    message: '¿Que desea hacer?',
    choices: [
        {value:'1',name:`${'1.'.green} Buscar Lugar.`}, 
        {value:'2',name:`${'2.'.green} Historial.`}, 
        {value:'0',name:`${'0.'.green} Salir.`}
    ] 
    }
];


const inquirerMenu = async() =>{

        console.clear();
        console.log('========================'.green);
        console.log(' APP GeoLocation Clima');
        console.log(' seleccione una opción ');
        console.log('========================\n'.green);
    
       const {opcion} = await inquirer.prompt(preguntas)
       return opcion;
}

const inquirerPausa = async() =>{

    const pausaMenu = [
        {
        type: 'input',
        name: 'pausa',
        message: `Presione ${'ENTER'.green} para continuar\n`,
        }
    ];
    
    const pausa = await inquirer.prompt(pausaMenu);
    return pausa;   
}


const leerInput = async(message) =>{
    const  question = [
        {
            type: 'input',
            name:'desc',
            message,
            validate( value ){
                if(value.length === 0){
                    return 'Por favor ingrese un valor';
                }
                return true;
            }
        }
    ];

    const { desc }= await inquirer.prompt(question);
    return desc;
}

const listarLugares = async( lugares = [] ) =>{
    
    const choices =  lugares.map( (lugar, i) => {
        
        let idx = `${i+1}.`.green
        
        return {
            value: lugar.id,
            name: `${idx} ${lugar.name}`
        }
    })
    
    choices.unshift({
        value:'0',
        name: '0.'.green + ' Cancelar'
    });

    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione lugar.',
            choices
        }
    ]
    const { id } = await inquirer.prompt(preguntas);
    return id;
}


const mostrarListadoCheckList = async( tareas = [] ) =>{
    
    const choices =  tareas.map( (tarea, i) => {
        
        let idx = `${i+1}.`.green
        
        return {
            value: tarea.id,
            name: `${idx} ${tarea.descrition}`,
            checked: (tarea.complet) ? true : false
        }
    })
    
   
    const pregunta = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Selecciones',
            choices
        }
    ]
    const { ids } = await inquirer.prompt(pregunta);
    return ids;
}

const confirmar = async( mensaje ) => {

    const question = [
        {
            type: 'confirm',
            name: 'ok',
            message: mensaje
        }
    ];

    const { ok } = await inquirer.prompt(question);
    return ok;


}



module.exports = { 
    inquirerMenu,
    inquirerPausa,
    leerInput,
    listarLugares,
    confirmar,
    mostrarListadoCheckList
}