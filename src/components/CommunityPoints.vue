<script setup lang="ts">
const rules=[
  ['发帖','发帖',100,'篇'],['发帖','入选思想简报',300,'次'],['发帖','获得评论',15,'条'],['发帖','被分享',15,'次'],['发帖','被收藏',5,'次'],['发帖','被点赞',3,'次'],['发帖','被浏览',1,'人'],
  ['发评论','发评论',15,'条'],['发评论','评论获回复',15,'条'],['发评论','评论获赞',3,'次'],
  ['访问','登录',20,'天'],['访问','分享',15,'次'],['访问','收藏',5,'次'],['访问','点赞',3,'次'],['访问','浏览',1,'篇'],
]
</script>
<template>
  <details class="points-rules"><summary>社区原有积分规则 · 查看完整规则</summary><p>个人账号发帖、评论、登录、分享、收藏、点赞、浏览均可累计积分，每天凌晨自动更新。</p><div class="table-wrap"><table><thead><tr><th>维度</th><th>动作</th><th>积分</th><th>单位</th></tr></thead><tbody><tr v-for="row in rules" :key="`${row[0]}-${row[1]}`"><td v-for="(cell,i) in row" :key="i">{{ cell }}</td></tr></tbody></table></div><p>匿名发帖或评论不发放积分；严禁自动刷积分。上述为社区原有规则，不代表本Demo已接入社区积分系统。</p></details>
</template>
<style scoped>
.points-rules{border:1px solid var(--border);background:var(--surface-2);padding:15px 18px;border-radius:12px;margin:20px 0;color:var(--ink)}summary{cursor:pointer;font-size:13px;font-weight:600;color:var(--accent-ink)}p{font-size:12px;line-height:1.8;color:var(--muted)}.table-wrap{max-height:320px;overflow:auto}table{width:100%;border-collapse:collapse;font-size:12px}td,th{text-align:left;padding:10px 12px;border-bottom:1px solid var(--border)}th{position:sticky;top:0;background:var(--surface-2)}
</style>
