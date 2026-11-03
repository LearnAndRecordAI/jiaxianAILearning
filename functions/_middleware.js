// Cloudflare Pages 中间件：整站密码保护（HTTP Basic Auth）。
// 访问任何页面前，浏览器会弹出登录框，密码正确才放行。
//
// 密码来源（优先级）：
//   1) Cloudflare Pages 环境变量 SITE_PASSWORD（推荐，不进代码库）
//   未设置时拒绝访问，不使用硬编码默认密码。
// 用户名不校验（随便填），只校验密码——满足"只要密码"的需求。
//
// 说明：本地 `npm run dev` 不会走这个中间件（仅 Cloudflare/wrangler 生效），
// 所以本地开发不需要密码。

const REALM = 'AI 学习 · 稼先社区'

function unauthorized() {
  return new Response('需要密码访问', {
    status: 401,
    headers: {
      'WWW-Authenticate': `Basic realm="${REALM}", charset="UTF-8"`,
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}

export async function onRequest(context) {
  const { request, env, next } = context
  const expected = env && env.SITE_PASSWORD
  if (!expected) {
    return new Response('请配置 SITE_PASSWORD 环境变量', { status: 503 })
  }

  const header = request.headers.get('Authorization') || ''
  const [scheme, encoded] = header.split(' ')

  if (scheme === 'Basic' && encoded) {
    let decoded = ''
    try {
      decoded = atob(encoded)
    } catch {
      return unauthorized()
    }
    const password = decoded.slice(decoded.indexOf(':') + 1)
    if (password === expected) {
      return next() // 密码正确，放行
    }
  }

  return unauthorized()
}
