import asyncio, json
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b = await p.chromium.launch(executable_path=r"C:\Program Files\Google\Chrome\Application\chrome.exe")
    pg = await b.new_page(viewport={"width":1440,"height":900})
    await pg.goto("http://127.0.0.1:5201/#/docs/introduction"); await pg.wait_for_timeout(1500)
    slugs = await pg.evaluate("()=>[...document.querySelectorAll('aside a[href^=\"#/docs/\"]')].map(a=>a.getAttribute('href').slice(7))")
    await pg.close()
    out = {}
    for w in [360, 768, 1024]:
      pg = await b.new_page(viewport={"width":w,"height":800})
      for s in slugs:
        await pg.goto("http://127.0.0.1:5201/#/docs/"+s); await pg.wait_for_timeout(700)
        r = await pg.evaluate("""()=>{const W=innerWidth;const bad=[];document.querySelectorAll('main *').forEach(e=>{const r=e.getBoundingClientRect();if(r.width>0&&r.right>W+1&&!e.closest('.overflow-x-auto,.overflow-auto,.overflow-hidden,pre')){bad.push((e.tagName+'.'+(e.className.baseVal??e.className)).slice(0,90)+' R'+Math.round(r.right))}});return [document.documentElement.scrollWidth, bad.slice(0,3)]}""")
        if r[0] > w or r[1]: out.setdefault(str(w),{})[s]=r
      await pg.close()
    print(len(slugs)); print(json.dumps(out, ensure_ascii=False, indent=0))
    await b.close()
asyncio.run(main())