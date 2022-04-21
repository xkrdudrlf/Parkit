"""Models for Park It database"""

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError

##  USER MODELS
class CustomUser(AbstractUser):
    """
    Custom user model extending the AbstractUser model

    Extended Fields:
        phone_number (str): User's phone number
        card_number (str): User's card number
        expiry_date (str): User's card expiry date
        cvc (str): User's card CVC
        bsb (str): User's bank's BSB
        account_number (str): User's bank account number
        account_name (str): User's bank account name
        is_staff (bool): User's staff status

    Methods:
        __str__: Returns the username of the user as string
    """

    phone_number = models.CharField(max_length=20)
    card_number = models.CharField(max_length=16)
    expiry_date = models.CharField(max_length=5)
    cvc = models.CharField(max_length=3)
    bsb = models.CharField(max_length=6)
    account_number = models.CharField(max_length=10)
    account_name = models.CharField(max_length=100)
    is_staff = models.BooleanField(default=False)

    def __str__(self):
        """Returns the username of the user as string"""
        return self.username

# # CONSUMER MODELS
class Vehicle(models.Model):
    """
    Custom vehicle model extending the standard Django DB model

    Attrubutes:
        user (ForeignKey: CustomUser): User who owns the vehicle
        carMake (CharField: str): Vehicle's make
        carModel (CharField: str): Vehicle's model
        carYear (IntegerField: int): Vehicle's year
        carColour (CharField: str): Vehicle's colour
        carPlate (CharField: str): Vehicle's plate number

    Methods:
        __str__: Returns the vehicle's owner, colour make, model and year as string
    """
    user = models.ForeignKey('CustomUser', on_delete=models.CASCADE)
    carMake = models.CharField(max_length=100)
    carModel = models.CharField(max_length=100)
    carYear = models.IntegerField()
    carColour = models.CharField(max_length=100)
    carRego = models.CharField(max_length=7, unique=True)

    def __str__(self):
        """Returns the vehicle's owner, colour make, model and year as string"""
        return f"{self.user.username}'s {self.carColour} {self.carMake} {self.carModel} ({self.carYear})"


class Favourite(models.Model):
    """
    Custom favourite model extending the standard Django DB model

    Fields:
        consumer (ForeignKey: CustomUser): User who favourited the parking space
        parkingSpace (ForeignKey: ParkingSpace): Parking space that was favourited

    Methods:
        __str__: Returns the user's username and the favourited parking space as string
    """
    consumer = models.ForeignKey('CustomUser', on_delete=models.CASCADE, related_name='consumer_favourite')
    parkingSpace = models.ForeignKey('ParkingSpace', on_delete=models.RESTRICT)

    def __str__(self):
        """Returns the user's username and the favourited parking space as string"""
        return f"{self.consumer.username} favourited {self.parkingSpace}"

# # PROVIDER MODELS

# Choices for the parking space status
STATUS = (
    ('pending', 'pending'),
    ('approved', 'approved'),
    ('cancelled', 'cancelled'),
    ('rejected', 'rejected')
)

