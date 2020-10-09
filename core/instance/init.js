import { constructProxy } from './proxy.js'

let uid = 0;
export function initMixin(Yue) {
    Yue.prototype._init = function(options) {
        const vm = this;
        vm.uid = uid ++;
        vm._isYue = true;
        // 初始化data
        console.log(options, 'data')
        if (options && options.data) {
            vm._data = constructProxy(vm, options.data, "");
        }
    }
}
