#import <Foundation/Foundation.h>
#import <JavaScriptCore/JavaScriptCore.h>

int main(int argc, const char * argv[]){
    @autoreleasepool{
        //insert code here
        //Create a JS engien instance:
        //  JSContext* like object in js
        //  context :jsengien instance
        //  alloc : GET A memory
        //var context = new JSContext;
        JSContext* context = [[JSContext alloc ]init];

        //context.eval("")
        JSValue* result = [context evaluateScript:@""];

        //console.log(result.toString())
        NSLog(@"%@",[result toString]);
    }
    return 0;
}