import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(); pg=await b.new_page(viewport={"width":1100,"height":800},device_scale_factor=2)
    errs=[]; pg.on("pageerror",lambda e: errs.append(str(e)))
    await pg.goto("http://localhost:5201/#/docs/checkbox-switch"); await pg.wait_for_timeout(1200)
    cb=pg.locator("button[role=checkbox]").first; sw=pg.locator("button[role=switch]").first
    await cb.scroll_into_view_if_needed(); await pg.wait_for_timeout(300)
    box=await cb.bounding_box(); area={"x":box["x"]-120,"y":box["y"]-40,"width":420,"height":130}
    # uncheck both first
    await cb.click(); await sw.click(); await pg.wait_for_timeout(700)
    await pg.screenshot(path="C:/Users/VKS-001/Desktop/Trading TEST/vks-platform/.shots/v04/tg-1-off.png",clip=area)
    # hold the switch
    sb=await sw.bounding_box(); await pg.mouse.move(sb["x"]+sb["width"]/2,sb["y"]+sb["height"]/2); await pg.mouse.down(); await pg.wait_for_timeout(300)
    t=await pg.evaluate("getComputedStyle(document.querySelector('.vks-sw-m')).transform")
    await pg.screenshot(path="C:/Users/VKS-001/Desktop/Trading TEST/vks-platform/.shots/v04/tg-2-swhold.png",clip=area)
    await pg.mouse.up(); await pg.wait_for_timeout(120)
    mid=await pg.evaluate("getComputedStyle(document.querySelector('.vks-sw-thumb')).transform")
    await pg.wait_for_timeout(600)
    end=await pg.evaluate("getComputedStyle(document.querySelector('.vks-sw-thumb')).transform")
    # hold the checkbox
    await pg.mouse.move(box["x"]+12,box["y"]+12); await pg.mouse.down(); await pg.wait_for_timeout(250)
    await pg.screenshot(path="C:/Users/VKS-001/Desktop/Trading TEST/vks-platform/.shots/v04/tg-3-cbhold.png",clip=area)
    await pg.mouse.up(); await pg.wait_for_timeout(700)
    await pg.screenshot(path="C:/Users/VKS-001/Desktop/Trading TEST/vks-platform/.shots/v04/tg-4-on.png",clip=area)
    st=await pg.evaluate("[document.querySelector('[role=checkbox]').dataset.state, document.querySelector('[role=switch]').dataset.state]")
    print("bar-held",t,"| thumb 120ms after release",mid,"| end",end,"| states",st,"| errors",errs)
    await b.close()
asyncio.run(main())