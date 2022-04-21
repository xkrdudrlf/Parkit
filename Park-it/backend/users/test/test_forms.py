from django.test import TestCase
from ..forms import *

# Create your tests here.
class ParkingCreationTests(TestCase):
    def test_title_starting_lowercase(self):
        form = ParkingCreation(data={"title": "a lowercase title"})

        self.assertEqual(
            form.errors["title"], ["Should start with an uppercase letter"]
        )

    def test_title_ending_full_stop(self):
        form = AddBookForm(data={"title": "A stopped title."})

        self.assertEqual(form.errors["title"], ["Should not end with a full stop"])

    def test_title_with_ampersand(self):
        form = AddBookForm(data={"title": "Dombey & Son"})

        self.assertEqual(form.errors["title"], ["Use 'and' instead of '&'"])