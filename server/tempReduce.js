
const sourceText = `mark johansson,waffle iron,80,2
mark johansson,blender,200,1
mark johansson,knife,10,4
Nikita Smith,waffle iron,80,1
Nikita Smith,knife,10,2
Nikita Smith,pot,20,3`


let source = sourceText.split('\n').map((line) => line.split(','))

let reduced = source.reduce((customers, line) => {
  if (!customers[line[0]]) {
    customers[line[0]] = [];
  }
  customers[line[0]].push({
    name: line[1],
    price: line[2],
    qty: line[3]
  })
  return customers
}, {})

// console.log(source)
console.log(reduced)