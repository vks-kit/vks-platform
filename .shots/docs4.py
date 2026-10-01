from playwright.sync_api import sync_playwright
import time, os
O=r"C:/Users/VKS-001/Desktop/Trading TEST/vks-platform/.shots/docs4/"
os.makedirs(O,exist_ok=True)
U="http://localhost:5201/#/docs/"
errs=[]
def P(b,**kw):
  p=b.new_page(**kw); p.on("pageerror",lambda e:errs.append(str(e))); p.on("console",lambda m: m.type=="error" and errs.append(m.text)); return p
def safe(f,name):
  try: f()
  except Exception as e: print("FAIL",name,str(e)[:160])
with sync_playwright() as pw:
  b=pw.chromium.launch(executable_path=r"C:\Program Files\Google\Chrome\Application\chrome.exe")
  pg=P(b,viewport={"width":1280,"height":820})
  def s1():
    pg.goto(U+"ios-alert"); time.sleep(1); pg.get_by_role("button",name="2 buttons").first.click(); time.sleep(.6); pg.screenshot(path=O+"alert.png")
  safe(s1,"alert")
  def s2():
    pg.goto(U+"banner"); time.sleep(1); pg.get_by_role("button",name="Danger").first.click(); time.sleep(.8); pg.screenshot(path=O+"banner.png")
  safe(s2,"banner")
  def s3():
    pg.goto(U+"menu"); time.sleep(1); pg.get_by_role("button",name="Menu").first.click(); time.sleep(.5); pg.screenshot(path=O+"menu.png")
  safe(s3,"menu")
  def s4():
    pg.goto(U+"performance"); time.sleep(1); pg.screenshot(path=O+"perf.png")
    pg.get_by_role("radio",name="Low-end").first.click(); time.sleep(.5); print("perf attr", pg.evaluate("document.documentElement.dataset.perf")); pg.screenshot(path=O+"perf_lite.png")
    pg.get_by_role("radio",name="Auto").first.click()
  safe(s4,"perf")
  for slug in ["list-group","skeletons","floating-input","chip","number-ticker"]:
    safe(lambda: (pg.goto(U+slug), time.sleep(1), pg.screenshot(path=O+slug+".png")), slug)
  m=P(b,viewport={"width":390,"height":844},device_scale_factor=2,is_mobile=True,has_touch=True)
  def s5():
    m.goto(U+"action-sheet"); time.sleep(1); m.get_by_role("button",name="Photo actions").first.click(); time.sleep(.7); m.screenshot(path=O+"m_sheet.png")
  safe(s5,"sheet")
  def s6():
    m.goto("http://localhost:5201/#/frame/login-card"); time.sleep(1.2); m.screenshot(path=O+"m_login.png")
    m.evaluate("localStorage.setItem('vks-theme','dark')"); m.reload(); time.sleep(1.2); m.screenshot(path=O+"m_login_dark.png"); m.evaluate("localStorage.removeItem('vks-theme')")
  safe(s6,"login")
  b.close()
print("errors",errs[:8])
