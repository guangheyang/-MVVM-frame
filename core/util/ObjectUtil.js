export function getValue(obj, name) {
    if (!obj) return obj;
    const nameList = name.split('.');
    let temp = obj;
    for (let i = 0; i<nameList.length; i++) {
        if (temp[nameList[i]]) {
            temp = temp[nameList[i]]
        } else {
            return undefined
        }
    }
    return temp
}

export function setValue(obj, data, value) {
    if (!obj) return;
    const attrList = data.split('.');
    const attrLen = attrList.length
    let temp = obj
    for (let i = 0; i < attrLen- 1; i++) {
        if (temp[attrList[i]]) {
            temp = temp[attrList[i]]
        } else {
            return undefined
        }
    }
    if (temp[attrList[attrLen - 1]]) {
        temp[attrList[attrLen - 1]] = value
    }
}

export function mergeAttr(obj1, obj2) {
    if (obj1 === null) return clone(obj2)
    if (obj2 === null) return clone(obj1)
    const result = {}
    const obj1Atts = Object.getOwnPropertyNames(obj1)
    for (let i = 0; i < obj1Atts.length; i++) {
        result[obj1Atts[i]] = obj1[obj1Atts[i]]
     }
    const obj2Atts = Object.getOwnPropertyNames(obj2)
    for (let i = 0; i < obj2Atts.length; i++) {
        result[obj2Atts[i]] = obj2[obj2Atts[i]]
    }
    return result
}

export function clone(obj) {
    // const obj = []
    if (obj instanceof  Array) {
        console.log('array')
        return cloneArray(obj)
    } else if (obj instanceof Object) {
        console.log('object')
        return cloneObject(obj)
    } else {
        return obj
    }
}

function cloneObject(obj) {
    const result = {}
    const names = Object.getOwnPropertyNames(obj)
    for (let i = 0; i < names.length; i++) {
        result[name[i]] = clone(obj[name[i]])
    }
    console.log('obj', obj)
    return result
}

function cloneArray(obj) {
    const result = new Array(obj.length)
    for (let i = 0; i < obj.length; i++) {
        result[i] = clone(obj[i])
    }
    return result
}

export function getEnvAttr(vm, vnode) {
    let result = mergeAttr(vm._data, vnode.env)
    // result = mergeAttr(result, vm._computed)
    return result
}
