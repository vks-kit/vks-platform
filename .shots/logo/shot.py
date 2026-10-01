from playwright.sync_api import sync_playwright
import pathlib
p=pathlib.Path(r"C:/Users/VKS-001/Desktop/Trading TEST/vks-platform/.shots/logo/cmp.html").as_uri()
with sync_playwright() as pw:
  b=pw.chromium.launch(executable_path=r"C:\Program Files\Google\Chrome\Application\chrome.exe")
  pg=b.new_page(viewport={"width":1400,"height":520}); pg.goto(p); pg.screenshot(path=r"C:/Users/VKS-001/Desktop/Trading TEST/vks-platform/.shots/logo/cmp.png"); b.close()
