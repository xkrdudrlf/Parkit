"""Util functions for Park It backend"""

from i18naddress import InvalidAddress, normalize_address
from .models import CustomUser, ParkingSpace
class AddressValidation:
    """
    Address validation class to store and validate address data

    Attributes:
        street_address (str): Street address
        city (str): City
        country_area (str): State
        postal_code (str): Postal code
        country_code (str): Country code
        errors (dict): Errors from address validation

    Methods:
        __init__ (self, data): Initialise address validation
        validate(self): Validates address data
        get(self, key, default=None): Returns address data
        copy(self): Returns a copy of address data in a dictionary
    """

    def __init__(self, data):
        """Initialise address validation"""
        self.street_address = data.pop('streetAddress')
        self.city = data.pop('city')
        self.country_area = data.pop('state')
        self.postal_code = data.pop('postcode')
        self.country_code = 'AU'
        self.errors = {}


    def validate(self):
        """Validates address data"""
        valid_address = {}
        try:
            valid_address = normalize_address(self.__dict__)
        except InvalidAddress as e:
            self.errors = e.errors
        return valid_address or self

    def get(self, key, default=None):
        """Returns address data"""
        if key == 'country_code':
            return self.country_code
        elif key == 'country_area':
            return self.country_area
        elif key == 'city':
            return self.city
        elif key == 'postal_code':
            return self.postal_code
        else:
            return default

    def copy(self):
        """Returns a copy of address data in a dictionary"""
        return self.__dict__

def getCoords(address):
    """Returns coordinates of a provided address"""
    import requests, os

    GOOGLE_MAPS_API_KEY = os.getenv('GOOGLE_MAPS_API_KEY', 'AIzaSyCwTgq7juhaZiACJFsYWm-dZgvhQRvvFw4')
    url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address.replace(" ", "+") + f'&key={GOOGLE_MAPS_API_KEY}'
    response = requests.get(url).json()

    return (float(response['results'][0]['geometry']['location']['lat']), float(response['results'][0]['geometry']['location']['lng']))

def getUser(pk):
    """Returns user object associated with given id"""
    user_obj = CustomUser.objects.get(id=pk)
    return user_obj

def getParkingSpace(pk):
    """Returns parking space object associated with given id"""
    parking_obj = ParkingSpace.objects.get(id=pk)
    return parking_obj