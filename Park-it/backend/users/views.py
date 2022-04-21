"""Queries for Django database"""

from users.filters import RadiusFilter
from users.filters import ParkingSearchFilter
from users.forms import *
from users.models import ParkingSpace, Transaction
from rest_framework.generics import GenericAPIView, ListAPIView, RetrieveUpdateDestroyAPIView, CreateAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import *
import datetime as dt
from drf_spectacular.utils import extend_schema
from django_filters import rest_framework as filters
from users.utils import *

# USER VIEWS

class RemoveUserView(GenericAPIView):
    """
    View to delete a user

    Request types:
        DELETE
    """
    serializer_class = RemoveUserSerializer

    def delete(self,request):
        """Deletes user from database"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid()
        if not serializer.errors:
            serializer.delete(request)
            return Response({'message': 'User deleted'}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'message': 'User not deleted'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# PARKING SPACES VIEWS

class CreateParkingSpace(CreateAPIView):
    """
    View to create a parking space

    Request types:
        POST
    """
    serializer_class = ParkingSpaceSerializer
    queryset = ParkingSpace.objects.all()

class ParkingSpaceView(RetrieveUpdateDestroyAPIView):
    """
    View to retrieve, update and delete a parking space

    Request types:
        GET
        PUT
        PATCH
        DELETE
    """
    serializer_class = ParkingSpaceSerializer
    queryset = ParkingSpace.objects.all()
    serializer_class = ParkingSpaceSerializer
    def get_queryset(self):
        """Returns filtered queryset"""
        space = self.kwargs['pk']
        return ParkingSpace.objects.filter(pk=space)

class ParkingSpaceList(ListAPIView):
    """
    View to retrieve all parking spaces owned by the user

    Request types:
        GET
    """
    serializer_class = ParkingSpaceSerializer
    def get_queryset(self):
        """Returns filtered queryset"""
        provider = self.request.user
        return ParkingSpace.objects.filter(provider=provider)

class PendingParkingSpaceList(ListAPIView):
    """
    View to retrieve all parking spaces owned by the user that are pending

    Request types:
        GET
    """
    serializer_class = ParkingSpaceSerializer
    def get_queryset(self):
        """Returns filtered queryset"""
        provider = self.request.user
        return ParkingSpace.objects.filter(provider=provider).filter(status='pending')

class RejectedParkingSpaceList(ListAPIView):
    """
    View to retrieve all parking spaces owned by the user that are rejected

    Request types:
        GET
    """
    serializer_class = ParkingSpaceSerializer
    def get_queryset(self):
        """Returns filtered queryset"""
        provider = self.request.user
        return ParkingSpace.objects.filter(provider=provider).filter(status='rejected')

class ApprovedParkingSpaceList(ListAPIView):
    """
    View to retrieve all parking spaces owned by the user that are approved

    Request types:
        GET
    """
    serializer_class = ParkingSpaceSerializer
    def get_queryset(self):
        """Returns filtered queryset"""
        provider = self.request.user
        return ParkingSpace.objects.filter(provider=provider).filter(status='approved')

class CancelledParkingSpaceList(ListAPIView):
    """
    View to retrieve all parking spaces owned by the user that are cancelled

    Request types:
        GET
    """
    serializer_class = ParkingSpaceSerializer
    def get_queryset(self):
        """Returns filtered queryset"""
        provider = self.request.user
        return ParkingSpace.objects.filter(provider=provider).filter(status='cancelled')


# IMAGE VIEWS

class CreateImage(CreateAPIView):
    """
    View to upload an image

    Request types:
        POST
    """
    serializer_class = ImageSerializer

    def get_queryset(self):
        """Returns filtered queryset"""
        space = self.kwargs['parkingID']
        return Image.objects.filter(parkingSpace=space)

class ImageView(RetrieveUpdateDestroyAPIView):
    """
    View to retrieve, update and delete an image

    Request types:
        GET'
        PUT
        PATCH
        DELETE
    """
    serializer_class = ImageSerializer
    def get_queryset(self):
        """Returns filtered queryset"""
        image = self.kwargs['pk']
        return Image.objects.filter(pk=image)

class ImageList(ListAPIView):
    """
    View to retrieve all images associated with a Parking Space

    Request types:
        GET
    """
    serializer_class = ImageSerializer
    def get_queryset(self):
        """Returns filtered queryset"""
        space = self.kwargs['parkingID']
        return Image.objects.filter(parkingSpace=space)


# BOOKING VIEWS

class CreateBooking(CreateAPIView):
    """
    View to create a booking

    Request types:
        POST
    """
    serializer_class = TransactionSerializer
    queryset = Transaction.objects.all()

class BookingView(RetrieveUpdateDestroyAPIView):
    """
    View to retrieve, update and delete a booking

    Request types:
        GET
        PUT
        PATCH
        DELETE
    """
    serializer_class = TransactionSerializer
    def get_queryset(self):
        """Returns filtered queryset"""
        booking = self.kwargs['pk']
        return Transaction.objects.filter(pk=booking)

class BookingList(ListAPIView):
    """
    View to retrieve all bookings associated with a Parking Space

    Request types:
        GET
    """
    serializer_class = TransactionSerializer
    def get_queryset(self):
        """Returns filtered queryset"""
        space = self.kwargs['parkingID']
        return Transaction.objects.filter(parkingSpace=space)

class ProviderBookingHistory(ListAPIView):
    """
    View to retrieve all bookings from a provider

    Request types:
        GET
    """
    serializer_class = TransactionSerializer
    def get_queryset(self):
        """Returns filtered queryset"""
        user = self.request.user
        return Transaction.objects.filter(provider=user)

class ConsumerBookingHistory(ListAPIView):
    """
    View to retrieve all bookings from a consumer

    Request types:
        GET
    """
    serializer_class = TransactionSerializer
    def get_queryset(self):
        """Returns filtered queryset"""
        user = self.request.user
        return Transaction.objects.filter(consumer=user)


# FAVOURITE VIEWS

class CreateFavourite(CreateAPIView):
    """
    View to favourite a parking space

    Request types:
        POST
    """
    serializer_class = FavouriteSerializer
    queryset = Favourite.objects.all()

class FavouriteView(RetrieveUpdateDestroyAPIView):
    """
    View to retrieve, update and delete a favourite

    Request types:
        GET
        PUT
        PATCH
        DELETE
    """
    serializer_class = FavouriteSerializer
    def get_queryset(self):
        """Returns filtered queryset"""
        favourite = self.kwargs['pk']
        return Favourite.objects.filter(pk=favourite)


class FavouriteList(ListAPIView):
    """
    View to retrieve all favourites from a consumer

    Request types:
        GET
    """
    serializer_class = FavouriteSerializer
    def get_queryset(self):
        """Returns filtered queryset"""
        user = self.request.user
        return Favourite.objects.filter(consumer=user)

# VEHICLE VIEWS

class CreateVehicle(CreateAPIView):
    """
    View to create a vehicle

    Request types:
        POST
    """
    serializer_class = VehicleSerializer
    queryset = Vehicle.objects.all()

class VehicleView(RetrieveUpdateDestroyAPIView):
    """
    View to retrieve, update and delete a vehicle

    Request types:
        GET
        PUT
        PATCH
        DELETE
    """
    serializer_class = VehicleSerializer
    def get_queryset(self):
        """Returns filtered queryset"""
        vehicle = self.kwargs['pk']
        return Vehicle.objects.filter(pk=vehicle)

class VehicleList(ListAPIView):
    """
    View to retrieve all vehicles from a user

    Request types:
        GET
        PUT
        PATCH
        DELETE
    """
    serializer_class = VehicleSerializer
    def get_queryset(self):
        """Returns filtered queryset"""
        user = self.request.user
        return Vehicle.objects.filter(user=user)


# REVIEW VIEWS

class CreateReview(CreateAPIView):
    """
    View to create a review

    Request types:
        POST
    """
    serializer_class = ReviewSerializer
    queryset = Review.objects.all()

class ReviewView(RetrieveUpdateDestroyAPIView):
    """
    View to retrieve, update and delete a review

    Request types:
        GET
        PUT
        PATCH
        DELETE
    """
    serializer_class = ReviewSerializer
    def get_queryset(self):
        """Returns filtered queryset"""
        review = self.kwargs['pk']
        return Review.objects.filter(pk=review)

class ReviewList(ListAPIView):
    """
    View to retrieve all reviews associated with a Parking Space

    Request types:
        GET
    """
    serializer_class = ReviewSerializer
    def get_queryset(self):
        """Returns filtered queryset"""
        space = self.kwargs['parkingID']
        return Review.objects.filter(parkingSpace=space)

# SEARCH VIEWS

class ParkingSearchList(ListAPIView):
    """
    View to retrieve all parking spaces matching search criteria

    Request types:
        GET
    """

    serializer_class = ParkingSpaceSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = ParkingSearchFilter

    def get_queryset(self):
        """Returns filtered queryset"""
        queryset = ParkingSpace.objects.filter(is_active=True, status='approved')
        if self.request.user.is_authenticated:
            queryset = queryset.exclude(provider=self.request.user)
        try:
            address = self.request.query_params.get('address')
            radius = self.request.query_params.get('radius')
            queryset = RadiusFilter(queryset, address, radius)
        except:
            queryset = RadiusFilter(queryset) # query params does not include address and radius
        # acceptable address formats: 'address, city, state', 'city, state'
        try:
            startTime = dt.datetime.strptime(self.request.query_params.get('startTime'), '%Y-%m-%d %H:%M:%S')
            endTime = dt.datetime.strptime(self.request.query_params.get('endTime'), '%Y-%m-%d %H:%M:%S')
            queryset = queryset.exclude(startTime__date__gt=startTime).exclude(endTime__date__lt=endTime)
            bookingQuerySet = Transaction.objects.exclude(startTime__date__gt=endTime).exclude(endTime__date__lt=startTime)
            for booking in bookingQuerySet:
                queryset = queryset.exclude(pk=booking.parkingSpace.pk)
            return queryset
        except:
            return queryset
