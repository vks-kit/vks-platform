import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b = await p.chromium.launch(executable_path=r"C:\Program Files\Google\Chrome\Application\chrome.exe")
    pg = await b.new_page(viewport={"width":390,"height":844}, has_touch=True, is_mobile=True)
    await pg.goto("http://127.0.0.1:5305/#/more"); await pg.wait_for_timeout(2500)
    r = await pg.evaluate("""()=>{const W=390;const out=[];for(const e of document.querySelectorAll('body *')){const r=e.getBoundingClientRect();if(r.right>W+1&&r.width>0){let clipped=false;for(let a=e.parentElement;a;a=a.parentElement){const o=getComputedStyle(a).overflowX;if(o!=='visible'){const ar=a.getBoundingClientRect();if(ar.right<=W+1){clipped=true;break}}}if(!clipped)out.push(e.tagName+'.'+(e.className+'').slice(0,90)+' R='+Math.round(r.right)+' sec='+(e.closest('section')?.id||''))}}return out.slice(0,12)}""")
    print("\n".join(r)); await b.close()
asyncio.run(main())