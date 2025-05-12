// Flattening

let arrays = [[1, 2, 3], [4, 5], [6]];
const flat =  arrays.reduce((start, next) => start.concat(next), [])
console.log(flat);


// Your Own Loop
function loop(value, test, update, body) {
    let i = value;
    while (test(i)) { 
        body(i);       
        i = update(i); 
    }
}

loop(0, (i)=> i < 5, (i)=> i + 1, console.log)


// Everything

function every(array, test){
    for ( let element of array ){
        if(!test(element)){
            return false
        }
    }
    return true
}

function every2(array, test) {
    return !array.some(element => !test(element));
  }

console.log(every([1, 3, 5], n => n < 10));
console.log(every([2, 4, 16], n => n < 10));
console.log(every([], n => n < 10));



// Dominant Writing Direction
function dominantDirection(text) {
    let counted = countBy(text, char => {
      let script = characterScript(char.codePointAt(0));
      return script ? script.direction : "none";
    }).filter(({name}) => name != "none");
  
    if (counted.length == 0) return "ltr";
  
    return counted.reduce((a, b) => a.count > b.count ? a : b).name;
  }
  
  console.log(dominantDirection("Hello!"));
  
  