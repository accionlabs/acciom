"""Helper file t0 check if user has valid permissions."""
from application.model.models import User, UserProjectRole, RolePermission,\
    Permission, UserOrgRole
from index import db


def check_permission(list_of_permissions, user_object,
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
    if super_user.is_super_user:
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
        if list_of_permissions in project_permission:
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
        if list_of_permissions in org_permission:
            return True
