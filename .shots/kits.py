import asyncio
from playwright.async_api import async_playwright
D=r"C:/Users/VKS-001/Desktop/Trading TEST/vks-platform/.shots/"
async def main():
  async with async_playwright() as p:
    b = await p.chromium.launch(executable_path=r"C:\Program Files\Google\Chrome\Application\chrome.exe")
    out=[]
    dp = await b.new_page(viewport={"width":1440,"height":900})
    errs=[]; dp.on("pageerror", lambda e: errs.append(str(e)))
    async def go(pg,slug):
      await pg.goto("http://127.0.0.1:5201/#/docs/"+slug); await pg.wait_for_timeout(1400)
    await go(dp,"stat-card"); await dp.screenshot(path=D+"k_stat.png")
    await go(dp,"command-palette"); await dp.get_by_text("ຄົ້ນຫາຄຳສັ່ງ").first.click(); await dp.wait_for_timeout(500); await dp.keyboard.type("rep"); await dp.wait_for_timeout(300); await dp.screenshot(path=D+"k_cmd.png"); await dp.keyboard.press("Escape")
    await go(dp,"context-menu"); box=dp.get_by_text("ຄລິກຂວາ ຫຼື ກົດຄ້າງບ່ອນນີ້").first; await box.click(button="right"); await dp.wait_for_timeout(400); await dp.screenshot(path=D+"k_ctx.png"); await dp.keyboard.press("Escape")
    await go(dp,"tree-view"); await dp.screenshot(path=D+"k_tree.png")
    await go(dp,"notification-list"); await dp.screenshot(path=D+"k_notice.png")
    await go(dp,"split-pane"); await dp.screenshot(path=D+"k_split.png")
    await go(dp,"share-sheet"); await dp.get_by_text("Force sheet").first.click(); await dp.wait_for_timeout(600); await dp.screenshot(path=D+"k_share.png")
    out.append("desk errors: "+str(errs))
    mp = await b.new_page(viewport={"width":390,"height":844}, has_touch=True, is_mobile=True)
    merrs=[]; mp.on("pageerror", lambda e: merrs.append(str(e)))
    await go(mp,"indexed-list"); await mp.get_by_text("ສົມຊາຍ").first.scroll_into_view_if_needed(); await mp.wait_for_timeout(300); await mp.screenshot(path=D+"k_index.png")
    await go(mp,"snap-sheet"); await mp.get_by_text("Open snap sheet").first.click(); await mp.wait_for_timeout(700); await mp.screenshot(path=D+"k_snap.png")
    await go(mp,"progress-hud"); await mp.get_by_text("Send (ok)").first.click(); await mp.wait_for_timeout(400); await mp.screenshot(path=D+"k_hud.png")
    await go(mp,"carousel"); await mp.screenshot(path=D+"k_car.png")
    ov = await mp.evaluate("()=>[document.documentElement.scrollWidth, innerWidth]")
    out.append("phone errors: "+str(merrs)+" overflow "+str(ov))
    print("\n".join(out)); await b.close()
asyncio.run(main())
