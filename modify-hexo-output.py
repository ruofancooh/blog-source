import shutil
import sys
from pathlib import Path
from bs4 import BeautifulSoup

def update_links_in_html(html_path: Path):
    """更新 HTML 文件中所有包含 '/archives' 的链接，将其替换为空字符串"""
    try:
        with html_path.open("r", encoding="utf-8") as f:
            content = f.read()
    except (IOError, OSError) as e:
        print(f"无法读取文件 {html_path}: {e}")
        return


    soup = BeautifulSoup(content, "html.parser")

    modified = False
    for a_tag in soup.find_all("a"):
        href = a_tag.get("href")
        if href and '/archives' in href:
            new_href = href.replace('/archives', '')
            if new_href != href:  # 防止无意义替换
                a_tag["href"] = new_href
                modified = True

    if modified:
        try:
            with html_path.open("w", encoding="utf-8") as f:
                f.write(str(soup))
        except (IOError, OSError) as e:
            print(f"无法写入文件 {html_path}: {e}")

if __name__ == "__main__":
    print(sys.argv)
    SITE_ROOT = Path(sys.argv[1])
    ARCHIVES_DIR = SITE_ROOT / "archives"
    
    # 移动归档首页到站点根目录
    source = ARCHIVES_DIR / "index.html"
    target = SITE_ROOT / "index.html"
    if source.exists():
        shutil.move(str(source), str(target))  # shutil.move 接受字符串路径
    else:
        print(f"警告：{source} 不存在，跳过移动")

    # 删除归档目录
    if ARCHIVES_DIR.exists():
        shutil.rmtree(ARCHIVES_DIR)

    # 遍历所有 HTML 文件（排除 404.html）
    for html_file in SITE_ROOT.rglob("*.html"):
        if html_file.name != "404.html":
            update_links_in_html(html_file)