from playwright.sync_api import sync_playwright
import time
O=r"C:/Users/VKS-001/Desktop/Trading TEST/vks-platform/.shots/docs2/"
import os; os.makedirs(O,exist_ok=True)
B="http://localhost:5201/#/docs/"
with sync_playwright() as pw:
  b=pw.chromium.launch(executable_path=r"C:\Program Files\Google\Chrome\Application\chrome.exe")
  pg=b.new_page(viewport={"width":1280,"height":820})
  time.sleep(2)
  pg.goto(B+"introduction"); time.sleep(1.2); pg.screenshot(path=O+"intro.png")
  pg.goto(B+"toggle"); time.sleep(1); pg.get_by_text("ແຜນທີ່").first.click(); time.sleep(.6); pg.screenshot(path=O+"toggle.png")
  pg.goto(B+"button"); time.sleep(1); pg.screenshot(path=O+"button.png")
  # toast font
  pg.goto(B+"button"); time.sleep(1); pg.locator("text=Loading").first.scroll_into_view_if_needed(); pg.get_by_role("button",name="ບັນທຶກ").nth(1).click(); time.sleep(2.2)
  ff=pg.evaluate("()=>{const t=document.querySelector('[data-sonner-toast] [data-title]');return t?getComputedStyle(t).fontFamily:'none'}")
  print("toastfont",ff); pg.screenshot(path=O+"toast.png")
  # dialog close mid-animation
  pg.goto(B+"confirm-dialog"); time.sleep(1)
  btns=pg.locator("main button").all()
  print([x.inner_text()[:20] for x in btns[:8]])
  b.close()
