import Watcher from './Watcher.js';

const update = {
  modelUpdate(node, val) {
    node.value = val;
  },
  textUpdate(node, val) {
    node.textContent = val;
  },
};

// 根据字符串获取对象里的值
const getDataValue = (vm, exp) => {
  const split = exp.split('.');

  const result = split.reduce((prev, next) => {
    return prev[next];
  }, vm.$data);

  return result;
};

// 更新 vm 中的data
const setDataValue = (vm, exp, value) => {
  const split = exp.split('.');
  const splitLen = split.length - 1;

  split.reduce((prev, next, curIdx) => {
    if (curIdx === splitLen) {
      prev[next] = value;
    }

    return prev[next];
  }, vm.$data);
};

// 去掉 {{}} 并获取其中的值
const getTextNodeExpValue = (vm, exp) => {
  return exp.replace(/{{([^}]+)}}/g, (...args) => {
    const expMatched = args[1];
    const result = getDataValue(vm, expMatched);

    return result;
  });
};

// 指令和工具方法
const CompileTool = {
  // 处理 v-model 指令
  model(node, vm, exp) {
    exp = exp.replace(/\s*/g, '');

    // 获取 data 里的的对应值
    const val = getDataValue(vm, exp);

    // 坚挺变化，决定是否更新世图
    new Watcher();

    // 给input绑定事件 (目前只支持input，所以不做if - else分发了)
    node.addEventListener('input', (e) => {
      const newVal = e.target.value;

      // 同步到 vm 的data里
      setDataValue(vm, exp, newVal);
    });

    // 初始化值
    update.modelUpdate(node, val);
  },
  // 处理文本节点的模板字符串
  text(node, vm, exp) {
    exp = exp.replace(/\s*/g, '');

    // 获取 data 里的的对应值
    const val = getTextNodeExpValue(vm, exp);

    // 使用正则替换模板表达式 并更新页面
    exp.replace(/{{([^}]+)}}/g, (...args) => {
      new Watcher();
    });

    // 初始化模板中的表达式
    update.textUpdate(node, val);
  },
};

export default CompileTool;
