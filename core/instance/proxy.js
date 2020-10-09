export function constructProxy(vm, obj, namespace) {
    // vm 表示Yue对象
    // obj表示要进行代理的对象
    // namespace
    let proxyObj = null;
    if (obj instanceof Array) {
        proxyObj = new Array(obj.length);
        for (let i = 0; i < obj.length; i++) {
            proxyObj[i] = constructProxy(vm, obj[i], namespace)
        }
        proxyObj = proxyArr(vm, obj, namespace)
    } else if (obj instanceof Object) {
        proxyObj = constructObjectProxy(vm, obj, namespace)
    } else {
        throw new Error('error');
    }
    return proxyObj;
}

function constructObjectProxy(vm, obj, namespace) {
    let proxyObj = {};
    for (let prop in obj) {
        console.log(prop);
        Object.defineProperty(proxyObj, prop, {
            configurable: true,
            get() {
                return obj[prop];
            },
            set: function(value) {
                console.log(getNameSpace(namespace, prop))
                obj[prop] = value
            }
        })
        Object.defineProperty(vm, prop, {
            configurable: true,
            get() {
                return obj[prop];
            },
            set: function(value) {
                console.log(getNameSpace(namespace, prop))
                obj[prop] = value
            }
        })
        if (obj[prop] instanceof Object) {
            proxyObj[prop] = constructProxy(vm, obj[prop], getNameSpace(namespace, prop));
        }
    }
    return proxyObj;
}

function getNameSpace(nowNameSpace, nowProp) {
    if (nowNameSpace == null || nowNameSpace == '') {
        return nowProp
    } else if (nowProp == null || nowNameSpace == '') {
        return nowNameSpace
    } else {
        return nowNameSpace + '.' + nowProp
    }
}

function proxyArr(vm, arr, namespace) {
    let obj = {
        eleType: 'Array',
        toString: function() {
            let result = '';
            for (let i = 0; i < arr.length; i++) {
                result += arr[i] + '';
            }
            return result.substring(0, result.length - 2);
        },
        push() {},
        pop() {},
        shift() {},
        unshift() {}
    }
    defArrayFunc.call(vm, obj, 'push', namespace, vm);
    defArrayFunc.call(vm, obj, 'pop', namespace, vm);
    defArrayFunc.call(vm, obj, 'shift', namespace, vm);
    defArrayFunc.call(vm, obj, 'unshift', namespace, vm);
    arr.__proto__ = obj;
    return arr;
}

const arrayProto = Array.prototype;
function defArrayFunc(obj, func, namespace, vm) {
    Object.defineProperty(obj, func, {
        enumerable: true,
        configurable: true,
        value: function(...args) {
            let original = arrayProto[func]
            const result = original.apply(this, args);
            console.log(getNameSpace(namespace, ''))
            return result;
        }
    })

}
