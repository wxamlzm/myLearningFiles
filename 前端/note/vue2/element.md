## message

- message 同步触发两个，会让源码的定位无法校准

```
 this.$message({ message: '保存成功！', type: 'success' })
 this.$message({ message: '保存成功！', type: 'success' })
```
