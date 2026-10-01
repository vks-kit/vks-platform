import asyncio
from playwright.async_api import async_playwright
U="http://127.0.0.1:5201/#/frame/resp-overlay"
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    pg=await b.new_page(viewport={"width":390,"height":780},device_scale_factor=2,has_touch=True,is_mobile=True)
    errs=[]; pg.on("pageerror",lambda e:errs.append(str(e)))
    for i in range(3):
      try: await pg.goto(U); break
      except Exception as e: await asyncio.sleep(1)
    await pg.wait_for_timeout(900)
    await pg.screenshot(path=".shots/ps_0.png")
    await pg.get_by_text("ເລືອກຈຸດ").first.click(); await pg.wait_for_timeout(600)
    n=await pg.locator("[data-slot=overlay], .vks-scrim, [data-state=open][class*=fixed][class*=inset-0]").count()
    print("overlays-ish",n, "sheets", await pg.locator("[role=dialog]").count(), "push", await pg.locator(".vks-push").count())
    await pg.screenshot(path=".shots/ps_1.png")
    await pg.get_by_placeholder("ຄົ້ນຫາ").first.fill("ລິຟ") if await pg.get_by_placeholder("ຄົ້ນຫາ").count() else None
    await pg.wait_for_timeout(300); await pg.screenshot(path=".shots/ps_2.png")
    await pg.locator(".vks-push li, .vks-push [role=option]").first.click(); await pg.wait_for_timeout(600)
    print("after pick push", await pg.locator(".vks-push").count(), "dialog open", await pg.locator("[role=dialog]").count())
    await pg.screenshot(path=".shots/ps_3.png")
    # Esc test
    await pg.get_by_text("ລິຟ").first.click(); await pg.wait_for_timeout(500)
    await pg.keyboard.press("Escape"); await pg.wait_for_timeout(500)
    print("after esc push", await pg.locator(".vks-push").count(), "dialog", await pg.locator("[role=dialog]").count())
    d=await b.new_page(viewport={"width":1280,"height":800})
    await d.goto(U); await d.wait_for_timeout(800)
    await d.get_by_text("ເລືອກຈຸດ").first.click(); await d.wait_for_timeout(500)
    await d.screenshot(path=".shots/pd_1.png")
    print("errs",errs)
    await b.close()
asyncio.run(main())