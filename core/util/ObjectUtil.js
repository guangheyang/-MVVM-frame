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
