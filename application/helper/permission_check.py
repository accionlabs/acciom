"""Helper file to check if user has valid permissions."""
from application.common.common_exception import (UnauthorizedException,
                                                 ResourceNotAvailableException)
from application.model.models import User, UserProjectRole, RolePermission, \
    Permission, UserOrgRole, Organization, Project, Role
from index import db


def check_permission(user_object, list_of_permissions=None,
                     org_id=None, project_id=None):
    """
    Mthod to check if user is authorized.

    Args:
        list_of_permissions (list): list of permission names to be checked
        user_object (object): User object with caller information
        org_id (int): Id of the org
        project_id (int): Id of the project

    Returns: True if authorized, False if unauthorized

    """
    # check if user is super admin
    super_user = User.query.filter_by(user_id=user_object.user_id).first()
    if super_user.is_super_admin:
        return True
    # check for project permission
    if project_id:
        project_permission = db.session.query(
            Permission.permission_name).join(
            RolePermission,
            Permission.permission_id == RolePermission.permission_id).join(
            UserProjectRole,
            RolePermission.role_id == UserProjectRole.role_id).filter(
            UserProjectRole.project_id == project_id,
            UserProjectRole.user_id == user_object.user_id
        ).all()
        if list_of_permissions is None and project_permission:
            return True
        if project_permission:
            project_permission_from_db = \
                [each_permission[0] for each_permission in project_permission]
            if set(list_of_permissions).issubset(project_permission_from_db):
                return True
    # Check for Organization permission
    if org_id:
        org_permission = db.session.query(Permission.permission_name).join(
            RolePermission,
            Permission.permission_id == RolePermission.permission_id).join(
            UserOrgRole, RolePermission.role_id == UserOrgRole.role_id).filter(
            UserOrgRole.org_id == org_id,
            UserOrgRole.user_id == user_object.user_id
        ).all()
        if list_of_permissions is None and org_permission:
            return True
        if org_permission:
            org_permission_from_db = \
                [each_permission[0] for each_permission in org_permission]
            if set(list_of_permissions).issubset(org_permission_from_db):
                return True
    raise UnauthorizedException


def check_valid_id_passed_by_user(org_id=None, project_id=None, user_id=None,
                                  role_id=None,
                                  **kwargs):
    """Check if Ids passed are valid in DB."""
    valid_org, valid_project, valid_user, valid_role = None, None, None, None
    if org_id:
        valid_org = Organization.query.filter_by(
            org_id=org_id, is_deleted=False).first()
        if not valid_org:
            raise ResourceNotAvailableException("Organization")
    if project_id:
        valid_project = Project.query.filter_by(
            project_id=project_id, is_deleted=False).first()
        if not valid_project:
            raise ResourceNotAvailableException("Project")
    if user_id:
        valid_user = User.query.filter_by(
            user_id=user_id, is_deleted=False).first()
        if not valid_user:
            raise ResourceNotAvailableException("User")
    if role_id:
        valid_role = Role.query.filter_by(
            role_id=role_id).first()
        if not valid_role:
            raise ResourceNotAvailableException("Role")

    return valid_org, valid_project, valid_user, valid_role
