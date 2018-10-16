"""Uploads apk to rollout track with user fraction."""

import sys
import socket
from apiclient.discovery import build
from oauth2client.service_account import ServiceAccountCredentials
import subprocess
import xml.etree.ElementTree as ET
import os

TRACK = 'beta'
USER_FRACTION = 1
APK_FILE = '../platforms/android/build/outputs/apk/release/android-release.apk'
CREDENTIALS_JSON = 'playstore-service-account.json'


def main(argv):
    package_name = os.environ.get('PACKAGE_NAME')
    if package_name:
        print('using provided package name', package_name)
    else:
        # get package name from somewhere
        print('finding package name')
        package_name = ET.parse('../platforms/android/res/xml/config.xml').getroot().attrib['id']
        print('found package name', package_name)
    print()

    apk_file = os.environ.get('APK_FILE')
    if apk_file is None:
        print('using default apk file path', APK_FILE)
        apk_file = APK_FILE

    print('Retrieving release notes from CHANGELOG.md...')
    releaseText = subprocess.run('../../scripts/get_newest_release.js', stdout=subprocess.PIPE).stdout.decode()
    print()
    print(releaseText)
    print()

    credentials = ServiceAccountCredentials.from_json_keyfile_name(
        CREDENTIALS_JSON, scopes=['https://www.googleapis.com/auth/androidpublisher']
    )

    print('Found credentials, trying to connect...')

    socket.setdefaulttimeout(900)
    service = build('androidpublisher', 'v3', credentials=credentials)

    edit_response = service.edits().insert(body={}, packageName=package_name).execute()
    edit_id = edit_response['id']
    print('Inserted edit with ID', edit_id)

    print('Uploading APK...')

    apk_response = service.edits().apks().upload(
        editId=edit_id, packageName=package_name, media_body=apk_file
    ).execute()

    print('Version code %d has been uploaded' % apk_response['versionCode'])

    track_response = service.edits().tracks().patch(
        editId=edit_id,
        track=TRACK,
        packageName=package_name,
        body={
            'releases': [{
                'releaseNotes': [{
                    'text': releaseText,
                    'language': 'en-US'
                }],
                'versionCodes': [apk_response['versionCode']],
                'userFraction': USER_FRACTION,
                'status': 'inProgress',
            }]
        }
    ).execute()

    print('Track %s is set with releases: %s' % (track_response['track'], str(track_response['releases'])))

    commit_request = service.edits().commit(editId=edit_id, packageName=package_name).execute()

    print('Edit "%s" has been committed' % (commit_request['id']))


if __name__ == '__main__':
    main(sys.argv)
