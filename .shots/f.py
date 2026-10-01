import asyncio
from playwright.async_api import async_playwright
O=r"C:/Users/VKS-001/Desktop/Trading TEST/vks-platform/.shots/f_"
async def main():
  async with async_playwright() as p:
    b = await p.chromium.launch(executable_path=r"C:\Program Files\Google\Chrome\Application\chrome.exe")
    pg = await b.new_page(viewport={"width":360,"height":720})
    errs=[]; pg.on("pageerror", lambda e: errs.append(str(e)))
    for f in ["resp-overlay","resp-toolbar"]:
      pg = await b.new_page(viewport={"width":360,"height":720}); pg.on("pageerror", lambda e: errs.append(str(e)))
      await pg.goto("http://127.0.0.1:5201/#/frame/"+f); await pg.wait_for_timeout(1500); await pg.screenshot(path=O+f+".png")
    pg = await b.new_page(viewport={"width":390,"height":844})
    await pg.goto("http://127.0.0.1:5201/#/docs/responsive"); await pg.wait_for_timeout(1500)
    await pg.evaluate("document.getElementById('rules').scrollIntoView()"); await pg.wait_for_timeout(1200); await pg.screenshot(path=O+"rules.png")
    print("errors",errs)
    await b.close()
asyncio.run(main())