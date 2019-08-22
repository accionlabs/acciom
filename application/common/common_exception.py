"""File to handle custom exceptions."""


class UnauthorizedException(Exception):
    """Unauthorized Exception."""

    pass


class ResourceNotAvailableException(Exception):
    """Resource not available in DB Exception."""

    def __init__(self, resource_name):
        """Resource Name to be passed."""
        self.resource_name = resource_name

    pass


class GenericBadRequestException(Exception):
    """Bad Request Exception."""

    def __init__(self, display_message):
        """Display Message to be passed."""
        self.display_message = display_message

    pass
