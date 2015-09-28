from math import sin, cos, e, pi, sqrt

from django.core.cache import cache
from django.test import TestCase


class TestSanity(TestCase):

    def test_addition(self):
        self.assertEqual(2 + 2, 4)
        self.assertEqual(2 - 2, 0)

    def test_trigonometry(self):
        for x in [1, 2, 3.1415]:
            self.assertAlmostEqual(sin(x) ** 2 + cos(x) ** 2, 1.0)

    def test_redis_running(self):
        cache.set('test-key', 1)
        self.assertEqual(cache.get('test-key'), 1)