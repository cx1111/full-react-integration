from django.contrib.auth.validators import UnicodeUsernameValidator
from django.utils.translation import ugettext as _


class UsernameValidator(UnicodeUsernameValidator):
    regex = r'^[a-zA-Z][a-zA-Z0-9-]{3,49}$'
    message = _(
        'The username must contain 4 to 50 characters. It must start with a letter, and contain letters, digits and - only.')
