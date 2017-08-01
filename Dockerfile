# Build this container:
#       docker build -t backend .

# Run this container, including your most recent source code changes:
#       docker run -it -p 8000:8000 -v $PWD/foodsaving:/foodsaving-backend/foodsaving backend
# Note 1: This assumes that your terminal's working directory is in the
# foodsaving-backend directory, i.e. the directory you cloned from Github.
# Note 2: Only changes you make in the "foodsaving" directory are included.

# Once in the container, you can
#   Populate your database with test data:
#       python manage.py create_sample_data
#   With this data, you can log in as one of the printed e-mail addresses with password 123

#   Run the server with
#       python manage.py runserver 0.0.0.0:8000


FROM ubuntu:16.04

RUN apt-get update; apt-get --yes upgrade; apt-get install --yes git redis-server python3 python3-dev python-virtualenv postgresql postgresql-server-dev-9.5 gcc build-essential g++ libffi-dev libncurses5-dev sudo vim

# Postgres setup
RUN echo 'fsync = off' >> /etc/postgresql/9.5/main/postgresql.conf; service postgresql start; sudo -i -u postgres psql -c "CREATE USER root WITH SUPERUSER LOGIN PASSWORD 'root';"; sudo -i -u postgres createdb fstool-db; service postgresql stop

# Python virtualenv setup
COPY requirements.txt /
RUN rm -rf /env; virtualenv -p /usr/bin/python3 /env; bash -c 'source /env/bin/activate; pip install -r /requirements.txt'

# Django setup
COPY . /foodsaving-backend
WORKDIR /foodsaving-backend
RUN cd config; sed 's/fstool-user/root/g; s/fstool-pw/root/g' local_settings.py.example > local_settings.py
RUN bash -c 'source /env/bin/activate; service postgresql start; python manage.py migrate'; service postgresql stop
RUN echo 'source /env/bin/activate' >> /root/.bashrc

EXPOSE 8000
EXPOSE 5432
# The '0.0.0.0:8000' makes the server listen on 0.0.0.0 instead of 127.0.0.1.
# It seems docker cannot expose services bound to the loopback interface.
CMD bash -c 'service postgresql start; service redis-server start; cd /foodsaving-backend; bash'

