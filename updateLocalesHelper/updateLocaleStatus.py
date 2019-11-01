#! /bin/env python
import json
import os
import requests
import sys

from configparser import ConfigParser
from txclib import utils
from txclib import config


STATUS_FILE_PATH = '../src/locales/translationStatus.json'
CONFIG_FILE_PATH = '../.tx/config'
SCRIPT_PATH = os.path.dirname(os.path.realpath(sys.argv[0]))
TRANSLATION_URL = 'https://api.transifex.com/organizations/yunity-1/projects/karrot/'
DEFAULT_TOKEN_URL = 'https://www.transifex.com'

STATUS_FILE = os.path.join(SCRIPT_PATH, STATUS_FILE_PATH)
CONFIG_FILE = os.path.join(SCRIPT_PATH, CONFIG_FILE_PATH)


def get_token():
    token = os.environ.get('TX_TOKEN')
    if token:
        return token

    txrc_file = utils.get_transifex_file()
    txrc = config.OrderedRawConfigParser()
    txrc.read((txrc_file,))
    return txrc.get(DEFAULT_TOKEN_URL, 'token')
        

def get_translation_status(token):
    response = requests.get(TRANSLATION_URL, auth=('api', token))
    if response.status_code != requests.codes.OK:
        print('Failed to get translation status!\n')
        print(response.json())
        sys.exit(1)
    return response.json()['stats']


def map_status_to_percentage(translation_status):
    percentage_dict = {lang: round(v['translated']['percentage']*100) for lang, v in translation_status.items()}
    percentage_dict['en'] = 100
    return percentage_dict


def get_raw_language_map_from_config_file(config_file):
    configuration = ConfigParser()
    configuration.read(config_file)
    lang_map_raw = configuration.get('main', 'lang_map').replace(' ', '').split(',')
    return lang_map_raw


def clean_lang_map_raw(lang_map_raw):
    lang_map = dict()
    for arg in lang_map_raw:
        k, v = arg.split(":")
        lang_map[k] = v
    return lang_map


def translate_key(key, lang_map):
    """Translate to HTTP Accept-Language format"""
    if key in lang_map:
        key = lang_map[key]
    return key.replace('_', '-').lower()


def get_translated_dict(lang_map, percentage_dict):
    for k, v in percentage_dict.items():
        translate_key(k, lang_map)
    return percentage_dict


def write_dict_to_file(dictionary, filename):
    with open(STATUS_FILE, 'w') as f:
        json.dump(dictionary, f, sort_keys=True, indent=2)
        print("Updated", STATUS_FILE)


token = get_token()
translation_status = get_translation_status(token)
percentage_dict = map_status_to_percentage(translation_status)

lang_map_raw = get_raw_language_map_from_config_file(CONFIG_FILE)
lang_map = clean_lang_map_raw(lang_map_raw)

translated_dict = get_translated_dict(lang_map, percentage_dict)

write_dict_to_file(translated_dict, STATUS_FILE)
