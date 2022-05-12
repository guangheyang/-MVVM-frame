import {initMixin} from "./init.js";
import {renderMixin} from "./render.js"

function Yue(options) {
 this._init(options)
 if (this._created) {
  this._created.call(this)
 }
 this._render(options)
}
initMixin(Yue);
renderMixin(Yue);

export default Yue;
