import pytest


@pytest.fixture(autouse=True)
def enable_db_access_for_all_tests(db):
    pass
