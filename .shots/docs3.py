from playwright.sync_api import sync_playwright
import time
O=r"C:/Users/VKS-001/Desktop/Trading TEST/vks-platform/.shots/docs2/"
with sync_playwright() as pw:
  b=pw.chromium.launch(executable_path=r"C:\Program Files\Google\Chrome\Application\chrome.exe")
  pg=b.new_page(viewport={"width":1280,"height":820})
  pg.goto("http://localhost:5201/#/docs/confirm-dialog"); time.sleep(1.2)
  pg.get_by_role("button",name="Danger").first.click(); time.sleep(.6); pg.screenshot(path=O+"dlg_open.png")
  pg.keyboard.press("Escape"); time.sleep(.08)
  r=pg.evaluate("()=>{const e=document.querySelector('[role=alertdialog]');if(!e)return 'gone';const s=getComputedStyle(e);return s.transform+' op='+s.opacity+' state='+e.dataset.state+' anim='+s.animationName}")
  print("mid-close",r); pg.screenshot(path=O+"dlg_mid.png")
  time.sleep(.5); print("after", pg.evaluate("()=>!!document.querySelector('[role=alertdialog]')"))
  m=b.new_page(viewport={"width":390,"height":844},device_scale_factor=2,is_mobile=True,has_touch=True)
  m.goto("http://localhost:5201/#/docs/confirm-dialog"); time.sleep(1.2)
  m.get_by_role("button",name="Danger").first.click(); time.sleep(.6); m.screenshot(path=O+"m_dlg.png")
  m.goto("http://localhost:5201/#/docs/introduction"); time.sleep(1.2); m.screenshot(path=O+"m_intro.png")
  b.close()
