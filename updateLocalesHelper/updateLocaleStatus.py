#! /bin/env python
import json
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

token = get_token()

headers = {
    "accept": "application/vnd.api+json",
    "authorization": "Bearer 1/3e9a53a82627ec70dcc6ab1472e84246f572be82"
}

r = requests.get('https://rest.api.transifex.com/resource_language_stats?filter[project]=o%3Ayunity-1%3Ap%3Akarrot', headers=headers)

if r.status_code != 200:
    print('Failed to get translation status!')
    print('Response is:')
    print(r.json())
    sys.exit(1)

progress_dict = {}
for resource in r.json()['data']:
    lang = resource['id'].split(':')[-1]
    progress = progress_dict.get(lang, {'translated': 0, 'total': 0})
    progress['total'] += resource['attributes']['total_strings']
    progress['translated'] += resource['attributes']['translated_strings']
    progress_dict[lang] = progress

print(progress_dict)
percentage_dict = {lang: round((progress['translated']/progress['total'])*100) for lang, progress in progress_dict.items()}
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
