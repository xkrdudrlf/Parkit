"""Forms for Park It users"""

from django import forms
from django.contrib.auth.forms import UserChangeForm, UserCreationForm
from .models import CustomUser

class CustomUserCreationForm(UserCreationForm):
    """
    Form used for extending the existing UserCreationForm
    """
    class Meta:
        model = CustomUser
        fields = (
            'email',
            'phone_number',
            'card_number',
            'expiry_date',
            'cvc',
            'bsb',
            'account_number',
            'account_name',
        )

class CustomUserChangeForm(UserChangeForm):
    """
    Form used for extending the existing UserChangeForm
    """
    class Meta:
        model = CustomUser
        fields = UserChangeForm.Meta.fields

class RemoveUserForm(forms.Form):
    """
    Form used to remove a user from the system
    """
    class Meta:
        model = CustomUser
        fields = []

