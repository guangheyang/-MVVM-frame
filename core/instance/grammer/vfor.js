import VNode from "../../vdom/vnode.js";
import {getValue} from "../../util/ObjectUtil.js";

export function vforInit(vm, elm, parent, instructions) {
    const virtualNode = new VNode(elm.nodeName, elm, [], "", getVirtualNodeData(instructions)[2], parent, 0)
    virtualNode.instructions = instructions
    parent.elm.removeChild(elm)
    parent.elm.appendChild(document.createTextNode(""))
    const resultSet = analysisInstructions(vm, elm, parent, instructions);
    return virtualNode;
}

function getVirtualNodeData(instructions){
    return instructions.trim().split(' ')
}

function analysisInstructions(vm, elm, parent, instructions) {
    const insSet = getVirtualNodeData(instructions)
    const dataSet = getValue(vm._data, insSet[insSet.length -1])
    if (!dataSet) {
        throw new Error('error')
    }
    const resultSet = []
    for (let i = 0; i < dataSet.length; i++) {
        let tempDom = document.createElement(elm.nodeName)
        tempDom.innerHTML = elm.innerHTML
        let env = analysisKV(insSet[0], dataSet[i], i)
        tempDom.setAttribute('env', JSON.stringify(env))
        parent.elm.appendChild(tempDom)
        resultSet.push(tempDom)
    }
    return resultSet
}

function analysisKV(instructions, value, index) {
    if (/([A-z0-9.$]+)/.test(instructions)) {
        instructions = instructions.trim()
        instructions = instructions.substring(1, instructions.length - 1)
    }
    const keys = instructions.split(',')
    if (keys.length === 0) {
        throw new Error('error')
    }
    let obj = {}
    obj[keys[0].trim()] = value
    if (keys.length >= 2) {
        obj[keys[1].trim()] = index
    }
    return obj
}
