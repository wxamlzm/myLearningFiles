<!--
 * @Author: zd
 * @Date: 2023-10-20 13:50:42
 * @LastEditors: zd
 * @LastEditTime: 2023-10-20 13:58:04
 * @FilePath: \learningFiles\note\gitconfig\关于github的配置问题.md
 * @Description: 
-->
## 起因
- 因为期望git用起来丝滑一些，研究了多账号的git配置，希望记录一下;


## includeIf
- .gitconfig文件，是github的配置文件，默认路径在`C:\Users\用户名\.gitconfig`
- 暂时我还没找到怎么改默认路径的方法，现在的默认路径我其实挺不喜欢的，不是很容易管理;
- 初始的.gitconfig，在用常规配置user.name和user.email后，会在.gitconfig的文件里生成一个名值对,key为user
- 而多账户管理需要删除默认的user名值对，而用关键词```includeIf``` 对条件进行判断来读取不同的user配置文件
- 截止当前git版本2.35.1，```includeIf``` 只支持文件名目录的判断，或者我只会这种;
- 而读取的user配置文件，目前也需要.gitconfig格式，我是用复制的，然后改了名字;我暂时还不知道怎么自行创建.gitconfig
- 在```includeIf```的判断条件后的```path```后的路径，需要加上文件名后缀，没有的我试过不行


## 关于includeIfexample文件夹
- 同目录的文件夹下面是配置的例子

## 等熟练了这玩意就删了吧，没意思
