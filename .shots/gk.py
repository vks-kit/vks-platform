import asyncio
from playwright.async_api import async_playwright
D=r"C:/Users/VKS-001/Desktop/Trading TEST/vks-platform/.shots/"
async def main():
  async with async_playwright() as p:
    b = await p.chromium.launch(executable_path=r"C:\Program Files\Google\Chrome\Application\chrome.exe")
    for name,vp,m in [("desk",{"width":1440,"height":900},False),("phone",{"width":390,"height":844},True)]:
      pg = await b.new_page(viewport=vp, has_touch=m, is_mobile=m); errs=[]; pg.on("pageerror", lambda e: errs.append(str(e)))
      await pg.goto("http://127.0.0.1:5305/#/more"); await pg.wait_for_timeout(2500)
      for s in ["mobile-kit","desktop-kit"]:
        n = await pg.locator("#"+s).count()
        if n:
          await pg.locator("#"+s).scroll_into_view_if_needed(); await pg.wait_for_timeout(700)
          await pg.screenshot(path=D+"g_%s_%s.png"%(s,name))
        print(name,s,"found" if n else "MISSING")
      print(name,"errors",errs,"overflow",await pg.evaluate("()=>[document.documentElement.scrollWidth,innerWidth]"))
    await b.close()
asyncio.run(main())
