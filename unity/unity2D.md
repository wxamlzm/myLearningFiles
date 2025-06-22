## Unity 2D 角色创建要点 Memo：

### 1. **GameObject结构理解**
- GameObject不是文件夹，是游戏实体对象
- Player应该是独立对象，不要放在Grid里
- 层级关系表示父子关系，子对象跟随父对象

### 2. **角色基础组件配置**
- Sprite Renderer：显示角色外观
- Rigidbody2D：物理属性（重力、碰撞）
- Collider2D：碰撞检测边界

### 3. **2D渲染层级核心**
- **Z轴坐标不决定2D渲染顺序**
- 真正顺序：Sorting Layer > Order in Layer > 距离
- Player的Order in Layer要比地面更高（如Player=1，Ground=0）

### 4. **选中状态vs实际效果**
- Scene中选中对象显示的红色轮廓是编辑器标记
- 真实游戏效果要取消选中或Play模式查看

### 5. **资源导入验证**
- Assets中能看到彩色资源 = 导入正常
- Sprite Renderer的Color必须是白色(255,255,255,255)才显示原色