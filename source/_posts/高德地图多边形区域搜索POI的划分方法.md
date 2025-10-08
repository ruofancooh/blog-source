---
title: 高德地图多边形区域搜索POI的划分方法
date: 2024-11-30 19:00:00
permalink: amap-poi-search.html
---

我们想要使用高德开放平台的 POI 搜索 2.0 中的多边形区域搜索来获取 POI 数据。它的传参需求类似于 `114.10,30.53|114.11,30.54` 的字符串，为一个矩形范围。对于个人认证的开发者，每天每个账号限制调用 100 次（实际情况可能比 100 次略多几十次），3 次每秒。且该 API 每次请求只能返回 1 页，1 页最多 25 条，到第九页必定不出数据。

- 对于某种类型的 POI，它在地图上分布的密度不是固定的。
- 还有一个 Web 基础服务 API-行政区域查询，它可以返回一个行政区的边界字符串。
- 纬线是横着的，而纬度是竖直方向上的，在竖直方向上，1 纬度约为 111 公里；经线是竖着的，而经度是水平方向上的，在水平方向上，1 经度约为 111 公里乘上纬度的余弦。
- `shapely` 包的 `Polygon` 对象可以表示一个多边形，其 `intersects` 方法可以判断两个多边形是否有交。一个 `list[Polygon]` 可以写进 `geojson` 文件里。
- `geopandas` 包可以读写 `geojson` 文件，并可以配合 `plt` 画出 `gdf`。使用 `pd.concat` 连接两个 `gdf`。

<!--more-->

## 解决方法

用多轮筛查，先用大网，后用小网，每轮用数天数次完成。每轮搜索之前，把待搜索的范围划分成一系列与搜索区域有交的小矩形，如在一个 0.05 范围内的经纬度网内进行第一轮筛查。专门建一个文档，用于保存在本轮搜索里每个小搜索区域的状态，是否爬完，爬到第几页了（先将其设置为空字符串）。

每个小搜索区域有这么几种状态：

- A：已经爬完了
- B：没有爬完，且爬到的页号 = 9（看你具体的循环逻辑）
- C：没有爬完，且爬到的页号 < 9 或为空字符串

爬到 1 至 8 页，且本页的 poi 个数小于 25 条时，说明在这个范围内爬完了；爬到第 8 页，且本页的 poi 个数等于 25 条时，虽然是有很小的概率是爬完了的，但是我们认为它是没有爬完的。

在每次搜索的时候，遍历状态为 C 的区域，对其发请求，并更新对应的搜索区域的状态。

每轮搜索的结束条件：没有状态为 C 的区域了。这时候需要把状态为 B 的区域导出，进行下一步的划分，如划分成 0.01 的经纬度网。

## 示例代码

### amap_poi_spider.py

```py
import logging
import datetime
import time

import requests

logging.basicConfig(
    filename=f"{datetime.date.today()}.log",
    filemode="a+",
    encoding="utf-8",
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)

def search_poi(poi_typecode: str, search_range: str,api_key:str) -> dict:
    """
    在单个矩形范围内搜索POI，仅适用于中国境内，东经，北纬
    对于一个多边形区域，每次最多搜索出200条，所以需要划分成多个多边形区域
    “多边形区域搜索”接口每天限制调用100次，3次/秒
    https://lbs.amap.com/api/webservice/guide/api-advanced/newpoisearch
    返回
    page：终止的页数
    pois：list[dict] 可能为空
    is_end：是否该区域已经搜索完
    api_is_full：是否调用量超限
    """
    logging.info(f"黄若凡地理数据爬取矩形范围搜索模块")
    ret = {"page": 1, "pois": [], "is_end": False,"api_is_full":False}
    
    while not ret["api_is_full"]:  # 每一页
        time.sleep(4)
        response = requests.get(
            url="https://restapi.amap.com/v5/place/polygon",
            params={
                "key": api_key,
                "polygon": search_range,  # 多个坐标对集合，坐标对用 | 分割。多边形为矩形时，可传入左上右下两顶点坐标对；其他情况下首尾坐标对需相同。
                "types": poi_typecode,  # 可以传入多个poi typecode，相互之间用 | 分隔
                "page_size": 25,  # 当前分页展示的数据条数，取值1到25
                "page_num": ret[
                    "page"
                ],  # 请求第几分页，取值1到100，如果上面指定25条，这里实际只有前8页
                "show_fields": "business",  # 返回结果控制
            },
        )
        logging.info(f"GET {search_range}")
        response = response.json()
        if response["status"] == "1":
            count = int(response["count"])
            pois: list[dict] = response["pois"]
            logging.info(f"爬取到第{ret["page"]}页，有{count}条")
            if ret["page"] <= 8 and count < 25:  # 说明是最后一页
                ret["pois"].extend(pois)
                ret["is_end"] = True
                break
            elif ret["page"] == 8 and count == 25:  # 说明需要进一步划分搜索范围
                ret["page"] += 1
                ret["pois"].extend(pois)
                break
            else:# 搜索下一页
                ret["page"] += 1
                ret["pois"].extend(pois)
        else:
            logging.error("搜索失败" + str(response))
            ret["api_is_full"] = True # 一天的量用完了
    return ret
```

