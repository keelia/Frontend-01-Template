# 使用LL算法构建AST
四则运算：
    TokenNumber: 0-9的组合 /[1-9][0-9]?\.[0-9]?/
    Operator:+ - * /
    Whitespace:<SP>
    LineTerminator:<LF><CR>
输入：10+2*1024
    拆分词法：状态机/正则表达式

四则运算的BNF:
 <Expression> = <AdditiveExpression><EOF>

<MultiplicativeExpression> = <DecimalNumber> | ( <MultiplicativeExpression> "*" <DecimalNumber>) | (<MultiplicativeExpression> "/" <DecimalNumber> )

 <AdditiveExpression> = <MultiplicativeExpression> | ( <AdditiveExpression> "+" <MultiplicativeExpression>) | (
            <AdditiveExpression> "-" <MultiplicativeExpression>)