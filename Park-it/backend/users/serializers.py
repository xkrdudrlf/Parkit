"""Serializer for Park It views"""

from django.db import transaction
from .utils import AddressValidation
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField, SlugRelatedField
from dj_rest_auth.registration.serializers import RegisterSerializer
from .models import CustomUser, Favourite, ParkingSpace, Image, Transaction, Review, Vehicle
from drf_writable_nested.serializers import NestedUpdateMixin



class UserSerializer(ModelSerializer):
    """
    Serializer for CustomUser model

    Subclasses:
        Meta: Meta class for UserSerializer
    """
    class Meta:
        """Required additional fields for CustomUser serializer"""
        model = CustomUser
        fields = (
            'email',
            'username',
            'first_name',
            'last_name',
            'phone_number',
            'card_number',
            'expiry_date',
            'cvc',
            'bsb',
            'account_number',
            'account_name',
            'is_staff',
            'pk'
        )

        read_only_fields = ('first_name', 'last_name', 'username', 'pk')

class CustomRegisterSerializer(RegisterSerializer):
    """
    Custom registration serializer for CustomUser model extending the default dj_rest_auth registration serializer

    Additional fields:
        phone_number (CharField: str): Phone number of user
        first_name (CharField: str): First name of user
        last_name (CharField: str): Last name of user

    Methods:
        save: Overrides default save method to add additional fields to user

    """
    phone_number = serializers.CharField(max_length=20)
    first_name = serializers.CharField(max_length=20)
    last_name = serializers.CharField(max_length=20)

    @transaction.atomic
    def save(self, request):
        """Overrides default save method to add additional fields to user"""
        user = super().save(request)
        user.phone_number = self.data.get('phone_number')
        user.first_name = self.data.get('first_name')
        user.last_name = self.data.get('last_name')
        user.save()
        return user

class RemoveUserSerializer(ModelSerializer):
    """
    Custom serializer for removing a user extending the default model serializer

    Subclasses:
        Meta: Meta class for RemoveUserSerializer

    Methods:
        delete: Overrides default delete method to remove a user
    """
    class Meta:
        """Required fields for CustomUser serializer"""
        model = CustomUser
        fields = []

    def delete(self, request):
        """Overrides default delete method to remove a user"""
        username = request.data.get('username')
        user = self.Meta.model.objects.get(username=username)
        user.delete()

class ImageSerializer(ModelSerializer):
    """
    Custom serializer for parking space images extending the default ModelSerializer

    Fields:
        image (CharField: str): Image of parking space

    Subclasses:
        Meta: Meta class for ImageSerializer
    """
    image_data = serializers.CharField()
    class Meta:
        """Required fields for Image serializer"""
        model = Image
        fields = (
            'image_data',
            'pk'
        )

        read_only_fields = ['pk']