### utils.py

```py
import math

import geopandas as gpd
import matplotlib.pyplot as plt
import pandas as pd
from shapely.geometry import Polygon, box


def rectangle_str_to_polygon(r: str) -> list[Polygon]:
    """把类似 114.30,30.60|114.35,30.65 的矩形字符串转换为 Polygon 对象"""
    left_top, right_bottom = r.split("|")
    left, top = map(float, left_top.split(","))
    right, bottom = map(float, right_bottom.split(","))
    return Polygon([(left, top), (right, top), (right, bottom), (left, bottom)])


def plot_rectangles_on_geo(geojson_file_path: str, rectangles: list[Polygon]):
    gdf: gpd.GeoDataFrame = gpd.read_file(geojson_file_path)
    sub_gdf = gpd.GeoDataFrame({"geometry": rectangles})
    new_gdf: gpd.GeoDataFrame = pd.concat([gdf, sub_gdf], ignore_index=True)
    new_gdf.plot(facecolor="none", edgecolor="black", linewidth=1)
    plt.show()


def split_rectangle(rectangle: Polygon, num_parts: int) -> list[Polygon]:
    """把一个Polygon的矩形切分成指定数量、长宽固定的小矩形，确保与原矩形有交"""
    minx, miny, maxx, maxy = rectangle.bounds
    # 计算每边应分割成的部分数量
    side_parts = int(math.sqrt(num_parts))
    # 计算每个小矩形的宽度和高度
    width = (maxx - minx) / side_parts
    height = (maxy - miny) / side_parts
    sub_rectangles = []
    for i in range(side_parts):
        for j in range(side_parts):
            left = minx + i * width
            bottom = miny + j * height
            right = left + width
            top = bottom + height
            small_rectangle = box(left, bottom, right, top)
            if rectangle.intersects(small_rectangle):
                sub_rectangles.append(small_rectangle)

    return sub_rectangles


if __name__ == "__main__":
    r: Polygon = rectangle_str_to_polygon("114.35,30.85|114.40,30.90")

    def print_b(p: Polygon):
        print(f"左上：{p.bounds[0],p.bounds[1]}，右下：{p.bounds[2],p.bounds[3]}")

    new_rs = split_rectangle(r, 25)
    assert len(new_rs) == 25

    print_b(r)
    print_b(new_rs[0])
    print_b(new_rs[-1])
```

### search_by_round.py

