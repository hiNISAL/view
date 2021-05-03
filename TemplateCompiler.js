// 模板编译类
import CompileTool from './CompileTool.js';
import Watcher from './Watcher.js';

class TemplateCompile {
  constructor(el, vm) {
    this.el = (
      el.nodeType === 1
        ? el
        : document.querySelector(el)
    );

    this.vm = vm;

    // 如果元素存在就开始编译
    if (this.el) {
      const fragment = this.nodeToFragment(this.el);

      // 解析模板语法
      this.compile(fragment);

      // 把编译好的dom放回根结点
      this.el.appendChild(fragment);
    }
  }

  nodeToFragment(el) {
    const fragment = document.createDocumentFragment();

    let firstChild = null;

    while(firstChild = el.firstChild) {
      fragment.appendChild(firstChild);
    }

    return fragment;
  }

  compile(fragment) {
    const childNodes = fragment.childNodes;

    Array.from(childNodes).forEach((node) => {
      // 一些dom节点
      if (node.nodeType === 1) {
        this.compile(node);

        // 处理内容
        this.compileDOMElement(node);
      } else {
        // 如果是文本节点
        // 单独处理文本节点
        this.compileTextNode(node);
      }
    });
  }

  // 处理文本节点
  compileTextNode(node) {
    const exp = node.textContent;

    const reg = /{{[^}]+}}/g

    const matched = exp.match(reg);

    if (matched) {
      // 渲染数据
      CompileTool.text(node, this.vm, exp);
    }
  }

  // 处理dom节点
  compileDOMElement(node) {
    // 取出所有属性
    const attrs = node.attributes;

    // 遍历所有属性
    Array.from(attrs).forEach((attr) => {
      const { name } = attr;

      if (name.includes('v-')) {
        // 如果是指令
        const exp = attr.value;
        // 取出指令
        const type = name.split('-')[1];

        CompileTool[type](node, this.vm, exp);
      }
    });
  }
}

export default TemplateCompile;
