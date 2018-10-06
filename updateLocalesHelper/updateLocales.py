#! /bin/env python
import json
import txclib.project as project
from txclib import utils
from txclib import config
import requests
import os
import sys

script_path = os.path.dirname(os.path.realpath(sys.argv[0]))

status_file = os.path.join(script_path, '../src/locales/translationStatus.json')

def get_token():
    token = os.environ.get('TX_TOKEN')
    if token:
        return token

    txrc_file = utils.get_transifex_file()
    txrc = config.OrderedRawConfigParser()
    txrc.read((txrc_file,))
    return txrc.get('https://www.transifex.com', 'token')

token = get_token()

r = requests.get('https://api.transifex.com/organizations/yunity-1/projects/karrot/',
  auth=('api', token)
)

if r.status_code != 200:
    print('Failed to get translation status!')
    print('Response is:')
    print(r.json())
    sys.exit(1)

stats = r.json()['stats']
percentage_dict = {lang: round(v['translated']['percentage']*100) for lang, v in stats.items()}
percentage_dict['en'] = 100

# translate to HTTP Accept-Language format
for key in percentage_dict.keys():
  if '_' in key:
    new_key = key.replace('_', '-').lower()
    percentage_dict[new_key] = percentage_dict.pop(key)

with open(status_file, 'w') as f:
    json.dump(percentage_dict, f, sort_keys=True, indent=2)
    print("Updated", status_file)

project = project.Project()
project.pull()
