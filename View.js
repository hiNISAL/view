import TemplateCompiler from './TemplateCompiler.js';
import Observer from './Observer.js';
import Emitter from './Emitter.js';

class View {
  constructor(options) {
    // 获取元素和data数据
    this.$el = options.el;
    this.$data = options.data;

    // 如果有模板，就编译模板
    if (this.$el) {
      // 1. 数据劫持 或者说数据响应式
      new Observer(this.$data);

      // 2. 编译模板
      new TemplateCompiler(this.$el, this);
    }
  }
}

export default View;
