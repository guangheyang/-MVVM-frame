import {getValue} from "../util/ObjectUtil.js";

export function perpareRender(vm , vnode) {
    if (vnode === null) return;
    if (vnode.nodeType === 3) {
        analysisTemplateSting(vnode)
    }
    if (vnode.nodeType === 1) {
        for (let i = 0; i < vnode.children.length; i++) {
            perpareRender(vm, vnode.children[i]);
        }
    }
}

function analysisTemplateSting(vnode) {
    let templateStringList = vnode.text.match(/{{[0-9A-z_.$ ]+}}/g)
    for (let i = 0; templateStringList && i < templateStringList.length; i++) {
        setTemplate2Vnode(templateStringList[i], vnode)
        setVnode2Template(templateStringList[i], vnode)
    }
}

let template2Vnode  = new Map()
let vnode2Template  = new Map()

function setTemplate2Vnode(template, vnode) {
    const templateName = setTemplateName(template)
    const vnodeSet = template2Vnode.get(templateName)
    if (vnodeSet) {
        vnodeSet.push(vnode)
    } else {
        template2Vnode.set(templateName, [vnode])
    }
}

function setVnode2Template(template, vnode) {
    const templateName = setTemplateName(template)
    const templateSet = vnode2Template.get(vnode)
    if (templateSet) {
        templateSet.push(templateName)
    } else {
        vnode2Template.set(vnode, [templateName])
    }
}

function setTemplateName(template) {
    if (template.startsWith('{{') && template.endsWith('}}')) {
        return template.substring(2, template.length - 2).trim()
    } else {
        return template
    }
}

export const getTemplate = {
    setVnodeTemplate() {
        return vnode2Template
    },
    setTemplateVnode() {
        return template2Vnode
    }
}

export function renderNode(vm, vnode) {
    if (vnode.nodeType === 3) {
        const templates = vnode2Template.get(vnode);
        if (templates) {
            let result = vnode.text
            templates.forEach(item => {
                let templateValue = getTemplateValue([vm._data, vnode.env], item)
                if (templateValue) {
                    const startIndex = result.indexOf('{{')
                    const endIndex = result.indexOf('}}')
                    result = result.replace(result.substring(startIndex, endIndex + 2), templateValue)
                }
            })
            vnode.elm.nodeValue = result
        }
    } else {
        for(let i = 0; i < vnode.children.length; i++) {
            renderNode(vm, vnode.children[i])
        }
    }
}

export function renderMixin(Yue) {
    Yue.prototype._render = function () {
        renderNode(this, this._vnode)
    }
}

function getTemplateValue(objs, templateName) {
    for (let i = 0; i < objs.length; i++) {
        let temp = getValue(objs[i], templateName.trim())
        if (temp !== null) {
            return temp
        }
    }
    return null
}

export function renderData(vm, vnode) {
    console.log(vnode, 'node')
    let vnodes = template2Vnode.get(vnode)
    console.log(vnodes, 'vnode')
    if (vnodes) {
        vnodes.forEach(item => {
            console.log(item, 'item')
            renderNode(vm, item)
        })
    }
}
