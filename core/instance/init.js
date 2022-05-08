import {constructProxy} from './proxy.js';
import {mount} from './mount.js';

let uid = 0;

export function initMixin(Yue) {
    Yue.prototype._init = function (options) {
        const vm = this;
        vm.uid = uid++;
        vm._isYue = true;
        // 初始化data
        if (options && options.data) {
            vm._data = constructProxy(vm, options.data, "");
        }

        // 初始化el挂载
        if (options && options.el) {
            let rootDom = document.getElementById(options.el);
            mount(vm, rootDom)
        }
    }
}
