const validCharacters = new Set();
validCharacters.add(',');
validCharacters.add('<');
validCharacters.add('.');
validCharacters.add('>');
validCharacters.add('/');
validCharacters.add('?');
validCharacters.add(';');
validCharacters.add(':');
validCharacters.add('\\');
validCharacters.add('"');
validCharacters.add('[');
validCharacters.add('{');
validCharacters.add(']');
validCharacters.add('}');
validCharacters.add('\\');
validCharacters.add('|');
validCharacters.add('`');
validCharacters.add('~');
validCharacters.add('!');
validCharacters.add( '@');
validCharacters.add( '#');
validCharacters.add( '$');
validCharacters.add( '%');
validCharacters.add( '^');
validCharacters.add( '&');
validCharacters.add( '*');
validCharacters.add('(');
validCharacters.add(')');
validCharacters.add('-');
validCharacters.add('_');
validCharacters.add('+');
validCharacters.add('=');

const validator = {
    isNum(char:string) {
        return  char.charCodeAt(0) >= 48 && char.charCodeAt(0) <= 57 
    },
    
    isUpperLetter(char:string) {
        return  char.charCodeAt(0) >= 65 && char.charCodeAt(0) <= 90 
    },

    isLowerLetter(char:string) {
        return  char.charCodeAt(0) >= 97 && char.charCodeAt(0) <= 121 
    },

    isLetter(char:string){
        return this.isLowerLetter(char) || this.isUpperLetter(char)
    },

    isValidSymbol(char:string){
        return validCharacters.has(char)
    },

    isValid(char:string){
        return this.isNum(char) || this.isLetter(char) || this.isValidSymbol(char)
    },

    isEnter(char: string) { 
        return char.charCodeAt(0) === 10 || char.charCodeAt(0) === 13 
    }

}



export default validator