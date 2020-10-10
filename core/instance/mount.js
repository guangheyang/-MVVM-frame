import VNode from "../vdom/vnode.js";

export function initMount(Yue) {
    Yue.prototype.$mount = function(el) {
        let vm = this;
        let rootDom = document.getElementById(el);
        mount(vm, rootDom)
    }
}
export function mount(vm, el) {
    // console.log('begin mount');
    // 进行挂载
    vm._vnode = constructVNode(vm, el, null);
    console.log(vm, '_node')
    // 进行预备渲染
}

// 深度优先搜索
function constructVNode(vm, elm, parent) {
    let vnode = null;
    let children = [];
    let text = getNodeText(elm);
    let data = null;
    let nodeType = elm.nodeType;
    let tag = elm.nodeName;
    vnode = new VNode(tag, elm, children, text, data, parent, nodeType)
    let childs = vnode.elm.childNodes;
    console.log(childs.length, 'childs')
    for (let i = 0; i < childs.length; i++) {
        let childNodes = constructVNode(vm, childs[i], vnode);
        if (childNodes instanceof VNode) { // 返回单一节点
            vnode.children.push(childNodes)
        } else { // 返回节点数组
            vnode.children = vnode.children.concat(childNodes);
        }
    }
    console.log(vnode, 'node')
    return vnode;
}

function getNodeText(el) {
    if (el.nodeText == 3) {
        return el.nodeValue;
    } else {
        return '';
    }
}