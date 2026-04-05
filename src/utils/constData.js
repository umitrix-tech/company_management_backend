let moduleObj = {
    DASHBOARD: {
        MODULE: "dashboard_module",
        VIEW: "dashboard_view",
        CHARTS: "dashboard_charts",
        WIDGETS: "dashboard_widgets"
    },
    CALL:{
        MODULE:"call_module",
        VIEW:"call_view",
        TEAM_CALL:"team_call",
        CUSTOMER_CALL:"customer_call",
        SPECTATING_CALL:"spectating_call"
    },
    EMPLOYEE: {
        MODULE: "employee_module",
        VIEW: "employee_view",
        CREATE: "employee_create",
        UPDATE: "employee_update",
        DELETE: "employee_delete"
    },
    ROLE: {
        MODULE: "role_module",
        VIEW: "role_view",
        CREATE: "role_create",
        UPDATE: "role_update",
        DELETE: "role_delete"
    },
    SETTINGS: {
        MODULE: "settings_module",
        WORK_CONFIG_SETTINGS_MODULE: "work_config_settings_module",
        WORK_CONFIG_SETTINGS_VIEW: "work_config_settings_view",
        WORK_CONFIG_SETTINGS_CREATE: "work_config_settings_create",
        WORK_CONFIG_SETTINGS_UPDATE: "work_config_settings_update",
        WORK_CONFIG_SETTINGS_DELETE: "work_config_settings_delete",
    },
    PUNCH_IN_PUNCH_OUT: {
        MODULE: "punch_in_punch_out_module",
        PUNCH_IN_PUNCH_OUT: "punch_in_punch_out",
        EDIT_OTHER_PUNCH: "edit_punch_in",
    },
    COMPANY_INFO: {
        MODULE: "company_info",
        EDIT_COMPANY: "company_info_edit",
    },
    NOTES: {
        MODULE: "notes_module",
        VIEW: "notes_view",
        CREATE: "notes_create",
        UPDATE: "notes_update",
        DELETE: "notes_delete"
    },
    GALLERY: {
        MODULE: "gallery_module",
        VIEW: "gallery_view",
        CREATE: "gallery_create",
        UPDATE: "gallery_update",
        DELETE: "gallery_delete"
    },
    SUBSCRIPTION: {
        MODULE: "subscription_module",
        VIEW: "subscription_view",
        CREATE: "subscription_create",
    },
};

