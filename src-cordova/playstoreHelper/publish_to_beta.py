"""Uploads apk to rollout track with user fraction."""

import sys
import socket
from apiclient.discovery import build
from oauth2client.service_account import ServiceAccountCredentials
import subprocess
import xml.etree.ElementTree as ET
import os
from pathlib import Path

TRACK = 'beta'
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
    if len(releaseText) > 500:
        releaseText = releaseText[:495] + '\n...'
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
                'status': 'completed',
            }]
        }
    ).execute()

    print('Track %s is set with releases: %s' % (track_response['track'], str(track_response['releases'])))

    if package_name == 'world.karrot':
        assets = Path('../playstoreAssets')
        language = 'en-US'

        listing = assets / language / 'listing'
        with (listing / 'shortDescription.txt').open() as shortDescription, \
             (listing / 'fullDescription.txt').open() as fullDescription:
            service.edits().listings().update(
                editId=edit_id,
                packageName=package_name,
                language=language,
                body={
                    'title': 'Karrot',
                    'language': language,
                    'shortDescription': shortDescription.read(),
                    'fullDescription': fullDescription.read(),
                    'video': '',
                }
            ).execute()

        print('Listing of %s has been updated' % package_name)

        images_path = assets / language / 'images'
        imageTypes = (
            'featureGraphic',
            'icon',
            'phoneScreenshots',
            'sevenInchScreenshots',
            'tenInchScreenshots',
            'tvBanner',
            'tvScreenshots',
            'wearScreenshots',
        )
        images = [str(p) for p in images_path.iterdir()]
        sha1 = subprocess.run(['sha1sum', *images], stdout=subprocess.PIPE).stdout.decode()
        sha1_images = {sha1: path for (sha1, path) in [i.split() for i in sha1.splitlines()]}

        for imageType in imageTypes:
            our_images = {
                sha1: path
                for (sha1, path) in sha1_images.items() if path.split('/')[-1].startswith(imageType)
            }

            images_response = service.edits().images().list(
                editId=edit_id,
                packageName=package_name,
                language=language,
                imageType=imageType,
            ).execute()
            their_images = images_response.get('images') or []
            their_images = {i['sha1']: i['id'] for i in their_images}

            to_upload = [our_images.get(k) for k in (our_images.keys() - their_images.keys())]
            to_delete = [their_images.get(k) for k in (their_images.keys() - our_images.keys())]

            for image_id in to_delete:
                service.edits().images().delete(
                    editId=edit_id,
                    packageName=package_name,
                    language=language,
                    imageType=imageType,
                    imageId=image_id,
                ).execute()
                print('Deleted', image_id)

            for path in to_upload:
                service.edits().images().upload(
                    editId=edit_id,
                    packageName=package_name,
                    language=language,
                    imageType=imageType,
                    media_body=path,
                ).execute()
                print('Uploaded', path)

    commit_request = service.edits().commit(editId=edit_id, packageName=package_name).execute()

    print('Edit "%s" has been committed' % (commit_request['id']))


if __name__ == '__main__':
    main(sys.argv)
