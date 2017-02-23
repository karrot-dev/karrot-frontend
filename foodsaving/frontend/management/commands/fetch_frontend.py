import tarfile
import os
import tempfile
import shutil
import fileinput

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError

from urllib.request import urlretrieve

ARCHIVE_URL = 'https://foodsaving.world/archive.tar.gz'

DEST_DIR = os.path.join(settings.BASE_DIR, 'foodsaving/frontend/static')
INDEX_HTML = os.path.join(DEST_DIR, 'index.html')

class Command(BaseCommand):
    help = 'Fetches the latest static frontend'

    def handle(self, *args, **options):

        # TODO: check if version is different before downloading...

        # TODO: won't work under windows... pass delete=False and cleanup
        # https://bugs.python.org/issue14243
        tf = tempfile.NamedTemporaryFile()

        self.stdout.write('Downloading from %s' % ARCHIVE_URL)
        filename, headers = urlretrieve(ARCHIVE_URL, tf.name)

        # empty dir
        self.stdout.write('Emptying %s' % DEST_DIR)
        shutil.rmtree(DEST_DIR)
        os.makedirs(DEST_DIR)

        # go into dest and unpack
        self.stdout.write('Unpacking archive')
        os.chdir(DEST_DIR)
        tar = tarfile.open(tf.name, "r:gz")
        tar.extractall()

        # cleanup
        # TODO: put them in a finally
        tar.close()
        tf.close()

        # rewrite index.html to specify <base href=""> correctly
        # TODO: use a better way for find and replace
        # see comments on http://stackoverflow.com/a/20593644
        with fileinput.FileInput(INDEX_HTML, inplace=True, backup='.bak') as file:
            for line in file:
                print(line.replace('<base href="/">', '<base href="%s">' % settings.STATIC_URL), end='')

        self.stdout.write(self.style.SUCCESS('Success!'))