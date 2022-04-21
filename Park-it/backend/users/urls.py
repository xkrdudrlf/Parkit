"""URL Patterns for Park It"""

from django.urls import path
from users.views import *

urlpatterns = [
    # User management

    path('delete/user', RemoveUserView.as_view(), name='remove_user'),

    # Parking Spaces

    path('provider/parking', CreateParkingSpace.as_view(), name='create_parking_space'),
    path('provider/parking/<int:pk>', ParkingSpaceView.as_view(), name='modify_parking_space'),
    path('provider/parking/images/<int:parkingID>', ImageList.as_view(), name='list_images'),
    path('provider/parking/reviews/<int:parkingID>', ReviewList.as_view(), name='list_reviews'),
    path('provider/parking/bookings/<int:parkingID>', BookingList.as_view(), name='list_bookings'),
    path('provider/parking/all', ParkingSpaceList.as_view(), name='list_parking_space'),
    path('provider/parking/pending', PendingParkingSpaceList.as_view(), name='pending_list_parking_space'),
    path('provider/parking/rejected', RejectedParkingSpaceList.as_view(), name='rejected_list_parking_space'),
    path('provider/parking/approved', ApprovedParkingSpaceList.as_view(), name='approved_list_parking_space'),
    path('provider/parking/cancelled', CancelledParkingSpaceList.as_view(), name='cancelled_list_parking_space'),

    # Booking

    path('consumer/book', CreateBooking.as_view(), name='create_booking'),
    path('consumer/book/<int:pk>', BookingView.as_view(), name='modify_booking'),

    # History

    path('provider/history', ProviderBookingHistory.as_view(), name='provider_history'),
    path('consumer/history', ConsumerBookingHistory.as_view(), name='consumer_history'),

    # Images

    path('provider/image/<int:parkingID>', CreateImage.as_view(), name='create_image'),
    path('provider/image/<int:pk>', ImageView.as_view(), name='modify_image'),


    # Reviews

    path('consumer/review', CreateReview.as_view(), name='create_review'),
    path('consumer/review/<int:pk>', ReviewView.as_view(), name='modify_review'),

    # Favourites

    path('consumer/favourite', CreateFavourite.as_view(), name='create_favourite'),
    path('consumer/favourite/<int:pk>', FavouriteView.as_view(), name='modify_favourite'),
    path('consumer/favourite/all', FavouriteList.as_view(), name='list_favourites'),

    # Vehicle

    path('consumer/vehicle', CreateVehicle.as_view(), name='create_vehicle'),
    path('consumer/vehicle/<int:pk>', VehicleView.as_view(), name='modify_vehicle'),
    path('consumer/vehicle/all', VehicleList.as_view(), name='list_vehicle'),

    # Search
    path('provider/parking/search/', ParkingSearchList.as_view(), name='search_parking_space'),
]