from collections.abc import Iterable

from django.contrib.sites.shortcuts import get_current_site


def get_url_prefix(request):
    """
    Return a URL protocol and host, such as 'https://example.com'.

    """
    site = get_current_site(request)
    if request and not request.is_secure():
        return f'http://{site.domain}'
    else:
        return f'https://{site.domain}'


def unique(items: Iterable):
    """
    Return unique elements in the iterable, preserving order
    """
    seen = set()
    return [item for item in items if not (item in seen or seen.add(item))]
