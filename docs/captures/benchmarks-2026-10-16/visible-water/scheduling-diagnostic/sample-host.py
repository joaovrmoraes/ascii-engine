import os,time,json,glob
output='.cache/visible-water-study/host-samples.jsonl'
with open('.cache/visible-water-study/host-sampler.pid','w') as f:f.write(str(os.getpid()))
with open(output,'a',buffering=1) as f:
 while True:
  row={'timestamp':time.time(),'frequencyKHz':{},'thermal':{},'benchmarkProcesses':[],'loadavg':open('/proc/loadavg').read().strip(),'cpuTicks':{line.split()[0]:[int(n) for n in line.split()[1:]] for line in open('/proc/stat') if line.startswith(('cpu6 ','cpu7 '))},'cpuPressure':open('/proc/pressure/cpu').read().strip()}
  row['observerProcesses']=[]
  for observer in [9182,9861,10474,3442610]:
   try:
    stat=open(f'/proc/{observer}/stat').read().split(') ',1)[1].split();row['observerProcesses'].append({'pid':observer,'userTicks':int(stat[11]),'systemTicks':int(stat[12]),'processor':int(stat[36])})
   except OSError:pass
  for p in glob.glob('/sys/devices/system/cpu/cpu[0-9]*/cpufreq/scaling_cur_freq'):
   try:row['frequencyKHz'][p.split('/')[5]]=int(open(p).read())
   except OSError:pass
  for p in glob.glob('/sys/class/thermal/thermal_zone*/temp'):
   try:row['thermal'][open(p.replace('/temp','/type')).read().strip()]=int(open(p).read())/1000
   except OSError:pass
  for p in glob.glob('/proc/[0-9]*/cmdline'):
   try:
    cmd=open(p,'rb').read()
    if b'/tmp/ascii-benchmark-' not in cmd or b'chromium' not in cmd:continue
    stat=open(p.replace('cmdline','stat')).read().split(') ',1)[1].split()
    row['benchmarkProcesses'].append({'pid':int(p.split('/')[2]),'kind':'renderer' if b'--type=renderer' in cmd else 'gpu' if b'--type=gpu-process' in cmd else 'other','userTicks':int(stat[11]),'systemTicks':int(stat[12]),'processor':int(stat[36]),'mainThreadSchedstat':[int(n) for n in open(p.replace('cmdline','schedstat')).read().split()]})
   except (OSError,ValueError,IndexError):pass
  f.write(json.dumps(row)+'\n');time.sleep(10)
