#! /bin/env python
import txclib.project as project
import json
STATUS_FILE = './client/app/locales/status-frontend.json'
prj = project.Project()
prj.pull()
s  = prj._get_stats_for_resource()
with open(STATUS_FILE, 'w') as f:
    json.dump(s, f, sort_keys=True, indent=2)
    print("Updated", STATUS_FILE)