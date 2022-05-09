import {setValue} from "../../util/ObjectUtil.js";

export function vmodel(vm, elm, data) {
    elm.onchange = function(event) {
        // Yue对象，该元素绑定的属性，该元素新的value
        setValue(vm._data, data, elm.value)
    }
}
