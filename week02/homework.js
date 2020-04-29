//Regexp For Number Literal:
// DecimalLiteral
// BinaryIntegerLiteral 
// OctalIntegerLiteral 
// HexIntegerLiteral
//Test Set
const tests_number_literal = [
    {
        test:'DecimalLiteralinside 1233',
        expect:1233
    },
    {
        test:'DecimalLiteral inside 1233.22222',
        expect:1233.22222
    },
    {
        test:'DecimalLiteral with exponent inside 2e+5 and 2e-5 .3e5 .e5',
        expect:['2e+5','2e-5','2e5']
    },
    {
        test:'no number inside',
        expect:'null',
    },
    {
        test:'BinaryIntegerLiteral inside 0b11100111 0B000001111 0b1234 0B222',
        expect:['0b11100111','0B000001111','0b1',]
    },
    {
        test:'OctalIntegerLiteral inside 034 0o10 0O789',
        expect:['0o10','0O7'],
    },
    {
        test:'HexIntegerLiteral inside 0xe7',
        expect:['0xe7'],
    }
]
//DecimalDigit = [0-9]
//NonZeroDigit = [1-9]
//DecimalDigits = ([0-9] | [0-9]+) = ([0-9]+)
//ExponentPart = (e|E)(DecimalDigits | (+|-)DecimalDigits) = ((e|E)(\+|\-)?[0-9]+)
//DecimalIntegarLiteral = 0 | ([1-9]DecimalDigits*) = (0 | ([1-9][0-9]*))
//DecimalLiteral = (DecimalIntegarLiteral).DecimalDigits*ExponentPart* |
//                  .DecimalDigits ExponentPart* |
//                  DecimalIntegarLiteral ExponentPart* 

//DecimalLiteral = (DecimalIntegarLiteral).DecimalDigits*ExponentPart* |
//                  .DecimalDigits ExponentPart* |
//                  DecimalIntegarLiteral ExponentPart* 

const decimalLiteralRegExp = /\b(((0|([1-9][0-9]*))\.([0-9]*)((e|E)(\+|\-)?[0-9]+)*)|(\.[0-9]+((e|E)(\+|\-)?[0-9]+)*)|((0|([1-9][0-9]*))((e|E)(\+|\-)?[0-9]+)*))\b/g

//BinaryDigits = [01]+
//BinaryIntegerLiteral = (0(b|B)[01]+)

//OctalDigits = [0-7]+
//OctalIntegerLiteral = (0(o|O)[0-7]+)

//HexiDigits = [0-0a-fA-F]+
//HexiIntegerLiteral = (0(x|X)[0-9a-fA-F]+)
const otherNumericLiteral = /(\b(((0|([1-9][0-9]*))\.([0-9]*)((e|E)(\+|\-)?[0-9]+)*)|(\.[0-9]+((e|E)(\+|\-)?[0-9]+)*)|((0|([1-9][0-9]*))((e|E)(\+|\-)?[0-9]+)*))\b)|(0(b|B)[01]+)|(0(o|O)[0-7]+)|(0(x|X)[0-9a-fA-F]+)/g
function runTest(){
    return tests_number_literal.map(item=>({
        result:item.test.match(otherNumericLiteral),
        expect:item.expect
    }))
}

console.log(runTest())


// \xnn   character with given hex code (1 or 2 hex digits)  
// \unnnn Unicode character with given code (1--4 hex digits)
function UTF8_Encoding(str){
    const Bytes = [parseInt('007F',16),parseInt('07FF',16),parseInt('FFFF',16),(parseInt('10FFFF',16))]
    //1.Get binary codepoint of each item in the str
    const codePoints = str.split('').map(s=>s.codePointAt(0))
    return codePoints.map(codepoint=>{
        //1.fill
        const bite_num = Bytes.findIndex((byte)=>codepoint <= byte) + 1
        if(bite_num ===1){
            return `\\x${codepoint.toString(16)}`
        }
        const binary_codepoint = codepoint.toString(2)
        //console.log(binary_codepoint)
        const binary_codepoint_arr = binary_codepoint.split('')
        
        const filed_length = Math.ceil(binary_codepoint.length / 8)
        let filled_binary = ''
        for (let index = filed_length*8-1; index > -1; index--) {
            filled_binary = `${binary_codepoint_arr.length ? binary_codepoint_arr.pop():0}${filled_binary}`
        }
        //2.build bytes
        const ret = [[]]
        const filled_binary_arr = filled_binary.split('')
        for (let index = 0; index <= bite_num; index++) {
            ret[0][index] = index === bite_num ? 0:1;
            if(index+1 < bite_num){
                ret[index+1] = [1,0]
            }
        }
        for (let outer_index = 0; outer_index < ret.length; outer_index++) {
            const inner = ret[outer_index];
            const filled_length = inner.length
            for (let inner_index = filled_length; inner_index <=7; inner_index++) {
                inner[inner_index] = filled_binary_arr.shift()
            }
        }
        return  ret.map(byte=>`\\x${parseInt(byte.join(''),2).toString(16)}`)
    }).join(' ')
}

