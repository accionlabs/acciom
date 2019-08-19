"""File to handle Menu API calls."""
from flask_restful import Resource, reqparse
from application.common.constants import APIMessages
from application.common.response import (STATUS_OK, STATUS_BAD_REQUEST)
from application.common.response import api_response
from application.common.token import token_required
from application.model.models import Organization, Menu
from application.helper.permission_check import check_permission


class MenuAPI(Resource):
    """Class to handle Menu related GET API."""

    @token_required
    def get(self, session):
        """
        GET call to retrieve Menu details.

        Args:
            session(object): User session

        Returns: Standard API Response with HTTP status code

        """
        get_menu_parser = reqparse.RequestParser(bundle_errors=True)
        get_menu_parser.add_argument(
            'org_id', help=APIMessages.PARSER_MESSAGE,
            required=True, type=int)
        get_menu_data = get_menu_parser.parse_args()
        # Check if org id is valid
        valid_org = Organization.query.filter_by(
            org_id=get_menu_data['org_id']).first()
        if not valid_org:
            return api_response(
                False, APIMessages.NO_RESOURCE.format('Organization'),
                STATUS_BAD_REQUEST)
        # checking if user is authorized to make this call
        check_permission(session.user, org_id=get_menu_data['org_id'])
        # TODO: Check if user has permission to access the Menu Items
        result_dict = {'menu_items': []}
        get_menu_items = Menu.query.filter_by(
            is_active=True).order_by(Menu.menu_order).all()
        for each_menu in get_menu_items:
            result_dict['menu_items'].append(
                {'menu_id': each_menu.menu_id,
                 'menu_name': each_menu.menu_name,
                 'menu_order': each_menu.menu_order})
        return api_response(
            True, APIMessages.SUCCESS, STATUS_OK, result_dict)
