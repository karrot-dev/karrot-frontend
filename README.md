# yunity
Hello Yunity!

## Getting started

### Install Pycharm
- wget https://download.jetbrains.com/python/pycharm-professional-4.5.4.tar.gz
- tar xf pycharm-professional-4.5.4.tar.gz
- ./pycharm-4.5.4/bin/pycharm.sh

### Create the environment
- git clone git@github.com:yunity/yunity.git ~/yunity
- sudo yum install python3 python-virtualenv
- virtualenv --python=python3 --no-site-packages ~/yunity/env
- source ~/yunity/env/bin/activate
- pip install -r ~/yunity/requirements.pip

### Setting up git hooks to take a webcam picture on commit
- install fswebcam
- create a file post-commit in the .git/hooks directory:
  MAIL=`git config --get user.email`
  fswebcam -r 640x480 --jpeg 85 -D 0 "images/$MAIL-%Y%m%d_%H%M%S".jpg
- create the images subfolder: mkdir images

### Run the project
- charm ~/yunity
- Set the project interpreter to ~/yunity/env/bin/python
- Run yunity (Shift+F10)

## Settings

In development, you can add and override local settings in
`wuppdays/local_settings.py`, which is present in `.gitignore` and hence out of
version control. If the file is not present, i.e. in production, nothing
happens.
