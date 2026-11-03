#!/usr/bin/env python3
"""Import the reviewed AI learning catalogue from the supplied workbook."""

import json
import re
import sys
from datetime import date, datetime
from pathlib import Path

from openpyxl import load_workbook


BOARD_MAP = {
    "基础": ("basics", "L1"),
    "应用": ("tools", "L2"),
    "开发": ("dev", "L3"),
    "前沿": ("strategy", "L4"),
}

# The reviewed sheet kept repository URLs in these rows. The catalogue needs
# the corresponding playback entry as its primary link and retains the repo.
PLAYBACK_URLS = {
    "Jev模型实测": "https://www.bilibili.com/video/BV1rWeC6LEWz/",
    "小鸭子机器人 Microduck硬件架构拆解": "https://www.bilibili.com/video/BV1jwtH6bETN/",
    "n8n 官方 Beginner Course（9 集）": "https://www.youtube.com/playlist?list=PLlET0GsrLUL59YbxstZE71WszP3pVnZfI",
    "ComfyUI Tutorial Series": "https://www.youtube.com/watch?v=Zko_s2LO9Wo",
    "CrewAI Tutorial 合集": "https://www.youtube.com/watch?v=-kSOTtYzgEw",
    "Agentic AI using LangGraph 合集": "https://www.youtube.com/watch?v=yC36gN-rqjo",
}


def canonical_url(value):
    if not value:
        return None
    value = str(value).strip()
    if "bilibili.com/video/" in value:
        match = re.search(r"(BV[0-9A-Za-z]+)", value)
        if match:
            return f"https://www.bilibili.com/video/{match.group(1)}/"
    return value


def as_iso(value):
    if isinstance(value, (datetime, date)):
        return value.strftime("%Y-%m-%d")
    return None


def main():
    if len(sys.argv) != 2:
        raise SystemExit("usage: import-reviewed-resources.py <catalogue.xlsx>")

    source = Path(sys.argv[1]).expanduser().resolve()
    target = Path(__file__).resolve().parents[1] / "src/data/resources.ts"
    sheet = load_workbook(source, data_only=True).active
    headers = {cell.value: index for index, cell in enumerate(sheet[1])}

    records = []
    counters = {board: 0 for board, _ in BOARD_MAP.values()}
    for row in sheet.iter_rows(min_row=2, values_only=True):
        title = str(row[headers["合集标题"]] or "").strip()
        category = str(row[headers["板块"]] or "").strip()
        if not title or category not in BOARD_MAP:
            continue

        board, level = BOARD_MAP[category]
        counters[board] += 1
        source_url = canonical_url(row[headers["源链接"]])
        playback_url = PLAYBACK_URLS.get(title, source_url)
        source_name = str(row[headers["来源"]] or "").strip()
        description = str(row[headers["合集简介/视频简介"]] or "").strip()
        episodes = row[headers["视频数"]]
        published_at = as_iso(row[headers["上线社区时间"]])
        note = row[headers["备注"]]
        views_match = re.search(r"原网播放量\s*([0-9.]+)万", description)

        item = {
            "id": f"{board}-{counters[board]:02d}",
            "board": board,
            "level": level,
            "title": title,
            "description": description,
            "platform": source_name,
            "region": "overseas" if source_name in {"YouTube", "GitHub"} else "cn",
            "media": "video",
            "collection": True,
            "recommended": bool(published_at),
        }
        if playback_url:
            item["url"] = playback_url
        if source_url and source_url != playback_url:
            item["repositoryUrl"] = source_url
        if isinstance(episodes, (int, float)) and episodes > 0:
            item["episodes"] = int(episodes)
        if views_match:
            item["views"] = round(float(views_match.group(1)) * 10000)
        if published_at:
            item["publishedAt"] = published_at
        if note:
            item["note"] = str(note).strip()
        records.append(item)

    header = (
        "// 本文件由 scripts/import-reviewed-resources.py 自动生成，请勿手改。\n"
        f"// 数据源：{source.name}（{len(records)} 个评审合集）\n"
        "import type { Resource } from '../types'\n\n"
        "export const resources: Resource[] = "
    )
    target.write_text(header + json.dumps(records, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Imported {len(records)} collections into {target}")


if __name__ == "__main__":
    main()
