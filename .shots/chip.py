import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(); pg=await b.new_page(viewport={"width":1100,"height":800},device_scale_factor=2)
    errs=[]; pg.on("pageerror",lambda e: errs.append(str(e)))
    await pg.goto("http://localhost:5201/#/docs/chip"); await pg.wait_for_timeout(1200)
    xs=pg.locator("button[aria-label=remove]")
    await xs.first.scroll_into_view_if_needed(); await pg.wait_for_timeout(400)
    chips=pg.locator(".vks-chip:has(button[aria-label=remove])")
    before=[(await chips.nth(i).bounding_box())["x"] for i in range(await chips.count())]
    await xs.first.click()
    await pg.wait_for_timeout(400)  # exit done (~320ms), glide just started
    mid=[(await chips.nth(i).bounding_box())["x"] for i in range(await chips.count())]
    await pg.screenshot(path="C:/Users/VKS-001/Desktop/Trading TEST/vks-platform/.shots/v04/chip-mid.png",clip={"x":before[0]-40,"y":(await chips.first.bounding_box())["y"]-60,"width":520,"height":120})
    await pg.wait_for_timeout(600)
    end=[(await chips.nth(i).bounding_box())["x"] for i in range(await chips.count())]
    anims=await pg.evaluate("document.getAnimations().length")
    print("before",before,"\nmid",mid,"\nend",end,"\nanims left",anims,"errors",errs)
    await b.close()
asyncio.run(main())