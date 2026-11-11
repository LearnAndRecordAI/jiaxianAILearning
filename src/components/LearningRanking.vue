<script setup lang="ts">
import {computed} from 'vue'
import {useLearning,timeLabel} from '../composables/useLearning'
import {useGrowth} from '../composables/useGrowth'
import {periodTaskPoints} from '../utils/growth.mjs'
import {personalStanding} from '../utils/ranking.mjs'
const {state,month}=useLearning()
const {growth}=useGrowth()
const seconds=computed(()=>Object.entries(state.seconds).filter(([day])=>day.startsWith(month.value+'-')).reduce((sum,[,n])=>sum+n,0))
const points=computed(()=>periodTaskPoints(growth,month.value))
// Synthetic local fixtures only. Production must request a server-side personal
// summary; never send a real employee leaderboard to an ordinary user's browser.
const standing=computed(()=>personalStanding([...Array.from({length:120},(_,i)=>({id:`demo-${String(i+1).padStart(3,'0')}`,seconds:(120-i)*630,points:((i*17+9)%25)*50})),{id:'me',seconds:seconds.value,points:points.value}],'me'))
</script>
<template>
 <section class="personal-ranking">
  <header><div><h2>我的月度排名</h2><p>{{ month }} · 北京时间自然月</p></div><span class="demo">本机模拟 · 不实际发奖</span></header>
  <div class="personal-stats">
   <article><span>本月有效学习时长</span><strong>{{ timeLabel(seconds) }}</strong><p>每天学一点，进步看得见</p></article>
   <article><span>学习时长排名 · TOP 100</span><strong>{{ standing.timeRank?'第 '+standing.timeRank+' 名':'暂未上榜' }}</strong><p>{{ standing.eligible?'已进入前100名，继续保持！':standing.gap!==null?'离上榜还差 '+standing.gap+' 名':'开始有效学习后，即可查看上榜差距' }}</p></article>
   <article><span>百人内积分排名 · TOP 20</span><strong>{{ standing.pointRank?'第 '+standing.pointRank+' 名':standing.eligible?'暂未进入前20':'暂未入围' }}</strong><p>{{ standing.eligible?'本月成长任务积分 '+points+' · 完成任务争取追加礼':'先进入学习时长前100名，再参与积分评选' }}</p></article>
  </div>
  <section class="gifts" aria-label="月榜奖励规则">
   <h3>🎁 月榜前100名有礼</h3>
   <p class="base"><b>① 学习时长前100名每人稼啡码×2</b></p>
   <p>② 前100人中，按本月成长任务积分追加奖励：</p>
   <div class="gift"><span class="medal">🏆</span><div><b>积分第1—10名</b><p>稼先周边毛毯/保温杯＋3D定制化打印摆件＋AI学习类书籍</p><span class="coming">🖨️ 3D打印屋待开放，敬请期待～</span></div></div>
   <div class="gift"><span class="medal">🎒</span><div><b>积分第11—20名</b><p>稼先周边背包/雨伞＋AI学习类书籍</p></div></div>
  </section>
  <details class="rules"><summary>排名与积分统计说明</summary><ul>
   <li>用户仅可查看本人排名及差距，不展示其他用户的姓名、时长或积分；完整榜单仅供管理员在受控后台查看。</li>
   <li>先按本月有效学习时长选前100人，再在入围者中按本月成长任务积分选前20人。追加礼保留稼啡码×2，两档追加礼不叠加。“/”为备选品类，最终以运营公布为准。</li>
   <li>任务每天北京时间00:00刷新，每项每日限领一次；月积分累计不清零，签到额外积分和全站历史积分不参与本榜。兑换不影响已获得积分的排名。</li>
   <li>分钟保留1位小数向下显示，排序用实际秒数。积分相同先比有效学习时长；演示完全同分按稳定ID补序，正式同分与边界规则需运营确认后公示。</li>
   <li>本页仅为模拟。尚无管理员后台或真实鉴权；正式上线需由服务端仅返回本人摘要，并对管理员榜单接口进行权限校验。月末审核异常学习、无效投稿后发奖。</li>
  </ul></details>
 </section>
</template>
<style scoped>
.personal-ranking{padding:24px;border:1px solid var(--border);border-radius:16px;background:var(--surface);color:var(--ink)}header{display:flex;align-items:center;justify-content:space-between;gap:16px}h2{font-size:19px;margin:0}header p{font-size:12px;color:var(--muted);margin:8px 0}.demo{font-size:11px;border:1px solid var(--border);padding:6px 10px;border-radius:20px;color:var(--muted)}.personal-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin:20px 0}.personal-stats article{background:var(--surface-2);border-radius:12px;padding:20px}.personal-stats span{font-size:12px;color:var(--muted)}.personal-stats strong{display:block;color:var(--accent-ink);font-size:23px;margin:13px 0}.personal-stats p{font-size:12px;color:var(--muted);line-height:1.8;margin:0}.gifts{border:1px solid var(--accent-line);border-radius:12px;padding:22px}.gifts h3{font-size:18px;margin:0 0 18px}.gifts>p{font-size:13px;line-height:1.8}.base{color:var(--accent-ink)}.gift{display:flex;gap:14px;margin-top:18px}.medal{font-size:24px}.gift b{font-size:14px}.gift p{font-size:13px;line-height:1.8;margin:6px 0;color:var(--ink-2)}.coming{display:inline-block;font-size:12px;padding:6px 10px;border-radius:8px;background:var(--surface-2);color:var(--muted)}.rules{margin-top:20px;font-size:12px;color:var(--muted);line-height:1.9}.rules summary{cursor:pointer;color:var(--accent-ink)}.rules ul{padding-left:20px}@media(max-width:720px){.personal-ranking{padding:16px}.personal-stats{grid-template-columns:1fr;gap:10px}.personal-stats article{padding:15px}.personal-stats strong{font-size:21px;margin:8px 0}header{flex-wrap:wrap;gap:6px}.gifts{padding:16px}}
</style>
