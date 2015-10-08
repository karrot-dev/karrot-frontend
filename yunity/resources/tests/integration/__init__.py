"""
This package contains data files for our API integration tests.

In order to add a new integration test, create a new package with the following contents:
```
yunity/resources/tests/integration/test_name__tested_functionality
    |-- __init__.py
    |-- initial_data.py  # defines the calls to setup the database with the data you need to run your test
    |-- request.py       # defines the request to the API in a `request` dictionary variable and imports initial_data.py
    |-- response.py      # defines the expectations on the API return value in a `reponse` dictionary variable
    `-- final_data.py    # defines the expectations on the database after the API call has finished
```
"""