import asyncio
from playwright.async_api import async_playwright
O=r"C:/Users/VKS-001/Desktop/Trading TEST/vks-platform/.shots/v6_"
async def main():
  async with async_playwright() as p:
    b = await p.chromium.launch(executable_path=r"C:\Program Files\Google\Chrome\Application\chrome.exe")
    for n,vp in [("phone",{"width":390,"height":844}),("tab",{"width":900,"height":1000}),("wide",{"width":1440,"height":900})]:
      pg = await b.new_page(viewport=vp, device_scale_factor=1)
      errs=[]
      pg.on("pageerror", lambda e: errs.append(str(e)))
      for s in ["responsive","data-table","button"]:
        await pg.goto("http://127.0.0.1:5201/#/docs/"+s); await pg.wait_for_timeout(2500)
        ov = await pg.evaluate("document.documentElement.scrollWidth - innerWidth")
        print(n,s,"overflow",ov)
        await pg.screenshot(path=O+s+"_"+n+".png", full_page=False)
        if s=="responsive":
          await pg.evaluate("document.getElementById('table-cards').scrollIntoView()"); await pg.wait_for_timeout(2500)
          await pg.screenshot(path=O+s+"_tc_"+n+".png")
      if n=="phone":
        await pg.click("button[aria-label=Menu]"); await pg.wait_for_timeout(600); await pg.screenshot(path=O+"menu_phone.png")
      print("errors",errs[:3])
      await pg.close()
    await b.close()
asyncio.run(main())