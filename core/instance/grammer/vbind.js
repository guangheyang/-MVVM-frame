import {getValue} from "../../util/ObjectUtil.js";
import {getEnvAttr} from "../../util/ObjectUtil.js";
import {generateCode, isTrue} from "../../util/code.js";

export function checkVBind(vm, vnode) {
    if (vnode.nodeType === 1) {
        const attrNames = vnode.elm.getAttributeNames()
        attrNames.forEach(attr => {
            if (attr.startsWith('v-bind') || attr.startsWith(':')) {
                vBind(vm, vnode, attr, vnode.elm.getAttribute(attr))
            }
        })
    }
}

function vBind(vm, vnode, name, value) {
    const K = name.split(":")[1]
    if (/^{[\w\W]+}$/.test(value)) {
        const str = value.substring(1, value.length - 1).trim()
        const expressionList = str.split(',')
        const result = analysisExpression(vm, vnode, expressionList)
        vnode.elm.setAttribute(K, result)
    } else {
        const V = getValue(vm._data, value)
        vnode.elm.setAttribute(K, V)
    }
}

function analysisExpression(vm, vnode, expressionList) {
    // 获取当前环境变量
    let attr = getEnvAttr(vm, vnode)
    // 判断表达式成立
    let envCode = generateCode(attr)
    console.log(envCode)
    // 拼接result
    let result = ''
    expressionList.forEach(item => {
        const size = item.indexOf(":");
        if (size > -1) {
            const code = item.substring(size + 1, item.length)
            console.log(isTrue(code, envCode))
            if (isTrue(code, envCode)) {
                result += item.substring(0, size) + ','
            }
        } else {
            result += item + ","
        }
    })
    if (result.length > 0) {
        result = result.substring(0, result.length - 1)
    }
    return result
}
