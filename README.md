# yunity
Hello Yunity!

## Getting started

### Create the environment
- sudo yum install python3 python-virtualenv
- virtualenv --python=python3 --no-site-packages ~/yunity/env
- source ~/yunity/env/bin/activate

### Install Pycharm
- wget https://download.jetbrains.com/python/pycharm-professional-4.5.4.tar.gz
- tar xf pycharm-professional-4.5.4.tar.gz
- ./pycharm-4.5.4/bin/pycharm.sh

### Open the project
- git clone https://github.com/yunity/yunity.git ~/yunity
- pip install -r ~/yunity/requirements.pip
- charm ~/yunity
- Set the project interpreter to ~/yunity/env-python3
- Run yunity (Shift+F10)

## Settings

In development, you can add and override local settings in `wuppdays/local_settings.py`, which is present in
`.gitignore` and hence out of version control. If the file is not present, i.e. in production, nothing happens.