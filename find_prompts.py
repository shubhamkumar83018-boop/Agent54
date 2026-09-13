import json

lines = []
with open(r'C:\Users\HP\.gemini\antigravity\brain\3117fa00-6445-430b-a52c-23125b9cd419\.system_generated\logs\transcript_full.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        lines.append(json.loads(line))

env_step = 153
# Get ALL replacement content for App.tsx changes at steps 42-100 (Recent Compliance Status + Compliance by Category + View All)
for obj in lines:
    if obj['step_index'] >= env_step:
        break
    if obj['step_index'] < 40:
        continue
    if obj.get('type') == 'PLANNER_RESPONSE' and obj.get('tool_calls'):
        for call in obj['tool_calls']:
            if call['name'] in ('write_to_file', 'replace_file_content') and 'App.tsx' in str(call['args'].get('TargetFile', '')):
                print(f"\n{'='*80}")
                print(f"STEP {obj['step_index']} - {call['name']}")
                if call['name'] == 'replace_file_content':
                    rc = call['args'].get('ReplacementContent','')
                    print('REPLACEMENT (full):')
                    print(rc.encode('utf-8').decode('utf-8'))
                else:
                    cc = call['args'].get('CodeContent','')
                    print('WRITE (first 3000):')
                    print(cc[:3000])
