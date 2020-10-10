export default class VNode {
    // tag 标签类型
    // ele 对应真实节点
    // children 当前节点下的子节点
    // text 当前虚拟节点的文本
    // parent 父级节点
    // nodeType 节点类型
    constructor(tag, elm, children, text, data, parent, nodeType) {
        this.tag = tag;
        this.elm = elm;
        this.children = children;
        this.text = text;
        this.data = data;
        this.parent = parent;
        this.nodeType = nodeType;

        // 当前节点的环境变量
        this.env = {};

        // 存放指令
        this.instructions = null;

        // 当前节点涉及到的模板
        this.template = [];
    }
}