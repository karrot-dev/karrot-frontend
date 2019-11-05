#! /bin/env python
import json
from txclib import utils
from txclib import config
import requests
import os
import sys
import configparser

script_path = os.path.dirname(os.path.realpath(sys.argv[0]))

status_file = os.path.join(script_path, '../src/locales/translationStatus.json')
config_file = os.path.join(script_path, '../.tx/config')

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

config = configparser.ConfigParser()
config.read(config_file)
lang_map_raw = config.get('main', 'lang_map')
lang_map = {}
for arg in lang_map_raw.replace(' ', '').split(','):
    k, v = arg.split(":")
    lang_map.update({k: v})

# translate to HTTP Accept-Language format
def translate_key(key):
    if key in lang_map:
        key = lang_map[key]
    return key.replace('_', '-').lower()

translated_dict = { translate_key(k): v for (k, v) in percentage_dict.items() }

with open(status_file, 'w') as f:
    json.dump(translated_dict, f, sort_keys=True, indent=2)
    print("Updated", status_file)
