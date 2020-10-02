## Overview

Python 3.7+

Django project created with Django 3.1

- Install requirements: `pip install -r requirements`
- Start server: `python manage.py runserver`
- Make and run initial migrations: `python manage.py makemigrations;python manage.py migrate`

## Authentication

DRF auth docs: https://www.django-rest-framework.org/api-guide/authentication/

This application uses the [djangorestframework-simplejwt](https://django-rest-framework-simplejwt.readthedocs.io/en/latest/index.html) package for JWT token authentication. See the [settings docs](https://django-rest-framework-simplejwt.readthedocs.io/en/latest/settings.html) for the list of configurable `SIMPLE_JWT` parameters in [settings.py](./mysite/mysite/settings.py).

The authentication workflow is as follows:
- Provide a username and password to the login endpoint to receive an access and refresh token

### Registration

To create a superuser in Django:

```sh
python manage.py createsuperuser
```

To register a user using the API endpoint:

```sh
curl -X POST -H "Content-Type: application/json" -d '{"username":"<username>","email":"<email>"}' http://127.0.0.1:8000/api/register/
```

This will create an inactive user, and send a verification link to the email address.


To request another verification link:

```sh
curl -X POST -H "Content-Type: application/json" -d '{"email":"<email>"}' http://127.0.0.1:8000/api/resend-activation/
```

To verify the account and set the password:

```sh
curl -X POST -H "Content-Type: application/json" -d '{"uidb64":"<uidb64>","token":"<token>","password":"<password>","password2":"<password2>"}' http://127.0.0.1:8000/api/verify-account/
```


### Access Endpoints

To get an access and refresh token:

```sh
curl -X POST -H 'Accept: application/json; indent=2' -d username=<username> -d password=<password> http://127.0.0.1:8000/api/token/
```

The access token is short lived. The renew token is longer lived, with `REFRESH_TOKEN_LIFETIME` set to 2 days so that one can stay logged in for at least a day.

To call a protected view:

```sh
curl -H "Authorization: Bearer <accesstoken>" http://127.0.0.1:8000/api/private/
```

To blacklist a refresh token:

```sh
curl -X POST -d refresh=<refreshtoken> http://127.0.0.1:8000/api/token/blacklist/
```

There is no provided endpoint to blacklist an access token, which are to expire quickly on their own.


To use the refresh token to get another access and refresh token:

```sh
curl -X POST -H 'Accept: application/json; indent=2' -d refresh=<refreshtoken> http://127.0.0.1:8000/api/token/refresh/
```

`ROTATE_REFRESH_TOKENS` is set to True so that one can stay logged in indefinitely as long as they are active. `BLACKLIST_AFTER_ROTATION` is set to False because a new access/refresh token has to be retrieved every time the short-lived access token expires. If every refresh token were blacklisted this frequently, there would be far too many in the blacklist to check.

https://github.com/SimpleJWT/django-rest-framework-simplejwt/issues/218

https://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api



'{"uidb64":"MTU","token":"aay93c-34ed658248e42261ee407a2e984c3f66"}'
