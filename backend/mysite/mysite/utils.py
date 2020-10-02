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
