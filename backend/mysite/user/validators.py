from django.contrib.auth.validators import UnicodeUsernameValidator
from django.core.exceptions import ValidationError
from django.utils.translation import ugettext as _
from zxcvbn import zxcvbn


class UsernameValidator(UnicodeUsernameValidator):
    regex = r'^[a-zA-Z][a-zA-Z0-9-]{3,49}$'
    message = _(
        'The username must contain 4 to 50 characters. It must start with a letter, and contain letters, digits and - only.')


class PasswordComplexityValidator:
    def __init__(self):
        self.minimum_complexity = 2

    def validate(self, password, user):
        # NOTE: Keep list of forbidden words in sync with
        # zxcvbn_ProgressBar_Register.js and
        # zxcvbn_ProgressBar_Change.js

        bad_words = []

        bad_words.append(user.email)
        bad_words.append(user.username)

        info = zxcvbn(password, bad_words)
        if info['score'] < self.minimum_complexity:
            raise ValidationError(
                _("This password is too weak."),
                code='password_weak_password',
            )

    def get_help_text(self):
        return _(
            "The password is too weak."
        )
