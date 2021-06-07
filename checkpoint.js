// ----- IMPORTANTE -----

// IMPORTANTE!: Para este checkpoint se les brindarán las 
// implementaciones ya realizadas en las homeworks de 
// Queue, LinkedList y BinarySearchTree.
// Sobre dichas implementaciónes van a tener que agregar nuevos
// métodos o construir determinadas funciones explicados más abajo.
// Pero todos los métodos ya implementados en las homeowrks no es 
// necesario que los vuelvan a definir.

const {
    Queue,
    LinkedList,
    Node,
    BinarySearchTree
} = require('./DS.js');

// ----- Closures -----

// EJERCICIO 1
// Implementar la funcion 'exponencial' que recibe un parametro entero 'exp'
// y retorna una una funcion, nos referiremos a esta ultima como funcion hija,
// y a 'exponencial' como la funcion padre, la funcion hija debe de recibir 
// un parametro y retornar dicho parametro elevado al parametro 'exp' de 
// la funcion padre original 'exponencial'
// Ejemplo:
// > var sqrt = exponencial(2);
// > sqrt(2);
// < 4
// > sqrt(3);
// < 9
// > sqrt(4);
// < 16

function exponencial(exp) {
    return function(num) {
        var value = num ** exp;
        return value;
    }
/*LEAN
hacemos closure, retornando una nueva funcion
return function(base) {
    usamos la var de la funcion padre
    return Math.pow(base, exp)
}
*/
}

// ----- Recursión -----

// EJERCICIO 2
// Crear la funcion 'direcciones':
// La funcion debe retornar un string de los movimientos Norte(N), Sur(S), Este(E), Oeste(O)
// que se deben realizar, para llegar al destino de un laberinto dado.
//
// Ejemplo: dado el siguiente laberinto:
// let laberintoExample = { // direccion = ""
//     N: 'pared',
//     S: { // direccion = "S"
//         N: 'pared',
//         S: 'pared',
//         E: { // direccion = "SE"
//             N: 'destino', // direccion = "SEN"
//             S: 'pared',
//             E: 'pared',
//             O: 'pared'
//         },
//         O: { // direccion = "SO"
//             N: 'pared',
//             S: 'pared',
//             E: 'pared',
//             O: 'pared'
//         }
//     },
//     E: 'pared',
//     O: 'pared'
// }
// El retorno de la funcion 'direcciones' debe ser 'SEN', ya que el destino se encuentra
// haciendo los movimientos SUR->ESTE->NORTE
// Aclaraciones: el segundo parametro que recibe la funcion ('direccion') puede ser pasado vacio (null)

function direcciones(laberinto, direccion = "") {
    //condicion de corte: cuando key === 'destino'
    //patron de consulta: N, S, E, O.
    //hacerle consulta al objeto si  tiene una key con value pared
    //si tiene, pasar a la siguiente key y preguntarle de nuevo
    //si no tiene, entrar (guardar la key donde se entró)y preguntar si tiene una key con value pared 
    //y volver a empezar.

    //si no hay laberinto, devuelvo vacio
    if(!laberinto) return direccion;
    //por cada llave en laberinto
    for(let key in laberinto) {
        //caso base:
        //si el valor de esa llave es 'destino'
        if(laberinto[key] === 'destino'){
            //agrega el nombre de la key a la variable direccion
            direccion += key;
            //como llegamos a destino devolve todo el trayecto
            return direccion;
        }
        //si el valor de la llave en la que estamos parado es un objeto, quiere decir que podemos pasar
        if(typeof laberinto[key] === 'object') {
            //agrego el nombre de la key a la variable direccion
            direccion += key;
            //recursion: vuelvo a validar los pasos anteriores
            return direcciones(laberinto[key], direccion);
        }
    }
    //en el caso que termine el for in sin destino
    return direccion;
};


