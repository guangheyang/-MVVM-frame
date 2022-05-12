import {getValue} from "../../util/ObjectUtil.js";

export function checkVOn(vm ,vnode) {
    if (vnode.nodeType === 1) {
        const attrNames = vnode.elm.getAttributeNames()
        for (let i = 0; i < attrNames.length; i++) {
            if (attrNames[i].includes('v-on') || attrNames[i].includes('@')) {
                von(vm, vnode, attrNames[i].split(':')[1], vnode.elm.getAttribute(attrNames[i]))
            }
        }
    }
}

function von(vm, vnode, event, name) {
    let method = getValue(vm._methods, name)
    if (method) {
        vnode.elm.addEventListener(event, proxyEvecute(vm, method))
    }
}

function proxyEvecute(vm, method) {
    return function () {
        method.call(vm)
    }
}
