#! /bin/env python
import json
import txclib.project as project

status_file = './src/locales/status-frontend.json'
project = project.Project()
project.pull()
stats = project._get_stats_for_resource()
with open(status_file, 'w') as f:
    # switch to HTTP Accept-Language format
    for key in stats.keys():
        if '_' in key:
          new_key = key.replace('_', '-').lower()
          stats[new_key] = stats.pop(key)
    json.dump(stats, f, sort_keys=True, indent=2)
    print("Updated", status_file)