// EJERCICIO 3
// Crea la funcion 'deepEqualArrays':
// Dado que las comparaciones en javascript aveces son un problema como con el siguiente ejemplo:
// [0,1,2] === [0,1,2] => false // puede probarlo en la consola
// con objetos o arrays identicos surge la necesidad de comparar en 'profundidad' arrays u objetos
// en este caso la funcion solo va a ser pensada para recibir arrays,
// pero estos pueden tener multiples niveles de anidacion, y la funcion deepEqualArrays debe
// comparar cada elemento, sin importar la profundidad en la que este
// Ejemplos: 
// deepEqualArrays([0,1,2], [0,1,2]) => true
// deepEqualArrays([0,1,2], [0,1,2,3]) => false
// deepEqualArrays([0,1,[[0,1,2],1,2]], [0,1,[[0,1,2],1,2]]) => true

function deepEqualArrays(arr1, arr2) { 
    /*
    if(typeof arr1[0] !== typeof arr2[0]) return false;
    if(typeof arr1[0] === typeof arr2[0]) return true; //en vez de 0 iria un i CORREGIR
    */
    //si sus largos son diferentes, ya sabemos que es false
    if(arr1.length !== arr2.length) return false;
    let flag = false;
    //si tienen igual length, recorro los indices de arr1
    for(let i = 0; i < arr1.length; i++) {
        //me fijo si hay arrays anidados
        if(Array.isArray(arr1[i]) && Array.isArray(arr2[i])) {
            //si la recursion da false, quiere decir que no son iguales(con la negacion entramos al if)
            if(!deepEqualArrays(arr1[i], arr2[i])) flag = true;
          //ademas comparo si los numeros son diferentes o no
        } else if(arr1[i] !== arr2[i]) {
            //si lo son, retorno false
            return false;
        } 
    };
    //si la flag es true, significa que algo dio false
    if(flag) return false;
    //si pasa todas las condiciones anteriores, es true
    return true;
}



// ----- LinkedList -----

// Deben completar la siguiente implementacion 'OrderedLinkedList'(OLL)
// que es muy similar a las LinkedList vistas en clase solo que 
// los metodos son distintos y deben de estar pensados para conservar la lista
// ordenada de mayor a menor.
// ejemplos:
// head --> 5 --> 3 --> 2 --> null
// head --> 4 --> 3 --> 1 --> null
// head --> 9 --> 3 --> -1 --> null
// Las dos clases principales ya van a estar implementadas a continuacion:
function OrderedLinkedList() {
    this.head = null;
}
// notar que Node esta implementado en el archivo DS

// Y el metodo print que permite visualizar la lista:
OrderedLinkedList.prototype.print = function(){
    let print = 'head'
    let pointer = this.head
    while (pointer) {
        print += ' --> ' + pointer.value
        pointer = pointer.next;
    }
    print += ' --> null'
    return print
}


// EJERCICIO 4
// Crea el metodo 'add' que debe agregar nodos a la OLL de forma que la misma se conserve ordenada de mayor a menor:
// Ejemplo:
// > LL.print()
// < 'head --> null'
// > LL.add(1)
// > LL.print()
// < 'head --> 1 --> null'
//    2       c
// > LL.add(5)
// > LL.print()
// < 'head --> 5 --> 1 --> null'
// > LL.add(4)
// > LL.print()
// < 'head --> 5 --> 3 --> 1 --> null'
//               4
OrderedLinkedList.prototype.add = function(value){ //insert in middle
   /*
    if(!this.head) {
        this.head = new Node(value)
        return;
    }

    let current = this.head;
    while(current.next && current.value > value) {
        current = current.next;
    }
    let aux = current.next;
    current.next = new Node(value)
    current.next.next = aux;
    */
    let newNode = new Node(val);
    if (!this.head) {                  // Si la lista estÃ¡ vacÃ­a, agrega this.head             
        this.head = newNode;
        return;
    }
    if (this.head.value < val) {       // Si head es menor al nuevo, reemplaza 
        this.head.next = this.head;
        this.head = newNode;
        return;
    }
    let current = this.head;           // Si head es mayor al nuevo. 
    while (current.next && current.next.value > val) {  // Mientras exista .next y .next.value sea mayor,
        current = current.next                          // Recorre la lista hasta no cumplir una de las dos condiciones.    
    }
    if (!current.next) {               // Si no existe .next, se llegÃ³ al final de la lista,
        current.next = newNode;        // y agrega nuevo nodo.
        return;
    }
    let aux = current.next;            // Existe .next y .next.value es menor que el nuevo.
    current.next = newNode;            // Nuevo reemplaza a .next, que pasa a ser el .next del nuevo.
    current.next.next = aux;
    return;

}


