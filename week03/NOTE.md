## 可以实现的但有些属性不同于正常对象(ordinary object)的对象：
[Bound Function Exotic Objects]
    Additional Properties:
        [[BoundTargetFunction]]
        [[BoundThis]]
        [[BoundArguments]]
[Array Exotic Object]
    Additional Properties:
        Length(data property)
    1. whenever an own property is added whose name is an array index, the value of the "length" property is changed,
        var a = []
        console.log(a.length)//0
        a[2] = void 0;
        console.log(a.length)//3
    2.whenever the value of the "length" property is changed, every own property whose name is an array index whose value is not smaller than the new length is deleted
        a.length = 2
        a// [empty × 2]

[String Exotic Object]
    have 2 kinds of data properties. Both of them are non-writable and non-configurable.
        1: integer-indexed data properties
        2: length data properties

[Arguments Exoitc Object]
    [[ParameterMap]]:
        They also have a [[ParameterMap]] internal slot. Ordinary arguments objects also have a [[ParameterMap]] internal slot whose value is always undefined.

    1. Object.prototype.toString.apply(arguments) :[object Arguments]
    2. An arguments exotic object is an exotic object whose array index properties map to the formal parameters bindings of an invocation of its associated ECMAScript function.
        function argFunc(a,b,c){
            arguments[2] = 5 //Or  c = 5
            console.log(arguments[2],c)//5,5
        }
        argFunc(1,'2',void 0,null,{x:1},[2,3,4])

[Integer-Indexed(an integer index whose numeric value i is in the range +0 ≤ i < 232 - 1) Exotic Objects]:
    Additional Properties:
        [[ViewedArrayBuffer]]
        [[ArrayLength]]
        [[ByteOffset]]
        [[TypedArrayName]] 
    TypedArray instances are Integer-Indexed exotic objects. Each TypedArray instance inherits properties from the corresponding TypedArray prototype object. Each TypedArray instance has the following internal slots: [[TypedArrayName]], [[ViewedArrayBuffer]], [[ByteLength]], [[ByteOffset]], and [[ArrayLength]].

[Module Namespace Exotic Objects]
    Additional Properties:
        [[Module]]
        [[Exports]]
        [[Prototype]] :Always null
    1.Module namespace objects are not extensible.

[Proxy Object]:
    Additional Properties:
        [[ProxyHandler]]
        [[ProxyTarget]]
    1.When a proxy is revoked, its [[ProxyHandler]] and [[ProxyTarget]] internal slots are set to null causing subsequent invocations of internal methods on that proxy object to throw a TypeError exception.

## 无法实现的对象
[Immutable Prototype Exotic Objects]:An immutable prototype exotic object is an exotic object that has a [[Prototype]] internal slot that will not change once it is initialized.

