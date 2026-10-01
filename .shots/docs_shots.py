import asyncio
from playwright.async_api import async_playwright
OUT=r"C:/Users/VKS-001/Desktop/Trading TEST/vks-platform/.shots/docs/"
import os; os.makedirs(OUT,exist_ok=True)
shots=[("desk-light-button","button",1440,900,"light"),("desk-dark-daterange","date-range-picker",1440,900,"dark"),("desk-light-theming","theming",1440,900,"light"),("desk-dark-shell","app-shell",1440,1000,"dark"),("phone-light-intro","introduction",390,844,"light"),("phone-dark-datatable","data-table",390,844,"dark"),("desk-light-charts","charts",1440,1000,"light"),("desk-light-motion","motion",1440,900,"light")]
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path=r"C:/Program Files/Google/Chrome/Application/chrome.exe")
    errs=[]
    for name,slug,w,h,theme in shots:
      c=await b.new_context(viewport={"width":w,"height":h},device_scale_factor=1)
      await c.add_init_script(f"localStorage.setItem('vks-theme','{theme}')")
      pg=await c.new_page()
      pg.on("pageerror",lambda e,n=name: errs.append(n+": "+str(e)))
      pg.on("console",lambda m,n=name: errs.append(n+" console: "+m.text) if m.type=="error" else None)
      await pg.goto(f"http://localhost:5201/#/docs/{slug}"); await pg.wait_for_timeout(1800)
      await pg.screenshot(path=OUT+name+".png")
      await c.close()
    # phone menu + search
    c=await b.new_context(viewport={"width":390,"height":844}); pg=await c.new_page()
    await pg.goto("http://localhost:5201/#/docs/button"); await pg.wait_for_timeout(800)
    await pg.click("button[aria-label=Menu]"); await pg.wait_for_timeout(600); await pg.screenshot(path=OUT+"phone-menu.png")
    await pg.keyboard.press("Escape"); await pg.keyboard.press("Control+k"); await pg.wait_for_timeout(500); await pg.keyboard.type("date"); await pg.wait_for_timeout(300); await pg.screenshot(path=OUT+"phone-search.png")
    await b.close()
    print("\n".join(errs[:30]) or "no errors")
asyncio.run(main())
