import {getValue} from "../util/ObjectUtil.js";

export function prepareRender(vm , vnode) {
    if (!vnode) return;
    if (vnode.nodeType === 3) {
        analysisTemplateSting(vnode)
    }
    if (vnode.nodeType === 0) {
        setVnode2Template(vnode.data, vnode)
        setTemplate2Vnode(vnode.data, vnode)
    }
    analysisAttr(vm, vnode)
    for (let i = 0; i < vnode.children.length; i++) {
        prepareRender(vm, vnode.children[i]);
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
    console.log(template, 'template')
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
    } else if(vnode.nodeType === 1 && vnode.tag === "INPUT") {
        const templates = vnode2Template.get(vnode);
        if (templates) {
            templates.forEach(item => {
                let templateValue = getTemplateValue([vm._data, vnode.env], item)
                vnode.elm.value = templateValue
            })
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
        let temp = getValue(objs[i], templateName)
        if (temp) {
            return temp
        }
    }
    return null
}

export function renderData(vm, vnode) {
    let vnodes = template2Vnode.get(vnode)
    if (vnodes) {
        vnodes.forEach(item => {
            renderNode(vm, item)
        })
    }
}

function analysisAttr(vm, vnode) {
    if (vnode.nodeType === 1) {
        const attrNames = vnode.elm.getAttributeNames();
        if (attrNames.includes('v-model')) {
            setTemplate2Vnode(vnode.elm.getAttribute('v-model'), vnode)
            setVnode2Template(vnode.elm.getAttribute('v-model'), vnode)
        }
    }
}

export function getVNodeByTemplate(template) {
    console.log(template, template2Vnode,'tep')
    return template2Vnode.get(template)
}

export function clearMap() {
    template2Vnode.clear()
    vnode2Template.clear()
}
