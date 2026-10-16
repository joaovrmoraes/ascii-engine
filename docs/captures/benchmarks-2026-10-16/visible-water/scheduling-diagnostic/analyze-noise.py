from pathlib import Path
from datetime import datetime
import json
root=Path(__file__).resolve().parent
host=[json.loads(x) for x in (root/'host-samples.jsonl').read_text().splitlines()]
intervals=[]
for a,b in zip(host,host[1:]):
 row={'start':a['timestamp'],'end':b['timestamp']}
 for cpu in ['cpu6','cpu7']:
  d=[y-x for x,y in zip(a['cpuTicks'][cpu],b['cpuTicks'][cpu])];row[cpu]=100*(1-(d[3]+d[4])/sum(d))
 row['frequencyKHz']=b['frequencyKHz'].get('cpu6');intervals.append(row)
results=[]
for n in [1,2]:
 r=json.loads((root/f'attempt-1/water-visible-2-round-{n}/water-visible-2.json').read_text())
 for i,run in enumerate(r['runs']):
  t0=datetime.fromisoformat(run['before']['timestamp'].replace('Z','+00:00')).timestamp();t1=datetime.fromisoformat(run['after']['timestamp'].replace('Z','+00:00')).timestamp()
  weights=[(max(0,min(b['end'],t1)-max(b['start'],t0)),b) for b in intervals];total=sum(w for w,b in weights)
  row={'round':n,'run':i+1,'frameP50':run['summary']['frameMs']['p50'],'cpuP50':run['summary']['frameCpuMs']['p50']}
  if total:
   for k in ['cpu6','cpu7','frequencyKHz']:row[k]=sum(w*b[k] for w,b in weights)/total
  results.append(row)
print(json.dumps(results,indent=2))
(root/'noise-analysis.json').write_text(json.dumps(results,indent=2)+'\n')
