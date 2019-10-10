from application.model.models import (Role, RolePermission, Permission)
from index import db


def retrieve_roles_under_org(org_id, permission_id_list):
    """
    Retrieve Roles for given org Id.

    Args:
        org_id (int): Id of the organization

    Returns: list of roles with Id, Name and permission names
    """
    all_roles_obj = db.session.query(
        Role.role_id, Role.role_name,
        Permission.permission_id,
        Permission.permission_name).join(
        RolePermission,
        Permission.permission_id == RolePermission.permission_id).join(
        Role,
        RolePermission.role_id == Role.role_id).filter(
        Role.org_id == org_id).all()
    main_dict = {}
    for each_role in all_roles_obj:
        if each_role[0] not in main_dict:
            main_dict_value = []
            main_dict_value.append(each_role[1])
            permission_id = []
            permission_id.append(each_role[2])
            permission_name = []
            permission_name.append(each_role[3])
            main_dict_value.append(permission_id)
            main_dict_value.append(permission_name)
            main_dict[each_role[0]] = main_dict_value
        else:
            main_dict[each_role[0]][1].append(each_role[2])
            main_dict[each_role[0]][2].append(each_role[3])
    keys = []
    for key, value in main_dict.items():
        for id in value[1]:
            if id not in permission_id_list:
                keys.append(key)
    for key in keys:
        del main_dict[key]
    roles = []
    for key, value in main_dict.items():
        role_dic = {}
        role_dic["role_id"] = key
        role_dic["role_name"] = value[0]
        permission_list = []
        for (permission_id, permission_names) in zip(value[1], value[2]):
            permission_dict = {}
            permission_dict["permission_id"] = permission_id
            permission_dict["permission_name"] = permission_names
            permission_list.append(permission_dict)
        role_dic["permissions"] = permission_list
        roles.append((role_dic))
    return roles
