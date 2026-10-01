import asyncio, sys
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b = await p.chromium.launch(executable_path=r"C:\Program Files\Google\Chrome\Application\chrome.exe")
    out=[]
    for name,vp,mobile in [("desk",{"width":1440,"height":900},False),("phone",{"width":390,"height":844},True)]:
      pg = await b.new_page(viewport=vp, has_touch=mobile, is_mobile=mobile)
      await pg.goto("http://127.0.0.1:5201/#/docs/kanban"); await pg.wait_for_timeout(2500)
      board = pg.locator("section[aria-label]").first
      await board.scroll_into_view_if_needed(); await pg.wait_for_timeout(400)
      async def cols():
        return await pg.evaluate("""()=>[...document.querySelectorAll('section[aria-label]')].slice(0,3).map(s=>s.getAttribute('aria-label')+':'+[...s.querySelectorAll('.font-semibold')].map(e=>e.textContent).join('|'))""")
      out.append(name+" before "+str(await cols()))
      ov = await pg.evaluate("()=>{const s=document.querySelector('section[aria-label]').parentElement;return [s.scrollWidth,s.clientWidth]}")
      out.append(name+" overflow "+str(ov))
      await pg.screenshot(path=r"C:/Users/VKS-001/Desktop/Trading TEST/vks-platform/.shots/kb_%s_0.png"%name)
      if not mobile:
        card = pg.get_by_text("ກວດປະຕູ 3").first
        tgt = pg.locator("section[aria-label='ກຳລັງເຮັດ']").first
        cb = await card.bounding_box(); tb = await tgt.bounding_box()
        await pg.mouse.move(cb["x"]+20,cb["y"]+15); await pg.mouse.down()
        for i in range(1,16):
          await pg.mouse.move(cb["x"]+20+(tb["x"]+60-cb["x"]-20)*i/15, cb["y"]+15+(tb["y"]+tb["height"]-30-cb["y"]-15)*i/15); await pg.wait_for_timeout(30)
        await pg.screenshot(path=r"C:/Users/VKS-001/Desktop/Trading TEST/vks-platform/.shots/kb_desk_drag.png")
        await pg.mouse.up(); await pg.wait_for_timeout(600)
        out.append("after1 "+str(await cols()))
        # drag to empty-ish 'done' column at top
        card = pg.get_by_text("ສົ່ງລາຍງານ").first; tgt = pg.locator("section[aria-label='ສຳເລັດ']").first
        cb = await card.bounding_box(); tb = await tgt.bounding_box()
        await pg.mouse.move(cb["x"]+20,cb["y"]+15); await pg.mouse.down()
        for i in range(1,16):
          await pg.mouse.move(cb["x"]+20+(tb["x"]+60-cb["x"]-20)*i/15, cb["y"]+15+(tb["y"]+20-cb["y"]-15)*i/15); await pg.wait_for_timeout(30)
        await pg.mouse.up(); await pg.wait_for_timeout(600)
        out.append("after2 "+str(await cols()))
        # reorder within doing: drag bottom card onto top card
        await pg.screenshot(path=r"C:/Users/VKS-001/Desktop/Trading TEST/vks-platform/.shots/kb_desk_1.png")
    print("\n".join(out)); await b.close()
asyncio.run(main())
