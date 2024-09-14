/*
 * @Author: zd
 * @Date: 2023-12-28 09:37:30
 * @LastEditors: zd
 * @LastEditTime: 2023-12-28 09:37:57
 * @Description: 更新一个JSX的例子
 */
const vnode = (
  <div style='max-height: 300px;overflow:auto;'>
    {!isNewContractNull && (
      <div>
        <div>
          新建合约数量：
          <span style='color:#1fb125'>{waitingMateCount}</span>
        </div>
        <div>
          合同变更记录数量：
          <span style='color:#f71717'>{res.option_md_num}</span>
        </div>
      </div>
    )}

    {!isWaitingMateNull && (
      <div style='margin-top:10px'>
        <div>
          已匹配，未推送报单数量：
          <span style='color:#f71717'>{res.no_closing_serial_num}</span>
        </div>
        <div>
          已匹配，已推送报单数量：
          <span style='color:#f71717'>{res.has_closing_serial_num}</span>
        </div>
        <div>
          合同变更记录数量：
          <span style='color:#f71717'>{res.option_md_num}</span>
        </div>
      </div>
    )}

    {!isBondNull && (
      <div style='margin-top:10px;'>
        可转债到期数量：
        <span style='color: #1fb125'>{bondCount}</span>
      </div>
    )}
    {!isBondNull &&
      // 根据数组bondList进行dom遍历
      bondList.map(bondItem => (
        <div>
          可转债:<span>{bondItem.instrument_id}</span> / <span>今日到期</span> /
          合约编号:
          <span>{bondItem.contract_no}</span>
        </div>
      ))}
  </div>
)
