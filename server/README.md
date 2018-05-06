# karrot-backend

Django API server for the _karrot_ frontend

Our issues are tracked in [karrot-frontend](https://github.com/yunity/karrot-frontend/issues). We plan to unite karrot-backend, karrot-frontend and related repos in near future.

[![CircleCI](https://circleci.com/gh/yunity/karrot-backend.svg?style=svg)](https://circleci.com/gh/yunity/karrot-backend)
[![codecov](https://codecov.io/gh/yunity/karrot-backend/branch/master/graph/badge.svg)](https://codecov.io/gh/yunity/karrot-backend)

## Developer setup

The recommended way to getting your developer environment setup is docker-compose - includes backend, frontend, mail catcher, postgres, redis, etc..

Head over to [yunity/karrot-docker](https://github.com/yunity/karrot-docker) for further instructions.

If you can't or don't want to use docker-compose, look into [SETUP.md](SETUP.md) for other ways.
 
## Coding guidelines

We follow PEP8 with the same rules as the [Django project](https://docs.djangoproject.com/en/dev/internals/contributing/writing-code/coding-style/).
As always, the coding style may not apply at some parts.
You can execute `flake8` in the repository root to check your code.

Code will only be accepted into `master` if it passes the PEP8 test.

## Using the API
A live instance of _karrot_ is running at https://karrot.world/. See https://karrot.world/docs/ for API documentation. Most endpoints are only available to authenticated users. Be sure to create an account and log in to see all endpoints.

## IDE
Most of karrot developers use [PyCharm](https://www.jetbrains.com/pycharm/download/). We have some licenses available for the professional version. The free community edition also works well.

To get proper introspection and support from PyCharm, it's necessary to set up a virtualenv. Run this inside the backend directory:

```
virtualenv env
source ./env/bin/activate
pip install pip-tools
./sync.py
```

## Django quick introduction

The manage.py application can be used to perform administrative tasks:

  - makemigrations: Create database migrations
  - migrate: Apply database migrations
  - shell\_plus: (requires ipython) for playing in a django python environment
  - test: Run automated tests
  
You can launch them via docker-compose, for example:

```
docker-compose exec backend ./manage.py makemigrations
docker-compose exec backend ./manage.py migrate
```

If you spend too much time typing those long commands, consider creating your own [bash aliases](https://askubuntu.com/questions/17536/how-do-i-create-a-permanent-bash-alias).

## Parallel testing
Running the tests in parallel process can increase testing speed significantly. 
To execute the whole test suite on a CPU with 4 kernels, you may want to use:

```
docker-compose exec backend ./manage.py test --parallel 4
```

## Email template viewer

When editing emails it's useful to be able to see how they will be rendered.

Assuming the server is running you can visit visit [localhost:8000/\_templates](http://localhost:8000/_templates).

To compile the `.mjml` templates to `.html.jinja2` files you can run:
```
cd mjml
yarn
./convert
```

If you want to watch for changes, and support hot reloading then run:

```
./convert --watch
```

(refresh your browser after starting the server as the websocket is not reconnecting)

_Note: you should never edit `.html.jinja2` files directly._ 


Enjoy! ... oh and be sure to visit https://mjml.io/documentation/#components to find some nice components to use.