//console.log(UTF8_Encoding('€')) //\x21 \x33
console.log(UTF8_Encoding('a3'),UTF8_Encoding('€'),UTF8_Encoding('€')) //\x21 \x33

//StringLiteral = (" + DoubleStringCharacters? + " )| ('+ SingleStringCharacters? + ')

//DoubleStringCharacters = DoubleStringCharacter DoubleStringCharacters?
//SingleStringCharacters = SingleStringCharacter SingleStringCharacters?

//DoubleStringCharacter = (SourceCharacter ~[" | \ | LineTerminator]) | <LS> | <PS> | \ EscapeSequence | LineContinuation

//SingleStringCharacter = (SourceCharacter ~[' | \ | LineTerminator]) | <LS> | <PS> | \ EscapeSequence | LineContinuation


//SourceCharacter = Unicode code point[unique decimal numbers] = [0-9]{1,7}

//EscapeSequence = CharacterEscapeSequence | 0[no decimal digit is allowed after \0] | HexEscapeSequence | UnicodeEscapeSequence

//CharacterEscapeSequence = SingleEscapeCharater | NonEscapeCharacter

//SingleEscapeCharater = ['"\bfnrtv]

//NonEscapeCharacter = SourceCharacter but ~[LineTerminator EscapeCharater]

//EscapeCharater = SingleEscapeCharater | DecimalDigit | x|u

//HexEscapeSequence = x + HexDigit + HexDigit

//UnicodeEscapeSequence = u+Hex4Digits | u{ + CodePoint + }

//Hex4Digits = [0-0a-fA-F]{4}

//HexiDigit = [0-0a-fA-F]

//Codepoint = [0-0a-fA-F]+  //HexDigits but only if MV(mathematical value) of HexDigits ≤ 0x10FFFF

//LineTerminator = <LF>|<CR> | <LS>(LINE SEPARATOR) | <PS>(Paragraph Separator) = \n(U+000A) | \r(U+000D) | U+2028 | u+2029
//LineTerminatorSequence = <LF> | <CR>[lookahead ≠ <LF>:not followed by <LF>] | <LS> | <PS> | <CR><LF> = \n(U+000A) | (\r(U+000D))(?! \n(U+000A)) |U+2028 | u+2029 | (\r(U+000D))(\n(U+000A))

//LineContinuation = \ LineTerminatorSequence = ((\n) | (\r)(?!(\n)) | \u0028 | \u0029 | (\r)(\n))

const tests_string_literal = [
    {
        test:'StringLiteralinside 1233',
        expect:1233
    },
    {
        test:'DecimalLiteral inside 1233.22222',
        expect:1233.22222
    },
    {
        test:'DecimalLiteral with exponent inside 2e+5 and 2e-5 .3e5 .e5',
        expect:['2e+5','2e-5','2e5']
    },
    {
        test:'no number inside',
        expect:'null',
    },
    {
        test:'BinaryIntegerLiteral inside 0b11100111 0B000001111 0b1234 0B222',
        expect:['0b11100111','0B000001111','0b1',]
    },
    {
        test:'OctalIntegerLiteral inside 034 0o10 0O789',
        expect:['0o10','0O7'],
    },
    {
        test:'HexIntegerLiteral inside 0xe7',
        expect:['0xe7'],
    }
]

let lineTerminatorRegexp = /\u000A|\u000D|\u2028|\u2029/g

let lineTerminatorSequenceRegexp = /\u000A|\u000D(?!\u000A)|\u2028|\u2029|\u000D\u000A/g
let lineContinuationRegexp = /\\(\u000A|\u000D(?!\u000A)|\u2028|\u2029|\u000D\u000A)/g
let singleEscapeCharaterRegexp = /[\u0027\u0022\u005c\u0062\u0066\u006e\u0072\u0074\u0076]/g

