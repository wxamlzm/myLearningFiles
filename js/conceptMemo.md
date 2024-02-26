# 记录概念上的知识弱点

## 2024 年 2 月 26 日

- js 的类的定义有不少都没有消化，比如下例，没有记住为什么val等数值不需要声明关键字

```
/* 二叉树节点类 */
class TreeNode {
    val; // 节点值
    left; // 左子节点指针
    right; // 右子节点指针
    constructor(val, left, right) {
        this.val = val === undefined ? 0 : val;
        this.left = left === undefined ? null : left;
        this.right = right === undefined ? null : right;
    }
}
```
