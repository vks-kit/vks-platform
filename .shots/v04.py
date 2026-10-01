from playwright.sync_api import sync_playwright
import time, os
O=r"C:/Users/VKS-001/Desktop/Trading TEST/vks-platform/.shots/v04/"
os.makedirs(O,exist_ok=True)
U="http://localhost:5201/#/docs/"
errs=[]
with sync_playwright() as pw:
  b=pw.chromium.launch(executable_path=r"C:\Program Files\Google\Chrome\Application\chrome.exe")
  p=b.new_page(viewport={"width":1280,"height":900}); p.on("pageerror",lambda e:errs.append(str(e)))
  def go(s):
    p.goto(U+s); p.reload(); time.sleep(1.4)
  try:
    go("layout-rules"); p.screenshot(path=O+"layout.png")
    p.get_by_role("tab",name="Mobile").click(); time.sleep(.6); p.locator("#anatomy").scroll_into_view_if_needed(); p.screenshot(path=O+"layout-mobile.png")
  except Exception as e: print("layout FAIL",str(e)[:300])
  try:
    go("sidebar"); p.screenshot(path=O+"sidebar.png")
    sw=p.locator("main [role=switch]").first; sw.click(); time.sleep(.6); p.screenshot(path=O+"sidebar-collapsed.png")
  except Exception as e: print("sidebar FAIL",str(e)[:300])
  try:
    go("slider"); th=p.locator("main [role=slider]").first; bx=th.bounding_box(); p.mouse.move(bx["x"]+14,bx["y"]+14); p.mouse.down(); p.mouse.move(bx["x"]+90,bx["y"]+14,steps=6); time.sleep(.4); p.screenshot(path=O+"slider.png"); p.mouse.up()
  except Exception as e: print("slider FAIL",str(e)[:300])
  try:
    go("detail-popover"); p.locator("main button:has-text('ສົມຊາຍ')").first.hover(); time.sleep(.9); p.screenshot(path=O+"detail.png")
    print("hovercard", p.locator("[data-state=open].vks-detail, .vks-detail[data-state]").count())
  except Exception as e: print("detail FAIL",str(e)[:300])
  m=b.new_page(viewport={"width":390,"height":800},is_mobile=True,has_touch=True); m.on("pageerror",lambda e:errs.append(str(e)))
  try:
    m.goto(U+"detail-popover"); m.reload(); time.sleep(1.4); m.locator("main button:has-text('ສົມຊາຍ')").first.tap(); time.sleep(.9); m.screenshot(path=O+"detail-mobile.png"); print("sheet dialogs", m.locator("[role=dialog]").count())
  except Exception as e: print("mdetail FAIL",str(e)[:300])
  b.close()
print("errors",errs[:5])
