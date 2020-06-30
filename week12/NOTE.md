# 使用LL算法构建AST(找标志性的非终结符)
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

# 字符串分析算法
1. 字典树（哈系树的一种）：处理大量字符串的完整模式匹配(On)
2. KMP：长字符串中找子串（O(m+n)）
3. WildCardL 通配符算法（O(m+n)）长字符串中找子串升级版
4. 正则：做不到O(m+n);字符串通用模式匹配
5. 状态机： 更通用/灵活但手写比例更高的字符串分析
6. LL,LR：字符串多层级结构分析

