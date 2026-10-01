import asyncio
from playwright.async_api import async_playwright
O=r"C:/Users/VKS-001/Desktop/Trading TEST/vks-platform/.shots/r_"
async def main():
  async with async_playwright() as p:
    b = await p.chromium.launch(executable_path=r"C:\Program Files\Google\Chrome\Application\chrome.exe")
    for n,vp in [("phone",{"width":390,"height":844}),("tab",{"width":900,"height":1000})]:
      pg = await b.new_page(viewport=vp, device_scale_factor=1)
      for s in ["changelog","data-table","button"]:
        await pg.goto("http://127.0.0.1:5201/#/docs/"+s); await pg.wait_for_timeout(1200)
        await pg.screenshot(path=O+s+"_"+n+".png", full_page=(s=="data-table"))
      await pg.close()
    await b.close()
asyncio.run(main())