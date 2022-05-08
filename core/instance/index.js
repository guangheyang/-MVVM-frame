import {initMixin} from "./init.js";
import {renderMixin} from "./render.js"

function Yue(options) {
 this._init(options)
 this._render(options)
}
initMixin(Yue);
renderMixin(Yue);

export default Yue;
