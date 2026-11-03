<script setup lang="ts">
import {ref} from 'vue'
import {useGrowth} from '../composables/useGrowth'
import mascot from '../assets/mascot/jiaxiaozhi.jpg'
defineProps<{mode:'pet'|'print'}>()
const emit=defineEmits<{(e:'close'):void}>()
const {growth}=useGrowth()
const notice=ref('')
function adopt(){growth.pet.claimed=true;growth.pet.enabled=true;notice.value='稼小智已领取，频道内陪伴已开启。'}
function save(){growth.print.saved=true;notice.value='定制草稿已保存在当前浏览器，未提交打印订单。'}
</script>
<template>
 <section class="studio">
  <div class="studio-head"><div><span class="kicker">{{ mode==='pet'?'YOUR LEARNING BUDDY':'3D PRINTING HOUSE' }}</span><h2>{{ mode==='pet'?'领养稼小智，让学习多一个伙伴':'3D打印屋 · 把热爱变成手办' }}</h2></div><button @click="emit('close')">返回</button></div>
  <div class="studio-grid"><div class="mascot-stage" :class="[mode==='pet'?'pet-stage':'',mode==='print'?growth.print.color:'']"><span class="stage-label">{{ mode==='pet'?'基础款 · 稼小智':'配色示意 · 非3D模型预览' }}</span><img :src="mascot" alt="红白配色稼小智机器人，坐在学AI书本上"/><div class="stage-caption">{{ mode==='pet'?(growth.pet.name||'稼小智'):growth.print.text }}</div></div>
   <div class="studio-copy" v-if="mode==='pet'">
    <span class="pill">频道学习宠物 · 基础款</span><h3>你好呀，我是稼小智！</h3><p>陪你学一点、试一下、分享一个新发现。每一步成长，都有我在。</p>
    <div class="buddy-features"><span>✦ 轻轻浮动，安静陪伴</span><span>✓ 学习进度，随时看看</span><span>♡ 专属昵称，由你来定</span></div>
    <label for="pet-name">给伙伴取个名字</label><input id="pet-name" v-model="growth.pet.name" maxlength="12" placeholder="稼小智"/>
    <button v-if="!growth.pet.claimed" class="primary large" @click="adopt">免费领取稼小智</button>
    <template v-else><div class="adopted">✓ 已领取 · {{ growth.pet.name||'稼小智' }}</div><label class="toggle"><input type="checkbox" v-model="growth.pet.enabled"/> 开启频道内学习陪伴</label></template>
    <p class="boundary">当前为网页内演示宠物，不会安装桌面程序、跨应用悬浮或读取屏幕。后续桌面版需另行开发与授权。</p>
   </div>
   <div class="studio-copy" v-else>
    <span class="pill">月榜第1—10名奖励 · 获奖后解锁制作</span><h3>你的稼小智，你来定义</h3><p>先选喜欢的配色，再写一句底座寄语。大家均可预览，真实制作需核验获奖资格。</p>
    <fieldset><legend>01 / 手办配色</legend><div class="colors"><button v-for="color in [{id:'red',label:'经典红'},{id:'blue',label:'科技蓝'},{id:'purple',label:'灵感紫'}]" :key="color.id" :class="{selected:growth.print.color===color.id}" :aria-pressed="growth.print.color===color.id" @click="growth.print.color=color.id;growth.print.saved=false"><i :class="color.id"></i>{{ color.label }}</button></div></fieldset>
    <label for="figure-text">02 / 底座寄语（最多16字）</label><input id="figure-text" v-model="growth.print.text" maxlength="16" @input="growth.print.saved=false"/>
    <button class="primary large" @click="save">{{ growth.print.saved?'更新定制草稿':'保存定制草稿' }}</button>
    <div class="production"><b>制作流程</b><p>月榜结算 → 核验资格 → 确认定制 → 排期打印 → 领取手办</p></div>
    <p class="boundary">入口预留：尚未接入真实3D打印平台。当前仅为图片配色示意，不生成可打印模型、不收集地址、不提交订单。</p>
   </div>
  </div><p v-if="notice" class="result" role="status">{{ notice }}</p>
 </section>
</template>
<style scoped>
.studio{padding:28px;border:1px solid var(--border);border-radius:18px;background:var(--surface);color:var(--ink)}.studio-head{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:24px}.kicker{font-size:11px;letter-spacing:2px;color:var(--accent-ink)}h2{font-size:23px;margin:8px 0}h3{font-size:27px;margin:18px 0 12px}.studio-grid{display:grid;grid-template-columns:1fr 1fr;gap:38px}.mascot-stage{position:relative;background:#fff;border:1px solid var(--border);border-radius:20px;overflow:hidden;align-self:start}.mascot-stage img{display:block;width:100%;aspect-ratio:1;object-fit:contain}.stage-label{position:absolute;left:16px;top:16px;border-radius:20px;padding:7px 11px;font-size:11px;background:#f1f2f8;color:#5a6379;z-index:1}.stage-caption{text-align:center;padding:0 16px 20px;color:#4b5367;font-weight:600}.blue img{filter:hue-rotate(220deg)}.purple img{filter:hue-rotate(280deg)}.pet-stage img{animation:breathe 4s ease-in-out infinite}.pill{display:inline-block;font-size:11px;padding:6px 10px;border-radius:20px;background:var(--surface-2);color:var(--accent-ink);border:1px solid var(--accent-line)}.studio-copy p{font-size:13px;line-height:1.9;color:var(--muted)}.buddy-features{display:grid;gap:12px;padding:15px 0 22px;font-size:13px;color:var(--ink-2)}button,input{font:inherit}button{border:1px solid var(--border);background:var(--surface-2);color:var(--ink);padding:9px 14px;border-radius:9px;cursor:pointer;font-size:13px}.primary{background:var(--accent);color:white;border-color:var(--accent)}.large{display:block;margin-top:22px;padding:12px 25px;font-weight:600}label,legend{display:block;font-size:13px;margin:14px 0 10px}input:not([type=checkbox]){box-sizing:border-box;width:100%;padding:12px 14px;background:var(--surface-2);color:var(--ink);border:1px solid var(--border-strong);border-radius:9px;font-size:14px}.toggle{display:flex;align-items:center;gap:8px}.adopted{margin-top:20px;color:var(--accent-ink);font-weight:600}.studio-copy .boundary{font-size:11px;padding-top:14px}.production{margin-top:22px;padding:16px;background:var(--surface-2);border-radius:12px;font-size:13px}.production p{font-size:12px;margin-bottom:0}fieldset{border:0;padding:0;margin:0}.colors{display:flex;flex-wrap:wrap;gap:8px}.colors button{display:flex;align-items:center;gap:6px}.colors .selected{border-color:var(--accent);color:var(--accent-ink)}i{width:12px;height:12px;border-radius:50%;display:inline-block}i.red{background:#ef383b}i.blue{background:#527cea}i.purple{background:#a566d8}.result{font-size:13px;padding:12px 16px;background:var(--surface-2);color:var(--accent-ink);border-radius:10px}@keyframes breathe{50%{transform:translateY(-6px)}}@media(prefers-reduced-motion:reduce){.pet-stage img{animation:none}}@media(max-width:720px){.studio{padding:18px}.studio-grid{grid-template-columns:1fr;gap:20px}.mascot-stage{max-width:360px;margin:auto;width:100%}h2{font-size:19px}h3{font-size:23px}}
</style>
