import VNode from "../vdom/vnode.js";
import {prepareRender} from "./render.js";
import {vmodel} from "./grammer/vmodel.js";
import {vforInit} from "./grammer/vfor.js";
import {mergeAttr} from "../util/ObjectUtil.js";

export function initMount(Yue) {
    Yue.prototype.$mount = function(el) {
        let vm = this;
        let rootDom = document.getElementById(el);
        mount(vm, rootDom)
    }
}
export function mount(vm, elm) {
    // console.log('begin mount');
    // 进行挂载
    vm._vnode = constructVNode(vm, elm, null);
    // 进行预备渲染
    prepareRender(vm, vm._vnode)
}

// 深度优先搜索
function constructVNode(vm, elm, parent) {
    let vnode = analysisAttr(vm, elm, parent);
    if (!vnode) {
        let children = [];
        let text = getNodeText(elm);
        let data = null;
        let nodeType = elm.nodeType;
        let tag = elm.nodeName;
        vnode = new VNode(tag, elm, children, text, data, parent, nodeType)
        if (elm.nodeType === 1 && elm.getAttribute('env')) {
            vnode.env = mergeAttr(vnode.env, JSON.parse(elm.getAttribute('env')))
        } else {
            vnode.env = mergeAttr(vnode.env, parent ? parent.env : {})
        }
    }
    let childs = vnode.elm.childNodes;
    for (let i = 0; i < childs.length; i++) {
        let childNodes = constructVNode(vm, childs[i], vnode);
        if (childNodes instanceof VNode) { // 返回单一节点
            vnode.children.push(childNodes)
        } else { // 返回节点数组
            vnode.children = vnode.children.concat(childNodes);
        }
    }
    return vnode;
}

function getNodeText(el) {
    if (el.nodeType === 3) {
        return el.nodeValue;
    } else {
        return '';
    }
}

function analysisAttr(vm, elm, parent) {
    if (elm.nodeType === 1) {
        let attrNames = elm.getAttributeNames()
        if (attrNames.includes('v-model')) {
            vmodel(vm, elm, elm.getAttribute('v-model'))
        }
        if (attrNames.includes('v-for')) {
            return vforInit(vm, elm, parent, elm.getAttribute('v-for'))
        }
    }
}