class ParkingSpaceSerializer(NestedUpdateMixin, ModelSerializer):
    """
    Custom serializer for parking space extending the default ModelSerializer to add images

    Fields:
        images (ListField: ImageSerializer): List of images of parking space
        provider (PrimaryKeyRelatedField: CustomUser): Provider of parking space

    Subclasses:
        Meta: Meta class for ParkingSpaceSerializer

    Methods:
        validate: Overrides default validate method to check parking space availability
        create: Overrides default create method to add images to parking space
    """

    images = ImageSerializer(many=True)
    provider = PrimaryKeyRelatedField(queryset=CustomUser.objects.all())

    class Meta:
        """Required fields for ParkingSpace serializer"""
        model = ParkingSpace
        fields = (
            'provider',
            'streetAddress',
            'city',
            'state',
            'postcode',
            'price',
            'size',
            'notes',
            'longitude',
            'latitude',
            'startTime',
            'endTime',
            'latestTime',
            'status',
            'images',
            'avg_rating',
            'n_ratings',
            'is_active',
            'pk',
        )

        read_only_fields = ['pk', 'is_active', 'avg_rating', 'n_ratings', 'longitude', 'latitude', 'latestTime']

    def validate(self, data):
        """Overrides default validate method to check parking space availability"""
        method = (self.context['view'].request.method)

        if (method == 'POST'):
            return data
        if ('startTime' not in data or 'endTime' not in data):
            return data

        pk = self.context['view'].kwargs['pk']
        startTime = data['startTime']
        endTime = data['endTime']

        if startTime > endTime:
            raise serializers.ValidationError('Parking space start time must be before the parking space end time')
        qs = Transaction.objects.filter(parkingSpace=pk).exclude(startTime__date__gte=startTime).exclude(endTime__date__lte=endTime)
        if qs.exists():
            raise serializers.ValidationError('This availability would violate existing bookings.')
        return data


    def create(self, validated_data):
        """Overrides default create method to add images to parking space"""
        imgs_data = validated_data.pop('images')
        parkingSpace = ParkingSpace.objects.create(**validated_data)
        cleanAddress = AddressValidation(validated_data)
        cleanAddress = cleanAddress.validate()

        if not type(cleanAddress) == dict:
            raise serializers.ValidationError(cleanAddress.errors)
        parkingSpace.save()

        for img_data in imgs_data:
            Image.objects.create(parkingSpace=parkingSpace, **img_data)
        return parkingSpace

class VehicleSerializer(ModelSerializer):
    """
    Custom serializer for vehicle extending the default ModelSerializer

    Fields:
        user (PrimaryKeyRelatedField: CustomUser): Owner of vehicle

    Subclasses:
        Meta: Meta class for VehicleSerializer
    """

    user = PrimaryKeyRelatedField(queryset=CustomUser.objects.all())

    class Meta:
        """Required fields for Vehicle serializer"""
        model = Vehicle
        fields = (
            'user',
            'carMake',
            'carModel',
            'carYear',
            'carColour',
            'carRego',
            'pk'
        )

        read_only_fields = ['pk']

class FavouriteSerializer(ModelSerializer):
    """
    Custom serializer for favourites extending the default ModelSerializer

    Fields:
        consumer (PrimaryKeyRelatedField: CustomUser): Consumer of favourites
        parkingSpace (PrimaryKeyRelatedField: ParkingSpace): Favourited parking space
    """

    consumer = PrimaryKeyRelatedField(queryset=CustomUser.objects.all())
    parkingSpace = PrimaryKeyRelatedField(queryset=ParkingSpace.objects.all())
    streetAddress = serializers.CharField(source="parkingSpace.streetAddress", required=False)
    city = serializers.CharField(source="parkingSpace.city", required=False) 
    state = serializers.CharField(source="parkingSpace.state", required=False)
    postcode = serializers.CharField(source="parkingSpace.postcode", required=False)
    startTime = serializers.DateTimeField(source="parkingSpace.startTime", required=False)
    endTime = serializers.DateTimeField(source="parkingSpace.endTime", required=False)
    cost = serializers.IntegerField(source="parkingSpace.price", required=False)
    notes = serializers.CharField(source="parkingSpace.notes", required=False)
    parkingSpaceSize = serializers.CharField(source="parkingSpace.size", required=False)

    class Meta:
        """Required fields for Favourite serializer"""
        model = Favourite
        fields = (
            'consumer',
            'parkingSpace',
            'pk',
            'streetAddress',
            'city',
            'state',
            'postcode',
            'cost',
            'notes',
            'parkingSpaceSize',
            'startTime',
            'endTime',
        )

        read_only_fields = ['pk', 'streetAddress', 'city', 'state', 'postcode']

