from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.core.validators import (EmailValidator, validate_integer,
    FileExtensionValidator, integer_validator)
from django.db import models

from user import validators


class UserManager(BaseUserManager):
    """
    Manager object with methods to create
    User instances.
    """
    def create_user(self, email: str, username: str, password:str = None, is_active : bool =False,
                    is_admin : bool =False):
        """
        Flexible function to create a new user.
        """

        if is_admin:
            is_active = True

        user = self.model(email=self.normalize_email(email.lower()),
                          username=self.model.normalize_username(username.lower()),
                          is_active=is_active, is_admin=is_admin)

        if password:
            user.set_password(password)
        user.save(using=self._db)

        _ = Profile.objects.create(user=user)
        return user

    def create_superuser(self, email, password, username):
        user = self.create_user(email=email, password=password,
                                username=username, is_admin=True)
        return user


class User(AbstractBaseUser):
    email = models.EmailField(max_length=255, unique=True,
        validators=[EmailValidator()])
    username = models.CharField(max_length=50, unique=True,
        validators=[validators.UsernameValidator()],
        error_messages={
            'unique': "A user with that username already exists."})
    join_date = models.DateField(auto_now_add=True)
    last_login = models.DateTimeField(null=True, blank=True)

    # Mandatory fields for the default authentication backend
    is_active = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)

    USERNAME_FIELD = 'username'
    EMAIL_FIELD = 'email'

    REQUIRED_FIELDS = ['email']

    def is_superuser(self):
        return (self.is_admin,)

    # Mandatory methods for default authentication backend
    def get_full_name(self):
        return self.username

    def get_short_name(self):
        return self.username

    def __str__(self):
        return self.username

    objects = UserManager()

    # Mandatory attributes for using the admin panel
    def has_perm(self, _perm, obj=None):
        "Does the user have a specific permission?"
        return True

    def has_module_perms(self, _app_label):
        "Does the user have permissions to view the app `app_label`?"
        return True

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        return self.is_admin


class Profile(models.Model):
    """
    Class storing profile information which is not directly related to account activity
    or authentication.

    """
    user = models.OneToOneField('user.User', related_name='profile',
        on_delete=models.CASCADE)
