//public funcitons
const toDecimalIndex =(codepoint)=>{
    const upperAlpha = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const upperCodePoints = upperAlpha.split('').map(char=>char.codePointAt(0))
    const lowerAlpha = "0123456789abcdefghijklmnopqrstuvwxyz";
    const lowerCodePoints = lowerAlpha.split('').map(char=>char.codePointAt(0))
    return upperCodePoints.findIndex(point=>point === codepoint) > -1 ? (upperCodePoints.findIndex(point=>point === codepoint)):(lowerCodePoints.findIndex(point=>point === codepoint))
}

const toChar =(decimalIndex)=>{
    const alpha = "0123456789abcdefghijklmnopqrstuvwxyz";
    return alpha[decimalIndex]
}
const exponentPartRegexp = /(?<=(((0|[1-9]+)\.[0-9]?)|(\.[0-9]+)|(0|[1-9]+)))(e|E)(\-|\+)?[0-9]+/g

//ConvertStringToNumber
const testSet = [
    {
        input:{
            str:'123',
            radix:10
        },
        expect:123
    },{
        input:{
            str:'C0E7',
            radix:16
        },
        expect:49383
    },{
        input:{
            str:'c0e7',
            radix:16
        },
        expect:49383
    },{
        input:{
            str:'3a',
            radix:16
        },
        expect:58
    },
    {
        input:{
            str:'175',
            radix:8
        },
        expect:125
    },
    {
        input:{
            str:'10010101101',
            radix:2
        },
        expect:1197
    },{
        input:{
            str:'11101',
            radix:2
        },
        expect:29
    },
    {
        input:{
            str:'764',
            radix:8
        },
        expect:500
    },
    {
        input:{
            str:'123e-1',
            radix:10
        },
        expect:12.3
    },{
        input:{
            str:'0.0314E2',
            radix:10
        },
        expect:3.14
    },{
        input:{
            str:'7.71234e+1',
            radix:10
        },
        expect:77.1234
    },
    {
        input:{
            str:'0.101',
            radix:2
        },
        expect:0.625
    },{
        input:{
            str:'0.4',
            radix:8
        },
        expect:0.5
    },
    {
        input:{
            str:'0.01010101010101',
            radix:2
        },
        expect:0.3
    },{
        input:{
            str:'0.3c',
            radix:16
        },
        expect:0.234375
    },
    {
        input:{
            str:'0',
            radix:10
        },
        expect:0
    }
]

function convertStringToDecimalNumber(str,radix){
    
    //1.check radix
    //1.1 default radix = 10
    radix = radix || 10;
    if(radix<2){
        radix = 10
    }else if(radix>36){
        radix = 10
    }
    const raw_str = str
    if(radix ===10){
        if(exponentPartRegexp.test(str)){
            str = str.replace(exponentPartRegexp,'')
        }
      // console.log(str,str.match(exponentPartRegexp),exponentPartRegexp.test(str))
    }
    //2.integer + fraction
    const [integer,fraction] = str.split('.')
    //2.1 integer process:
    const integerChars = integer.split('')
    let integerDecimal = 0
    //2.2 radix from 2-10
    if(radix >=2 && radix <=10){
        for (let index = 0; index < integerChars.length; index++) {
            const exponentNum = integerChars.length - 1 - index;
            integerDecimal += (integerChars[index].codePointAt(0) - '0'.codePointAt(0)) * (radix)**exponentNum
        }
        
    }else{ //2.3 radix from 11-36
        //2.3.1 convert alpha to decimal number
        const formatedChars = integerChars.map(char=>toDecimalIndex(char.codePointAt(0)))
        for (let index = 0; index < formatedChars.length; index++) {
            const exponentNum = formatedChars.length - 1 - index;
            integerDecimal += formatedChars[index] * (radix)**exponentNum
        }
    }
    //2.2 fraction process
    let fractionDecimal = 0
    const fractionChars = fraction ? fraction.split(''):[]
    //shorten fractionChars to avoid infinity fractions
    if(fractionChars.length){
        fractionChars.length = fractionChars.length > 5 ? 5 :fractionChars.length //Max precision
    }
    if(radix >=2 && radix <=10){
        for (let index = 0; index < fractionChars.length; index++) {
            const exponentNum = index+1;
            fractionDecimal += (fractionChars[index].codePointAt(0) - '0'.codePointAt(0)) * (1/radix)**exponentNum
        }
    }else{
        const formatedChars = fractionChars.map(char=>toDecimalIndex(char.codePointAt(0)))
        for (let index = 0; index < formatedChars.length; index++) {
            const exponentNum =  index+1;
            fractionDecimal += formatedChars[index] * (1/radix)**exponentNum
        }
    }
    if(radix ===10){
        if(exponentPartRegexp.test(raw_str)){
            const exponentPart = raw_str.match(exponentPartRegexp)[0]
            const exponents = exponentPart.match(/[0-9]+/g)[0]
            const base = /\-/g.test(exponentPart) ? (1/10) : 10
            return (integerDecimal + fractionDecimal) * (base ** exponents)
        }
    }
   
    return integerDecimal + fractionDecimal
}
console.log(testSet.map(test=>(Object.assign({},test,{result:convertStringToDecimalNumber(test.input.str,test.input.radix)}))))

