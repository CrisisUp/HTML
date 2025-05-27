function isValid(s) {
    const stack = []; // Pilha para armazenar os parênteses abertos
    const map = {
        '(': ')',
        '[': ']',
        '{': '}'
    }; // Mapeamento de abertura para fechamento

    for (let char of s) {
        if (char in map) {
            stack.push(char); // Empilha a abertura
        } else {
            // Se a pilha estiver vazia ou o fechamento não corresponder
            if (stack.length === 0 || map[stack.pop()] !== char) {return false;}
        }
    }
    // Verifica se todos os parênteses foram fechados
    return stack.length === 0;
}
console.log("É válido? (): " + isValid("()"));
console.log("É válido? ()[]{}: " + isValid("()[]{}")); // true
console.log("É válido? {[]}: " + isValid("{[]}"));   // true
console.log("É válido? (]: " + isValid("(]"));     // false
console.log("É válido? ([)]: " + isValid("([)]"));   // false
console.log("É válido? }: " + isValid("}"));      // false
console.log("É válido? (){: " + isValid("(){"));