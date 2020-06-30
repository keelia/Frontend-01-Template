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

# 字典树Trie
特点：每个节点都有a-z的26个分支（每个分支可能是空），每一层表示字符串的1位
好处：可以比较字符串的顺序（最大/小匹配的分支），如果在每个节点上标注数量，可以知道每个字符串出现了多少次

# 括号匹配
x[a(b)x]y 检查括号是否完整/可匹配

# LL : 从左到右一路，从左到右合并
# LR : 从左到右一路，从右到左合并

# wildcard:
    * 表示若干个任意字符
    ？ 表示单个任意字符
    只有*和？，注意区别正则
## 注意：
1. 多个*，最后一个*尽量匹配多，其他*都尽量少匹配
2. *和后面的字母作为一组pattern，用kmp去查找
3. ？跟字母相似

optional作业：实现带？的kmp
