from playwright.sync_api import sync_playwright
import time
O=r"C:/Users/VKS-001/Desktop/Trading TEST/vks-platform/.shots/docs4/"
U="http://localhost:5201/#/docs/"
errs=[]
with sync_playwright() as pw:
  b=pw.chromium.launch(executable_path=r"C:\Program Files\Google\Chrome\Application\chrome.exe")
  p=b.new_page(viewport={"width":1280,"height":820}); p.on("pageerror",lambda e:errs.append(str(e)))
  try:
    p.goto(U+"lightbox"); time.sleep(1); p.locator("main button:has(img)").first.click(); time.sleep(.7); p.screenshot(path=O+"lb.png")
    print("lb open", p.locator("[role=dialog]").count()); p.mouse.click(640,60); time.sleep(.6); print("lb after outside click", p.locator("[role=dialog]").count())
  except Exception as e: print("lb FAIL",str(e)[:200])
  try:
    p.goto(U+"table"); time.sleep(1); th=p.locator("main th button").first; print("sortable headers", p.locator("main th button").count()); th.click(); time.sleep(.3); print("aria-sort", p.locator("main th[aria-sort]").first.get_attribute("aria-sort")); p.screenshot(path=O+"table.png")
  except Exception as e: print("table FAIL",str(e)[:200])
  try:
    p.goto(U+"date-picker"); time.sleep(1); p.locator("main button[aria-haspopup=dialog]").first.click(); time.sleep(.08); print("dp anim", p.evaluate("()=>{const e=document.querySelector('.vks-panel');return e?getComputedStyle(e).animationName:'none'}")); time.sleep(.5); p.screenshot(path=O+"dp.png")
  except Exception as e: print("dp FAIL",str(e)[:200])
  b.close()
print("errors",errs[:5])
