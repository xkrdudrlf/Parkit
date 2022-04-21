"""Admin classes for Park It"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .forms import CustomUserChangeForm, CustomUserCreationForm
from .models import CustomUser, Transaction, Vehicle, Review, ParkingSpace, Image, Favourite

class CustomUserAdmin(UserAdmin):
    """
    Class for custom user model administration
    """
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    list_display = ['username', 'email', 'first_name', 'last_name', 'is_staff']

class ParkingSpaceAdmin(admin.ModelAdmin):
    """
    Class for parking space model administration
    """
    list_filter = ['status']
    list_display = [
        'streetAddress',
        'provider',
        'price',
        'size',
        'startTime',
        'endTime',
        'status',
    ]

    readonly_fields = [
        'longitude',
        'latitude',
        'avg_rating',
        'n_ratings',
        'latestTime',
        'is_active'
    ]

class VehicleAdmin(admin.ModelAdmin):
    """
    Class for vehicle model administration
    """
    list_display = [
        'carDetails',
        'user',
    ]

    @admin.display(description='carDetails')
    def carDetails(self, obj):
        return f"{obj.carColour} {obj.carMake} {obj.carModel} ({obj.carYear})"

class TransactionAdmin(admin.ModelAdmin):
    """
    Class for transaction model administration
    """
    list_display = [
        'parkingSpace',
        'provider',
        'consumer',
        'startTime',
        'endTime',
        'totalCost'
    ]

class FavouriteAdmin(admin.ModelAdmin):
    """
    Class for favourite model administration
    """
    list_display = [
        'parkingSpace',
        'consumer',
    ]

class ReviewAdmin(admin.ModelAdmin):
    """
    Class for review model administration
    """
    list_display = [
        'parkingSpace',
        'consumer',
        'rating',
        'publishDate'
    ]

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Transaction, TransactionAdmin)
admin.site.register(Vehicle, VehicleAdmin)
admin.site.register(Review, ReviewAdmin)
admin.site.register(ParkingSpace, ParkingSpaceAdmin)
admin.site.register(Favourite, FavouriteAdmin)
admin.site.register(Image)