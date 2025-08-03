from django.core.exceptions import ValidationError
from .models import User  # use your correct model path

def validateExist(username=None, email=None, exclude_id=None):
    errors = {}

    if username:
        query = User.objects.filter(username=username)
        if exclude_id:
            query = query.exclude(id=exclude_id)
        if query.exists():
            errors['username'] = "Username already exists."

    if email:
        query = User.objects.filter(email=email)
        if exclude_id:
            query = query.exclude(id=exclude_id)
        if query.exists():
            errors['email'] = "Email already exists."

    if errors:
        raise ValidationError(errors)