// EJERCICIO 5
// Crea el metodo 'removeHigher' que deve devolver el valor mas alto de la linked list 
// removiendo su nodo corresponidente:
// Ejemplo:
// > LL.print()
// < 'head --> 5 --> 4 --> 1 --> null'
// > LL.removeHigher()
// < 5
// > LL.removeHigher()
// < 4
// > LL.removeHigher()
// < 1
// > LL.removeHigher()
// < null

OrderedLinkedList.prototype.removeHigher = function(){ //buscar alto y remover
    //ATENCION A LA LISTA ADD, QUE PIDE AGREGAR ORDENADAMENTE. HACER PRIMERO ESE YA QUE DESPUES REMOVE HIGH Y LOW ES REMOVER HEAD Y COLA.
    //while(!null) -------->recorrer mientras
    //recorro como siempre las lista(search)
    //guardo en auxMayor el primer valor que me encuentro
    //comparo con el siguiente, es mayor que auxMayor? ---> si lo es., ahora auxmayor es ese siguiente
    //si no es mayor sigo iterando hasta que next sea null(ahi se termina la lista)
    //
}


// EJERCICIO 6
// Crea el metodo 'removeLower' que debe devolver el valor mas bajo de la linked list 
// removiendo su nodo corresponidente:
// Ejemplo:
// > LL.print()
// < 'head --> 5 --> 4 --> 1 --> null'
// > LL.removeHigher()
// < 1
// > LL.removeHigher()
// < 4
// > LL.removeHigher()
// < 5
// > LL.removeHigher()
// < null

OrderedLinkedList.prototype.removeLower = function(){ //buscar bajo y remover
    
}



// ----- QUEUE -----

// EJERCICIO 7
// Implementar la funcion multiCallbacks:
// la funcion multiCallbacks recibe dos arrays de objetos cuyas propiedades son dos,
// 'cb' que es una funcion, y 'time' que es el tiempo estimado de ejecucion de dicha funcion 
// este ultimo representado con un integer como se muestra acontinuacion:
// let cbsExample = [
//     {cb:function(){}, time: 2},
//     {cb:function(){}, time: 3}
// ]
// De manera que lo que nuestra funcion 'multiCallbacks' debe de ir ejecutando las funciones 
// sin pasarle parametros pero debe ir alternando las funciones de cbs1 y cbs2 
// segun cual de estas se estima que tarde menos, retornando un arreglo de resultados
// de las mismas en el orden que fueron ejecutadas
// Ejemplo:
// > let cbs1 = [
//       {cb:function(){return '1-1'}, time: 2},
//       {cb:function(){return '1-2'}, time: 3}
//   ];
// > let cbs2 = [
//       {cb:function(){return '2-1'}, time: 1},
//       {cb:function(){return '2-2'}, time: 4}
//   ];
// > multiCallbacks(cbs1, cbs2);
// < ["2-1", "1-1", "1-2", "2-2"];
// T=   1      2      3      4
function multiCallbacks(cbs1, cbs2){
    /*
    var aux = [];
    for(let value1 of cbs1) {
       
    }
    */
   //concateno el cbs1 con cbs2, con sort lo ordeno de menor a mayor por la propiedad time que tiene
   let callbacks = cbs1.concat(cbs2).sort(function(elementA, elementB){
       return elementA.time - elementB.time;
   });
   let results = [];
   //itero por cada uno de esos callbacks y pusheo el resultado de ejecutar la funcion cb
   for(let i = 0; i < callbacks.length; i++) {
       results.push(callbacks[i].cb());
   };
   return results;
    
    
}



// ----- BST -----