class TransactionSerializer(ModelSerializer):
    """
    Custom serializer for transactions extending the default ModelSerializer

    Fields:
        provider (PrimaryKeyRelatedField: CustomUser): Provider of transaction
        consumer (PrimaryKeyRelatedField: CustomUser): Consumer of transaction
        vehicle (PrimaryKeyRelatedField: Vehicle): Vehicle of transaction
        parkingSpace (PrimaryKeyRelatedField: ParkingSpace): Parking space of transaction
        streetAddress (CharField: str): Street address of booked parking space
        city (CharField: str): City of booked parking space
        state (CharField: str): State of booked parking space
        postcode (CharField: str): Postcode of booked parking space
        consumerName (CharField: str): Name of consumer
        consumerPhone (CharField: str): Phone number of consumer
        consumerEmail (CharField: str): Email of consumer
        parkingSpaceSize (CharField: str): Size of booked parking space

    Subclasses:
        Meta: Meta class for TransactionSerializer

    Methods:
        validate: Overrides default validate method to check parking space availability
    """

    provider = PrimaryKeyRelatedField(queryset=CustomUser.objects.all())
    consumer = PrimaryKeyRelatedField(queryset=CustomUser.objects.all())
    vehicle = PrimaryKeyRelatedField(queryset=Vehicle.objects.all())
    parkingSpace = PrimaryKeyRelatedField(queryset=ParkingSpace.objects.all())
    streetAddress = serializers.CharField(source="parkingSpace.streetAddress", required=False)
    city = serializers.CharField(source="parkingSpace.city", required=False) 
    state = serializers.CharField(source="parkingSpace.state", required=False)
    postcode = serializers.CharField(source="parkingSpace.postcode", required=False)
    consumerName = serializers.CharField(source="consumer.username", required=False)
    consumerPhone = serializers.CharField(source="consumer.phone_number", required=False)
    consumerEmail = serializers.CharField(source="consumer.email", required=False)
    parkingSpaceSize = serializers.CharField(source="parkingSpace.size", required=False)

    class Meta:
        """Required fields for Transaction serializer"""
        model = Transaction
        fields = (
            'provider',
            'consumer',
            'vehicle',
            'parkingSpace',
            'streetAddress',
            'city',
            'state',
            'postcode',
            'consumerName',
            'consumerPhone',
            'consumerEmail',
            'publishDate',
            'parkingSpaceSize',
            'startTime',
            'endTime',
            'totalCost',
            'pk'
        )

        read_only_fields = ['pk', 'streetAddress', 'city', 'state', 'postcode', 'consumerName', 'parkingSpaceSize']

    def validate(self, data):
        """Overrides default validate method to check parking space availability"""
        startTime = data['startTime']
        endTime = data['endTime']
        if data['provider'] == data['consumer']:
            raise serializers.ValidationError('Cannot book own parking space')
        if startTime > endTime:
            raise serializers.ValidationError('Booking start time must be before booking end time')
        parkingSpace = ParkingSpace.objects.filter(pk=data['parkingSpace'].pk).first()
        if parkingSpace.status == 'cancelled':
            raise serializers.ValidationError('The parking space is no longer accepting new bookings')
        if parkingSpace.startTime > startTime or parkingSpace.endTime < endTime or parkingSpace.startTime > endTime or parkingSpace.endTime < startTime:
            raise serializers.ValidationError('This booking does not fit within the parking space availability.')
        qs = Transaction.objects.filter(parkingSpace=data['parkingSpace']).exclude(startTime__date__gt=endTime).exclude(endTime__date__lt=startTime)
        if qs.exists():
            raise serializers.ValidationError('This booking overlaps with an existing booking.')
        return data


class ReviewSerializer(ModelSerializer):
    """
    Custom serializer for reviews extending the default ModelSerializer

    Fields:
        consumer (PrimaryKeyRelatedField: CustomUser): Review author
        parkingSpace (PrimaryKeyRelatedField: ParkingSpace): Reviewed parking space

    Subclasses:
        Meta: Meta class for ReviewSerializer
    """

    consumer = SlugRelatedField(queryset=CustomUser.objects.all(), slug_field='username')
    parkingSpace = PrimaryKeyRelatedField(queryset=ParkingSpace.objects.all())

    class Meta:
        """Required fields for Review serializer"""
        model = Review
        fields = (
            'parkingSpace',
            'consumer',
            'rating',
            'comment',
            'publishDate',
            'pk'
        )

        read_only_fields = ['pk']
