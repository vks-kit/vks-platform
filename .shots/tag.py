import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(); pg=await b.new_page(viewport={"width":1100,"height":800},device_scale_factor=2)
    errs=[]; pg.on("pageerror",lambda e: errs.append(str(e)))
    await pg.goto("http://localhost:5201/#/docs/tag-input"); await pg.wait_for_timeout(1200)
    inp=pg.locator(".vks-tag").first.locator("xpath=..").locator("input")
    await inp.scroll_into_view_if_needed()
    for w in ["ກະເຊົ້າ","A-01","ດ່ວນ"]:
      await inp.fill(w); await inp.press("Enter"); await pg.wait_for_timeout(60)
    await pg.wait_for_timeout(80)
    box=await inp.locator("xpath=..").bounding_box(); clip={"x":box["x"]-10,"y":box["y"]-10,"width":box["width"]+20,"height":box["height"]+20}
    await pg.screenshot(path="C:/Users/VKS-001/Desktop/Trading TEST/vks-platform/.shots/v04/tag-add-mid.png",clip=clip)
    await pg.wait_for_timeout(500)
    tags=pg.locator(".vks-tag"); n=await tags.count()
    labels=[await tags.nth(i).inner_text() for i in range(n)]
    before=[(await tags.nth(i).bounding_box())["x"] for i in range(n)]
    await tags.first.locator("button").click(); await pg.wait_for_timeout(330)
    mid=[(await tags.nth(i).bounding_box())["x"] for i in range(await tags.count())]
    await pg.screenshot(path="C:/Users/VKS-001/Desktop/Trading TEST/vks-platform/.shots/v04/tag-rm-mid.png",clip=clip)
    await pg.wait_for_timeout(500)
    end=[(await tags.nth(i).bounding_box())["x"] for i in range(await tags.count())]
    await inp.focus(); await inp.press("Backspace"); await pg.wait_for_timeout(100)
    lv=await pg.locator(".vks-tag[data-leaving]").count()
    await pg.wait_for_timeout(400)
    await inp.press("Backspace"); await inp.press("Backspace"); await pg.wait_for_timeout(600)
    left=[await tags.nth(i).inner_text() for i in range(await tags.count())]
    print("labels",labels,"\nbefore",before,"\nmid",mid,"\nend",end,"\nbackspace leaving",lv,"\nafter 3 backspaces",left,"\nerrors",errs)
    await b.close()
asyncio.run(main())