//Convert Number To String
const testSetNtoS = [
    {
        input:{
            num:123,
            radix:10
        },
        expect:'123'
    },{
        input:{
            num:123.321,
            radix:10
        },
        expect:'123.321'
    },{
        input:{
            num:0xC0E7,
            radix:16
        },
        expect:'C0E7'
    },{
        input:{
            num:0xc0e7,
            radix:16
        },
        expect:'c0e7'
    },{
        input:{
            num:0x3a,
            radix:16
        },
        expect:'3a'
    },
    {
        input:{
            num:0o175,
            radix:8
        },
        expect:'175'
    },
    {
        input:{
            num:0b10010101101,
            radix:2
        },
        expect:'10010101101'
    },{
        input:{
            num:0b11101,
            radix:2
        },
        expect:'11101'
    },
    {
        input:{
            num:0o764,
            radix:8
        },
        expect:'764'
    },
    {
        input:{
            num:123e-1,
            radix:10
        },
        expect:'12.3'
    },{
        input:{
            num:0.0314E2,
            radix:10
        },
        expect:'3.14'
    },{
        input:{
            num:7.71234e+1,
            radix:10
        },
        expect:'77.1234'
    },
    {
        input:{
            num:0b101,
            radix:2
        },
        expect:'101'
    },
    {
        input:{
            num:0b1010101010101,
            radix:2
        },
        expect:'1010101010101'
    },{
        input:{
            num:0x3c,
            radix:16
        },
        expect:'3c'
    },{
        input:{
            num:0,
            radix:10
        },
        expect:'0'
    }
]
function convertNumberToString(decimalNumber,radix){
    let fraction = decimalNumber - Math.floor(decimalNumber)
    let integer = decimalNumber - fraction
    radix =  radix || 10
    if(radix<2 || radix > 36){
        radix = 10
    }
    let integerStr = ''
    while (integer > 0) {
        let tail = String(integer % radix);
        if(tail > 9){
            tail = toChar(tail)
        }
        integer = Math.floor(integer / radix)
        integerStr = `${tail}${integerStr}`
    }
    let fractionStr = ''
    while (fraction>0) {
        let tail = String(fraction % radix);
        if(tail > 9){
            tail = toChar(tail)
        }
        fraction = Math.floor(fraction / radix)
        fractionStr = `${tail}${fractionStr}`
    }
    if(fractionStr && fractionStr.length){
        fractionStr = fractionStr.slice(1)
        if(fractionStr.length > 6){
            fractionStr = fractionStr.slice(0,6)
        }
    }
    return (integerStr + fractionStr) ? integerStr + fractionStr :'0'
}
//console.log(testSetNtoS.map(test=>(Object.assign({},test,{result:convertNumberToString(test.input.num,test.input.radix)}))))