# Choices for the parking space size
SIZE = (
    ('Hatchback', 'Hatchback'),
    ('Sedan', 'Sedan'),
    ('4WD/SUV', '4WD/SUV'),
    ('Van', 'Van'),
)
class ParkingSpace(models.Model):
    """
    Custom parking space model extending the standard Django DB model

    Fields:
        provider (ForeignKey: CustomUser): User who owns the parking space
        streetAddress (CharField: str): Parking space's street address
        city (CharField: str): Parking space's city
        state (CharField: str): Parking space's state
        postcode (CharField: str): Parking space's postcode
        longitude (FloatField: float): Parking space's longitude
        latitude (FloatField: float): Parking space's latitude
        price (IntegerField: int): Parking space's price
        size (CharField: str): Parking space's size, must be from the SIZE choices
        notes (TextField: str): Parking space's notes
        startTime (TimeField: datetime): Parking space's availability start time
        endTime (TimeField: datetime): Parking space's availability end time
        status (CharField: str): Parking space's status, must be from the STATUS choices
        avg_rating (DecimalField: decimal): Parking space's average rating
        n_ratings (IntegerField: int): Parking space's number of ratings
        latestTime (TimeField: datetime): Parking space's latest booking's endTime
        is_active (BooleanField: bool): Parking space's active status

    Methods:
        getCoords: Returns the parking space's longitude and latitude as tuple
        save: Overrides the save method to update the parking space's longitude and latitude
        clean: Overrides the clean method to validate the parking space's availability
            (startTime and endTime) against the latestTime
        __str__: Returns the parking space's owner, street address, city and postcode as string
    """

    provider = models.ForeignKey('CustomUser', on_delete=models.CASCADE)
    streetAddress = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=3)
    postcode = models.CharField(max_length=4)
    longitude = models.FloatField(blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    price = models.IntegerField()
    size = models.CharField(max_length=50, choices=SIZE, default='Hatchback')
    notes = models.TextField(max_length=10000)
    startTime = models.DateTimeField()
    endTime = models.DateTimeField()
    status = models.CharField(max_length=50, choices=STATUS, default="pending")
    avg_rating = models.DecimalField(max_digits=2, decimal_places=1, blank=True, null=True)
    n_ratings = models.IntegerField(null=True, blank=True, default=0)
    latestTime = models.DateTimeField(null=True,  blank=True)
    is_active = models.BooleanField(default=True)

    def getCoords(self, address):
        """Returns the parking space's longitude and latitude as tuple"""
        import requests, os

        GOOGLE_MAPS_API_KEY = os.getenv('GOOGLE_MAPS_API_KEY', 'AIzaSyCwTgq7juhaZiACJFsYWm-dZgvhQRvvFw4')
        url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address.replace(" ", "+") + f'&key={GOOGLE_MAPS_API_KEY}'
        response = requests.get(url).json()
        return (float(response['results'][0]['geometry']['location']['lat']), float(response['results'][0]['geometry']['location']['lng']))

    def save(self, *args, **kwargs):
        """Overrides the save method to update the parking space's longitude and latitude"""
        addressTuple = (self.streetAddress, self.city, self.state, self.postcode)
        address = ' '.join(addressTuple)
        coords = self.getCoords(address)
        self.longitude = coords[0]
        self.latitude = coords[1]
        super().save(*args, **kwargs)


    def clean(self):
        """Overrides the clean method to validate the parking space's availability"""
        pk = self.pk
        startTime = self.startTime
        endTime = self.endTime

        if startTime > endTime:
            raise ValidationError('Parking space start time must be before the parking space end time')
        qs = Transaction.objects.filter(parkingSpace=pk).exclude(startTime__date__gte=startTime).exclude(endTime__date__lte=endTime)
        if qs.exists():
            raise ValidationError('This availability would violate existing bookings.')

    def __str__(self):
        """Returns the parking space's owner, street address, city and postcode as string"""
        return f"{self.provider.username}'s car space at {self.streetAddress}, {self.city} {self.postcode}"

class Transaction(models.Model):
    """
    Custom transaction model extending the standard Django DB model

    Fields:
        provider (ForeignKey: CustomUser): User who owns the parking space
        consumer (ForeignKey: CustomUser): User who booked the parking space
        parkingSpace (ForeignKey: ParkingSpace): Parking space booked
        startTime (DateTimeField: datetime): Booking start time
        endTime (DateTimeField: datetime): Booking end time
        totalCost (DecimalField: decimal): Booking total cost
        publishDate (DateTimeField: datetime): Booking publish date

    Methods:
        save: Overrides the save method to update the booked parking space's latestTime
        clean: Overrides the clean method to validate the booking's availability
        delete: Overrides the delete method to remove the booking and update the booked parking space's latestTime
        __str__: Returns the booking's consumer, parking space, start time and end time as string
    """

    provider = models.ForeignKey('CustomUser', on_delete=models.CASCADE, related_name='provider_transaction')
    consumer = models.ForeignKey('CustomUser', on_delete=models.CASCADE, related_name='consumer_transaction')
    vehicle = models.ForeignKey('Vehicle', on_delete=models.CASCADE, related_name='vehicle')
    parkingSpace = models.ForeignKey('ParkingSpace', on_delete=models.RESTRICT)
    startTime = models.DateTimeField()
    endTime = models.DateTimeField()
    totalCost = models.DecimalField(max_digits=6, decimal_places=2)
    publishDate = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        """Overrides the save method to update the booked parking space's latestTime"""
        super().save(*args, **kwargs)
        latest = Transaction.objects.filter(parkingSpace = self.parkingSpace).latest('endTime').endTime
        parkingSpace = ParkingSpace.objects.filter(pk=self.parkingSpace.pk).first()
        parkingSpace.latestTime = latest
        parkingSpace.save()

    def clean(self):
        """Overrides the clean method to validate the booking's availability"""
        startTime = self.startTime
        endTime = self.endTime
        if self.provider == self.consumer:
            raise ValidationError('Cannot book own parking space')
        if startTime > endTime:
            raise ValidationError('Booking start time must be before booking end time')
        parkingSpace = ParkingSpace.objects.filter(pk=self.parkingSpace.pk).first()
        if parkingSpace.status == 'cancelled':
            raise ValidationError('The parking space is no longer accepting new bookings')
        if parkingSpace.startTime > startTime or parkingSpace.endTime < endTime or parkingSpace.startTime > endTime or parkingSpace.endTime < startTime:
            raise ValidationError('This booking does not fit within the parking space availability.')
        qs = Transaction.objects.filter(parkingSpace=self.parkingSpace).exclude(startTime__date__gt=endTime).exclude(endTime__date__lt=startTime)
        if qs.exists():
            raise ValidationError('This booking overlaps with an existing booking.')

    def delete(self, *args, **kwargs):
        """Overrides the delete method to remove the booking and update the booked parking space's latestTime"""
        bookingSpace = self.parkingSpace
        super().delete(*args, **kwargs)
        if not Transaction.objects.filter(parkingSpace = bookingSpace).exists():
            parkingSpace = ParkingSpace.objects.filter(pk=bookingSpace.pk).first()
            parkingSpace.latestTime = None
            parkingSpace.save()
            return
        latest = Transaction.objects.filter(parkingSpace = bookingSpace).latest('endTime')
        parkingSpace = ParkingSpace.objects.filter(pk=bookingSpace.pk).first()
        parkingSpace.latestTime = latest.endTime
        parkingSpace.save()

    def __str__(self):
        """Returns the booking's consumer, parking space, start time and end time as string"""
        return f"{self.consumer.username} booked {self.parkingSpace} between {self.startTime} and {self.endTime}"


class Image(models.Model):
    """
    Custom image model extending the standard Django DB model

    Fields:
        parkingSpace (ForeignKey: ParkingSpace): Parking space associated with the image
        image_data (CharField: string): Image data

    Methods:
        __str__: Returns the title of the image as string
    """
    parkingSpace = models.ForeignKey('ParkingSpace', on_delete=models.CASCADE, related_name='images')
    image_data = models.CharField(max_length=1000000)

    def __str__(self):
        """Returns the title of the image as string"""
        return f"Image of {self.parkingSpace}"

# # REVIEW MODELS
class Review(models.Model):
    """
    Custom review model extending the standard Django DB model

    Fields:
        parkingSpace (ForeignKey: ParkingSpace): Parking space associated with the review
        consumer (ForeignKey: CustomUser): User who wrote the review
        rating (DecimalField: decimal): Rating of the review
        comment (TextField: string): Body of the review
        publishDate (DateTimeField: datetime): Date and time of the review

    Methods:
        save: Overrides the save method to update the parking space's average rating and number of reviews
        delete: Overrides the delete method to update the parking space's average rating and number of reviews
        __str__: Returns the review's consumer and the reviewed parking space as string
    """
    parkingSpace = models.ForeignKey('ParkingSpace', on_delete=models.CASCADE)
    consumer = models.ForeignKey('CustomUser', on_delete=models.CASCADE, related_name='consumer_review')
    rating = models.DecimalField(max_digits=2, decimal_places=1)
    comment = models.TextField()
    publishDate = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        """Overrides the save method to update the parking space's average rating and number of reviews"""
        super().save(*args, **kwargs)
        count = Review.objects.filter(parkingSpace = self.parkingSpace).count()
        average = Review.objects.filter(parkingSpace = self.parkingSpace).aggregate(models.Avg('rating'))
        parkingSpace = ParkingSpace.objects.filter(pk=self.parkingSpace.pk).first()
        parkingSpace.avg_rating = average['rating__avg']
        parkingSpace.n_ratings = count
        parkingSpace.save()

    def delete(self, *args, **kwargs):
        """Overrides the delete method to update the parking space's average rating and number of reviews"""
        reviewSpace = self.parkingSpace
        super().delete(*args, **kwargs)
        count = Review.objects.filter(parkingSpace = reviewSpace).count()
        average = Review.objects.filter(parkingSpace = reviewSpace).aggregate(models.Avg('rating'))
        parkingSpace = ParkingSpace.objects.filter(pk=reviewSpace.pk).first()
        parkingSpace.avg_rating = average['rating__avg']
        parkingSpace.n_ratings = count
        parkingSpace.save()

    def __str__(self):
        """Returns the review's consumer and the reviewed parking space as string"""
        return f"{self.consumer.username} reviewed {self.parkingSpace}"
