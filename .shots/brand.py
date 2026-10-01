import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b = await p.chromium.launch(executable_path=r"C:\Program Files\Google\Chrome\Application\chrome.exe")
    for n,vp in [("desk",{"width":1440,"height":900}),("phone",{"width":390,"height":844})]:
      pg = await b.new_page(viewport=vp)
      await pg.goto("http://127.0.0.1:5201/#/docs/logo"); await pg.wait_for_timeout(1500)
      el = pg.get_by_text("On the navy bar").first; await el.scroll_into_view_if_needed(); await pg.wait_for_timeout(400)
      await pg.screenshot(path=r"C:/Users/VKS-001/Desktop/Trading TEST/vks-platform/.shots/brand_%s.png"%n)
      print(n, await pg.evaluate("()=>[document.documentElement.scrollWidth,innerWidth]"))
    await b.close()
asyncio.run(main())