// EJERCICIO 8
// Implementar el metodo 'toArray' en el prototype del BinarySearchTree
// que devuelva los valores del arbol en una array ordenado
// Ejemplo:
//     32
//    /  \
//   8   64
//  / \
// 5   9
// resultado:[5,8,9,32,64]

BinarySearchTree.prototype.toArray = function(current = this, arr = []) {
    //CASO BASE: si no hay current, llegamos al final del arbol
    if(!current) {
        return [];
    }
    //tenemos que ir hasta el final del arbol y empezar a devolver valores desde ahi
    //si hay current, seguimos iterando por la izquierda
    this.toArray(current.left, arr);
    //cuando llegamos al final pusheamos 
    arr.push(current.value);
    //repetimos con la rama derecha
    this.toArray(current.right, arr)
    //retornamos el array
    return arr;

    /* OTRA MANERA:
        BimarySearchTree.prototype.toArray = function() {
            let arr = [];
            //si existe un left:
            if(this.left) {
                arr = arr.concat(this.left.toArray())
            }
            //llego al final, no entra al primer if y voy pusheando los values
            arr.push(this.value);
            //ahora con la rama derecha
            if(this.right) {
                arr = arr.concat(this.right.toArray())
            }
            return arr;
        }
    
    */
}



// ----- Algoritmos -----

// Ejercicio 9
// Implementar la funcion 'primalityTest' que dado un valor numerico entero
// debe de retornar true or false dependiendo de si este es primo o no.
// Puede que este es un algoritmo que ya hayan implementado pero entenderan
// que es un algoritmo que segun la implementacion puede llegar a ser muy costoso
// para numeros demasiado grandes, asi que vamos a implementarlo mediante un metodo
// derivado de Trial Division como el que se muestra aca:
// https://en.wikipedia.org/wiki/Primality_test
// Si bien esta no es la mejor implementacion existente, con que uds puedan 
// informarse sobre algoritmos, leerlos de un pseudocodigo e implemnterlos alcanzara

function primalityTest(n) {
    
}


// EJERCICIO 10
// Implementa el algoritmo conocido como 'quickSort', que dado un arreglo de elemntos
// retorn el mismo ordenado de 'mayor a menor!'
// https://en.wikipedia.org/wiki/Quicksort

function quickSort(array) {
    
}
// QuickSort ya lo conocen solo que este 
// ordena de mayor a menor
// para esto hay que unir como right+mid+left o cambiar el 
// signo menor en la comparacion con el pivot

/* EXTRA CREDITS 2

Esto tal vez les sirva para el extra credit, es una función que cuenta los digitos de un numero (si comienza con cero no lo tiene en cuenta)
 y no tiene problemas con los negativos. Vi una version parecida sin el Math.floor, pero usa un operador raro (or bit a bit) 
 
 function digitos(num){
    if(num < 0){ digitos (num *=-1)} 
    return (num <= 0) ? 0 : Math.floor( Math.log(num) * Math.LOG10E + 1 );
} 

*/


// ----- EXTRA CREDIT -----

// EJERCICIO 11
// Implementa la función 'reverse', que recibe un numero entero como parametro
// e invierte el mismo.
// Pero Debería hacer esto sin convertir el número introducido en una cadena, o un array
// Ejemplo:
// > reverse(123);
// < 321
// > reverse(95823);
// < 32859

function reverse(num){
    let nuevoNum = 0;
    while(num > 0) {
        nuevoNum = nuevoNum * 10 % 10;
        num = Math.floor(num / 10);
    }
    return nuevoNum;
    
}
// la grandiosa resolucion de Wilson!!!
// declaran una variable donde 
// almacenar el el numero invertido
// y van multiplicando por 10 la 
// porcion del numero que ya invirtieron
// deforma que esta se corra hacia la izq
// para agregar el ultimo numero de la 
// porcion no revertida
// y luego le quitan a la porcion 
// no revertida el ultimo numero

module.exports = {
    exponencial,
    direcciones,
    deepEqualArrays,
    OrderedLinkedList,
    multiCallbacks,
    primalityTest,
    quickSort,
    reverse,
    Queue,
    LinkedList,
    Node,
    BinarySearchTree
}