let escapeCharaterRegexp = /([\u0027\u0022\u005c\u0062\u0066\u006e\u0072\u0074\u0076])|([\u0030-\u0039])|\u0078|\u0075/g

let sourceCharacterRegexp = /[\u0000-\uFFFF]/g

let noEscapeCharacterRegexp = /[\u0000-\u0009\u000B\u000C\u000E-\u0021\u0023-\u0026\u0028\u0029\u003A-\u005B\u005D-\u0061\u0063-\u0065\u0067-\u006D\u006F-\u0071\u0073\u0077\u0079-\u2027\u2030-\uFFFF]/g

let singleStringCharacterRegexp = /([\u0000-\u0009\u000B\u000C-\u0028\u0029-\u2027\u2030-\uFFFF])|\u2028|\u2029|\\((([\u0027\u0022\u005c\u0062\u0066\u006e\u0072\u0074\u0076])|([\u0000-\u0009\u000B\u000C\u000E-\u0021\u0023-\u0026\u0028\u0029\u003A-\u005B\u005D-\u0061\u0063-\u0065\u0067-\u006D\u006F-\u0071\u0073\u0077\u0079-\u2027\u2030-\uFFFF]))|(0(?![0-9]+))|(\u0078[0-9a-fA-F]{2})|(\u0075[0-9a-fA-F]{4}|\u0075[0-9a-fA-F]+))|(\\(\u000A|\u000D(?!\u000A)|\u2028|\u2029|\u000D\u000A))/g

let characterEscapeSequenceRegexp = /([\u0027\u0022\u005c\u0062\u0066\u006e\u0072\u0074\u0076])|([\u0000-\u0009\u000B\u000C\u000E-\u0021\u0023-\u0026\u0028\u0029\u003A-\u005B\u005D-\u0061\u0063-\u0065\u0067-\u006D\u006F-\u0071\u0073\u0077\u0079-\u2027\u2030-\uFFFF])/g

let hexEscapeSquenceRegexp = /\u0078[0-9a-fA-F]{2}/g

let unicodeEscapeSequenceRegexp = /\u0075[0-9a-fA-F]{4}|\u0075[0-9a-fA-F]+/g

let escapeSequenceRegexp = /(([\u0027\u0022\u005c\u0062\u0066\u006e\u0072\u0074\u0076])|([\u0000-\u0009\u000B\u000C\u000E-\u0021\u0023-\u0026\u0028\u0029\u003A-\u005B\u005D-\u0061\u0063-\u0065\u0067-\u006D\u006F-\u0071\u0073\u0077\u0079-\u2027\u2030-\uFFFF]))|(0(?![0-9]+))|(\u0078[0-9a-fA-F]{2})|(\u0075[0-9a-fA-F]{4}|\u0075[0-9a-fA-F]+)/g


let stringLiteralRegexp = /(\u0022(([\u0000-\u0009\u000B\u000C-\u0028\u0029-\u2027\u2030-\uFFFF])|\u2028|\u2029|\\((([\u0027\u0022\u005c\u0062\u0066\u006e\u0072\u0074\u0076])|([\u0000-\u0009\u000B\u000C\u000E-\u0021\u0023-\u0026\u0028\u0029\u003A-\u005B\u005D-\u0061\u0063-\u0065\u0067-\u006D\u006F-\u0071\u0073\u0077\u0079-\u2027\u2030-\uFFFF]))|(0(?![0-9]+))|(\u0078[0-9a-fA-F]{2})|(\u0075[0-9a-fA-F]{4}|\u0075[0-9a-fA-F]+))|(\\(\u000A|\u000D(?!\u000A)|\u2028|\u2029|\u000D\u000A)))*\u0022)|(\u0027(([\u0000-\u0009\u000B\u000C-\u0028\u0029-\u2027\u2030-\uFFFF])|\u2028|\u2029|\\((([\u0027\u0022\u005c\u0062\u0066\u006e\u0072\u0074\u0076])|([\u0000-\u0009\u000B\u000C\u000E-\u0021\u0023-\u0026\u0028\u0029\u003A-\u005B\u005D-\u0061\u0063-\u0065\u0067-\u006D\u006F-\u0071\u0073\u0077\u0079-\u2027\u2030-\uFFFF]))|(0(?![0-9]+))|(\u0078[0-9a-fA-F]{2})|(\u0075[0-9a-fA-F]{4}|\u0075[0-9a-fA-F]+))|(\\(\u000A|\u000D(?!\u000A)|\u2028|\u2029|\u000D\u000A)))*\u0027)/g