```py
import datetime
import logging
import time
from enum import Enum

import geopandas as gpd
import pandas as pd
from pymongo import MongoClient
from shapely.geometry import Polygon

from amap_poi_spider import search_poi
from utils import plot_rectangles_on_geo, rectangle_str_to_polygon, split_rectangle

logging.basicConfig(
    filename=f"{datetime.date.today()}.log",
    filemode="a+",
    encoding="utf-8",
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)


client = MongoClient("mongodb://localhost:27017/")
db = client["武汉市餐饮店POI数据"]
pois_db = db["POI数据"]
FOOD = "050000"


class SearchAreaStatus(Enum):
    B = {"是否搜索完": False, "到第几页没有数据": 9}
    C = {
        "是否搜索完": False,
        "$or": [{"到第几页没有数据": {"$lt": 9}}, {"到第几页没有数据": ""}],
    }


API_KEYS = []


def a_search_in_a_round(round: str):
    """某轮的某次搜索"""
    search_ranges = db[f"第{round}轮筛的搜索范围"]
    key_index = 0
    for doc in search_ranges.find(SearchAreaStatus.C.value):
        while key_index < len(API_KEYS):
            range_str = doc["_id"]
            time.sleep(1)
            result = search_poi(FOOD, range_str, API_KEYS[key_index])
            search_ranges.update_one(
                {"_id": range_str},
                {
                    "$set": {
                        "是否搜索完": result["is_end"],
                        "到第几页没有数据": result["page"],
                    }
                },
                upsert=True,
            )
            for poi in result["pois"]:
                _id = poi.pop("id")
                pois_db.update_one({"_id": _id}, {"$set": poi}, upsert=True)
            if result["api_is_full"]:
                key_index += 1
            else:
                break


def search_areas_remaining_in_a_round(round: str, status: SearchAreaStatus):
    """某轮某次搜索后剩余某个状态的搜索区域的数量"""
    search_ranges = db[f"第{round}轮筛的搜索范围"]
    i = 0
    for _ in search_ranges.find(status.value):
        i += 1
    print(i)


def after_a_search_round(round: str):
    """把本轮未搜索完，需要进一步划分的区域的写到文件里"""
    search_ranges = db[f"第{round}轮筛的搜索范围"]
    f = search_ranges.find(SearchAreaStatus.B.value)
    unfinished_range = [doc["_id"] for doc in f]
    df = pd.DataFrame({"s_range": unfinished_range})
    df.to_csv(f"第{round}轮筛之后未搜索完的.csv", index=False)


def show_unfinished(old_round_csv_file: str, geojson_file: str):
    """展示上一轮里未搜索完的区域"""
    df = pd.read_csv(old_round_csv_file)
    old_rectangles = [rectangle_str_to_polygon(s) for s in df["s_range"]]
    print(f"上一轮里未搜索完的区域有{len(old_rectangles)}个")
    plot_rectangles_on_geo(geojson_file, old_rectangles)


def divide_search_area(
    old_rectangles: list[Polygon], geojson_file: str, num_parts: int
) -> list[Polygon]:
    """划分一系列矩形为整数的平方份，并确保与行政区有交"""
    new_rectangles: list[Polygon] = []
    for r in old_rectangles:
        new_rs = split_rectangle(r, num_parts=num_parts)
        assert len(new_rs) == num_parts
        new_rectangles.extend(new_rs)
    gdf: gpd.GeoDataFrame = gpd.read_file(geojson_file)
    polygons = [geom for geom in gdf.geometry if isinstance(geom, Polygon)]
    new_search_ranges: list[Polygon] = []
    for r in new_rectangles:
        for p in polygons:
            if r.intersects(p):
                new_search_ranges.append(r)
    plot_rectangles_on_geo(geojson_file, new_search_ranges)
    return new_search_ranges


def before_a_search_round(new_round: str, new_search_ranges: list[Polygon]):
    """写新的搜索区域到数据库里，注意保留小数的位数"""
    collection = db[f"第{new_round}轮筛的搜索范围"]
    for r in new_search_ranges:
        minx, miny, maxx, maxy = r.bounds
        s = f"{minx:.3f},{miny:.3f}|{maxx:.3f},{maxy:.3f}"
        collection.update_one(
            {"_id": s},
            {
                "$set": {
                    "到第几页没有数据": "",
                    "是否搜索完": False,
                }
            },
            upsert=True,
        )


# show_unfinished("第二轮筛之后未搜索完的.csv", "武汉市13个区.geojson")
# df = pd.read_csv("第二轮筛之后未搜索完的.csv")
# old_rectangles = [rectangle_str_to_polygon(s) for s in df["s_range"]]
# new_search_ranges = divide_search_area(old_rectangles, "武汉市13个区.geojson", 25)
# before_a_search_round("三", new_search_ranges)
# search_areas_remaining_in_a_round("三", SearchAreaStatus.C)

a_search_in_a_round("三")

# after_a_search_round("二")
```