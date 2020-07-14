- 组件化的核心理念是如何用合适的js去实现attribute/property/children等，即如何实现createElement。
- jsx 是有能力区分attribute和property的，只是react选择让他们一致。
- jsx相当于语法糖，让我们可以写像html一样的js语言，帮我们构建了树结构。

> 组件化难点：组件化机制/组件化本身
 
### 让carousel的图片动起来有两种思路：
- 1.整体把图片一张一张右移：会一直transform；只能往一个方向transform，transform的面积会增大
- 2.只移动当前应该展示的两张