let screenList = [
    {
        "key": moduleObj.DASHBOARD.MODULE,
        "label": "Dashboard",
        "access": false,
        "children": [
            {
                "key": moduleObj.DASHBOARD.VIEW,
                "label": "View Dashboard",
                "access": false
            },
            {
                "key": moduleObj.DASHBOARD.CHARTS,
                "label": "View Charts",
                "access": false
            },
            {
                "key": moduleObj.DASHBOARD.WIDGETS,
                "label": "View Widgets",
                "access": false
            }
        ]
    },
    {
        "key": moduleObj.EMPLOYEE.MODULE,
        "label": "Company",
        "access": false,
        "children": [
            {
                "key": moduleObj.EMPLOYEE.VIEW,
                "label": "View Company",
                "access": false
            },
            {
                "key": moduleObj.EMPLOYEE.UPDATE,
                "label": "Update Company",
                "access": false
            },
            {
                "key": moduleObj.EMPLOYEE.DELETE,
                "label": "Delete Company",
                "access": false
            }
        ]
    },
    {
        "key": moduleObj.EMPLOYEE.MODULE,
        "label": "Employee",
        "access": false,
        "children": [
            {
                "key": moduleObj.EMPLOYEE.VIEW,
                "label": "View Employees",
                "access": false
            },
            {
                "key": moduleObj.EMPLOYEE.CREATE,
                "label": "Create Employee",
                "access": false
            },
            {
                "key": moduleObj.EMPLOYEE.UPDATE,
                "label": "Update Employee",
                "access": false
            },
            {
                "key": moduleObj.EMPLOYEE.DELETE,
                "label": "Delete Employee",
                "access": false
            }
        ]
    },
    {
        "key": moduleObj.ROLE.MODULE,
        "label": "Role Management",
        "access": false,
        "children": [
            {
                "key": moduleObj.ROLE.VIEW,
                "label": "View Roles",
                "access": false
            },
            {
                "key": moduleObj.ROLE.CREATE,
                "label": "Create Role",
                "access": false
            },
            {
                "key": moduleObj.ROLE.UPDATE,
                "label": "Update Role",
                "access": false
            },
            {
                "key": moduleObj.ROLE.DELETE,
                "label": "Delete Role",
                "access": false
            }
        ]
    },
    {
        "key": moduleObj.SETTINGS.MODULE,
        "label": "Settings",
        "access": false,
        "children": [
            {
                "key": moduleObj.SETTINGS.WORK_CONFIG_SETTINGS_VIEW,
                "label": "Work Config Settings",
                "access": false
            },
            {
                "key": moduleObj.SETTINGS.WORK_CONFIG_SETTINGS_CREATE,
                "label": "Work Config Create",
                "access": false
            },
            {
                "key": moduleObj.SETTINGS.WORK_CONFIG_SETTINGS_UPDATE,
                "label": "Work Config Update",
                "access": false
            },
            {
                "key": moduleObj.SETTINGS.WORK_CONFIG_SETTINGS_DELETE,
                "label": "Work Config Delete",
                "access": false
            },
        ]
    },
    {
        "key": moduleObj.PUNCH_IN_PUNCH_OUT.MODULE,
        "label": "Punch In/Out",
        "access": false,
        "children": [
            {
                "key": moduleObj.PUNCH_IN_PUNCH_OUT.PUNCH_IN_PUNCH_OUT,
                "label": "Default Punch In/Out",
                "access": false
            },
            {
                "key": moduleObj.PUNCH_IN_PUNCH_OUT.EDIT_OTHER_PUNCH,
                "label": "Edit Other Punch In/Out",
                "access": false
            },
        ]
    },
    {
        "key": moduleObj.COMPANY_INFO.MODULE,
        "label": "Company Info",
        "access": false,
        "children": [
            {
                "key": moduleObj.COMPANY_INFO.EDIT_COMPANY,
                "label": "Edit Company Details",
                "access": false
            },
        ]
    },
    {
        "key": moduleObj.NOTES.MODULE,
        "label": "Notes",
        "access": false,
        "children": [
            {
                "key": moduleObj.NOTES.VIEW,
                "label": "View Notes",
                "access": false
            },
            {
                "key": moduleObj.NOTES.CREATE,
                "label": "Create Note",
                "access": false
            },
            {
                "key": moduleObj.NOTES.UPDATE,
                "label": "Update Note",
                "access": false
            },
            {
                "key": moduleObj.NOTES.DELETE,
                "label": "Delete Note",
                "access": false
            }
        ]
    },
    {
        "key": moduleObj.GALLERY.MODULE,
        "label": "Gallery",
        "access": false,
        "children": [
            {
                "key": moduleObj.GALLERY.VIEW,
                "label": "View Gallery",
                "access": false
            },
            {
                "key": moduleObj.GALLERY.CREATE,
                "label": "Create Gallery Item",
                "access": false
            },
            {
                "key": moduleObj.GALLERY.UPDATE,
                "label": "Update Gallery Item",
                "access": false
            },
            {
                "key": moduleObj.GALLERY.DELETE,
                "label": "Delete Gallery Item",
                "access": false
            }
        ]
    },
    {
        "key": moduleObj.SUBSCRIPTION.MODULE,
        "label": "Subscription",
        "access": false,
        "children": [
            {
                "key": moduleObj.SUBSCRIPTION.VIEW,
                "label": "View Subscription",
                "access": false
            },
            {
                "key": moduleObj.SUBSCRIPTION.CREATE,
                "label": "Create Subscription",
                "access": false
            }
        ]
    },
    {
        "key": moduleObj.CALL.MODULE,
        "label": "Call",
        "access": false,
        "children":[
            {
                "key": moduleObj.CALL.VIEW,
                "label": "View Call",
                "access": false
            },
            {
                "key":moduleObj.CALL.TEAM_CALL,
                "label": "Team Call",
                "access":false
            },
            {
                "key":moduleObj.CALL.CUSTOMER_CALL,
                "label": "Customer Call",
                "access":false
            },
            {
                "key":moduleObj.CALL.SPECTATING_CALL,
                "label": "Spectating Call",
                "access":false
            }
        ]
    }
];

module.exports = {
    ROLE_OWNER: "Owner",
    ROLE_CUSTOMER:"Customer",
    TEMP_PASSWORD: "Test@123",
    USER_BACKEND_STATUS:{
        "only_login":"only_login",
        "company_created":"company_created",
    },
    //Role info
    moduleAccess: moduleObj,
    screenRoleInfo: screenList
};