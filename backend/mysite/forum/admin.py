from django.contrib import admin

from forum import models


admin.site.register(models.Post)
admin.site.register(models.Comment)
