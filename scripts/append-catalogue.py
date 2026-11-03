"""Append workbook resources without changing existing IDs or playback overrides."""
import json
import re
import sys
from pathlib import Path
from openpyxl import load_workbook

ROOT = Path(__file__).resolve().parents[1]

def key(value):
    value = str(value or '').strip()
    bv = re.search(r'BV[0-9A-Za-z]+', value)
    return bv.group() if bv else value.rstrip('/')

def main():
    source = Path(sys.argv[1])
    target = ROOT / 'src/data/resources.ts'
    text = target.read_text()
    records = json.loads(text[text.index('= [') + 2:])
    for item in records:
        if item.get('recommendationReason') and not item.get('publishedAt'):
            item['publishedAt'] = '2026-11-02'
    sheet = load_workbook(source, data_only=True).active
    rows = list(sheet.values)
    headers = {name: i for i, name in enumerate(rows[0])}
    mapping = {'基础': ('basics', 'L1'), '应用': ('tools', 'L2'), '开发': ('dev', 'L3'), '前沿': ('strategy', 'L4')}
    titles = {r['title'].strip() for r in records}
    urls = {key(r.get('url')) for r in records if r.get('url')}
    added = []
    for row in rows[1:]:
        get = lambda name: row[headers[name]]
        title = str(get('合集标题') or '').strip()
        raw = str(get('源链接') or '').strip()
        links = re.findall(r'https?://[^\s；，]+', raw)
        if not title or title in titles or (len(links) == 1 and key(links[0]) in urls):
            continue
        board, level = mapping[get('板块')]
        number = max([int(r['id'].split('-')[-1]) for r in records if r['board'] == board] or [0]) + 1
        description = str(get('合集简介/视频简介') or '').strip()
        item = dict(id=f'{board}-{number:02d}', board=board, level=level, title=title,
                    description=description, platform=str(get('来源') or ''), region='cn',
                    media='video', collection=True, recommended=False, publishedAt='2026-11-02')
        if links:
            item['url'] = 'https://www.bilibili.com/video/' + key(links[0]) + '/' if key(links[0]).startswith('BV') else links[0]
        if get('视频数'):
            item['episodes'] = int(get('视频数'))
        if get('备注'):
            item['note'] = str(get('备注'))
        if get('推荐理由（亮点与学习收获）'):
            item['recommendationReason'] = str(get('推荐理由（亮点与学习收获）'))
        match = re.search(r'原网播放量\s*([\d.]+)万', description)
        if match and len(links) == 1:
            item['views'] = round(float(match.group(1)) * 10000)
        if len(links) > 1:
            parts = re.split(r'\n\s*\n', raw)
            item['videos'] = [{'title': re.sub(r'^\d+[.、]\s*', '', part.split('\n')[0]).strip(),
                               'url': url} for part, url in zip(parts, links)]
        records.append(item)
        titles.add(title)
        if len(links) == 1:
            urls.add(key(links[0]))
        added.append(item)
    header = '// 资源目录：保留原评审资源及稳定ID，新增数据来自 ' + source.name + '\n'
    header += "import type { Resource } from '../types'\n\nexport const resources: Resource[] = "
    target.write_text(header + json.dumps(records, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'added': [{'id': r['id'], 'title': r['title']} for r in added], 'total': len(records)}, ensure_ascii=False))

if __name__ == '__main__':
    main()
