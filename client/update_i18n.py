#! /bin/env python
import json
import txclib.project as project

STATUS_FILE = './src/locales/status-frontend.json'
PRJ = project.Project()
PRJ.pull()
STATS = PRJ._get_stats_for_resource()
with open(STATUS_FILE, 'w') as f:
    json.dump(STATS, f, sort_keys=True, indent=2)
    print("Updated", STATUS_FILE)
