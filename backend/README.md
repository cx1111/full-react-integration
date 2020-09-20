## Overview

Python 3.7+

Django project created with Django 3.1

- Install requirements: `pip install -r requirements`
- Start server: `python manage.py runserver`

## Authentication

To create a superuser in Django:

```sh
python manage.py createsuperuser
```

This application uses the [djangorestframework-simplejwt](https://django-rest-framework-simplejwt.readthedocs.io/en/latest/index.html) package for JWT token authentication.

To get an access and refresh token:

```sh
curl -X POST -H 'Accept: application/json; indent=2' -d username=<username> -d password=<password> http://127.0.0.1:8000/api/token/
```

The access token is short lived. The renew token is longer lived.

To call a protected view:

```sh
curl -H "Authorization: Bearer <accesstoken>" http://127.0.0.1:8000/api/private/
```

To use the refresh token to get another access and refresh token:

```sh
curl -X POST -H 'Accept: application/json; indent=2' -d refresh=<refreshtoken> http://127.0.0.1:8000/api/token/refresh/
```
