const moduleObj = {
    DASHBOARD: {
        MODULE: "dashboard_module",
        VIEW: "dashboard_view",
        CHARTS: "dashboard_charts",
        WIDGETS: "dashboard_widgets"
    },
    CALL: {
        MODULE: "call_module",
        VIEW: "call_view",
        TEAM_CALL: "team_call",
        CUSTOMER_CALL: "customer_call",
        SPECTATING_CALL: "spectating_call"
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

    COMPANY: {
        MODULE: "company_module",
        VIEW: "company_view",
        UPDATE: "company_update"
    },

    PROFILE: {
        MODULE: "profile_module",
        VIEW: "profile_view",
        UPDATE: "profile_update"
    },

    SETTINGS: {
        MODULE: "settings_module",
        VIEW: "settings_view",
        CREATE: "settings_create",
        UPDATE: "settings_update",
        DELETE: "settings_delete"
    },

    HOLIDAY: {
        MODULE: "holiday_module",
        VIEW: "holiday_view",
        CREATE: "holiday_create",
        UPDATE: "holiday_update",
        DELETE: "holiday_delete"
    },

    TIMELINE: {
        MODULE: "timeline_module",
        VIEW: "timeline_view",
        CREATE: "timeline_create",
        UPDATE: "timeline_update",
        DELETE: "timeline_delete"
    },

    POLICIES: {
        MODULE: "policies_module",
        VIEW: "policies_view",
        CREATE: "policies_create",
        UPDATE: "policies_update",
        DELETE: "policies_delete",
        VIEW_DETAILS: "policies_view_details"
    },

    LOAN: {
        MODULE: "loan_module",
        VIEW: "loan_view",
        CREATE: "loan_create",
        UPDATE: "loan_update",
        DELETE: "loan_delete"
    },

    PUNCH_INFO: {
        MODULE: "punch_info_module",
        VIEW: "punch_info_view",
    },

    EMPLOYEE_PUNCH_INFO: {
        MODULE: "employee_punch_info_module",
        VIEW: "employee_punch_info_view",
        CREATE: "employee_punch_info_create",
        UPDATE: "employee_punch_info_update"
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
        CREATE: "subscription_create"
    },

    SALARY: {
        MODULE: "salary_module",
        VIEW: "salary_view",
        CREATE: "salary_create",
        UPDATE: "salary_update",
        DELETE: "salary_delete"
    },

    ORGANIZATION: {
        MODULE: "organization_hierarchy_module",
        VIEW: "organization_hierarchy_view"
    },

    TEAM_CHAT: {
        MODULE: "team_chat_module",
        VIEW: "team_chat_view"
    }
};

const screenList = [
    // Dashboard
    {
        key: moduleObj.DASHBOARD.MODULE,
        label: "Dashboard",
        access: false,
        children: [
            { key: moduleObj.DASHBOARD.VIEW, label: "View Dashboard", access: false },
            { key: moduleObj.DASHBOARD.CHARTS, label: "View Charts", access: false },
            { key: moduleObj.DASHBOARD.WIDGETS, label: "View Widgets", access: false }
        ]
    },

    // Organization
    {
        key: moduleObj.ORGANIZATION.MODULE,
        label: "Organization Hierarchy",
        access: false,
        children: [
            { key: moduleObj.ORGANIZATION.VIEW, label: "View Organization", access: false }
        ]
    },

    // Team Chat
    {
        key: moduleObj.TEAM_CHAT.MODULE,
        label: "Team Chat",
        access: false,
        children: [
            { key: moduleObj.TEAM_CHAT.VIEW, label: "Access Chat", access: false }
        ]
    },

    // Company
    {
        key: moduleObj.COMPANY.MODULE,
        label: "Company",
        access: false,
        children: [
            { key: moduleObj.COMPANY.VIEW, label: "View Company", access: false },
            { key: moduleObj.COMPANY.UPDATE, label: "Update Company", access: false }
        ]
    },

    // Employee
    {
        key: moduleObj.EMPLOYEE.MODULE,
        label: "Employee",
        access: false,
        children: [
            { key: moduleObj.EMPLOYEE.VIEW, label: "View Employees", access: false },
            { key: moduleObj.EMPLOYEE.CREATE, label: "Create Employee", access: false },
            { key: moduleObj.EMPLOYEE.UPDATE, label: "Update Employee", access: false },
            { key: moduleObj.EMPLOYEE.DELETE, label: "Delete Employee", access: false }
        ]
    },

    // Role
    {
        key: moduleObj.ROLE.MODULE,
        label: "Role Management",
        access: false,
        children: [
            { key: moduleObj.ROLE.VIEW, label: "View Roles", access: false },
            { key: moduleObj.ROLE.CREATE, label: "Create Role", access: false },
            { key: moduleObj.ROLE.UPDATE, label: "Update Role", access: false },
            { key: moduleObj.ROLE.DELETE, label: "Delete Role", access: false }
        ]
    },

    // Profile
    {
        key: moduleObj.PROFILE.MODULE,
        label: "Profile",
        access: false,
        children: [
            { key: moduleObj.PROFILE.VIEW, label: "View Profile", access: false },
            { key: moduleObj.PROFILE.UPDATE, label: "Update Profile", access: false }
        ]
    },

    // Settings
    {
        key: moduleObj.SETTINGS.MODULE,
        label: "Settings",
        access: false,
        children: [
            { key: moduleObj.SETTINGS.VIEW, label: "View Settings", access: false },
            { key: moduleObj.SETTINGS.CREATE, label: "Create Settings", access: false },
            { key: moduleObj.SETTINGS.UPDATE, label: "Update Settings", access: false },
            { key: moduleObj.SETTINGS.DELETE, label: "Delete Settings", access: false }
        ]
    },

    // Holiday
    {
        key: moduleObj.HOLIDAY.MODULE,
        label: "Holiday",
        access: false,
        children: [
            { key: moduleObj.HOLIDAY.VIEW, label: "View Holiday", access: false },
            { key: moduleObj.HOLIDAY.CREATE, label: "Create Holiday", access: false },
            { key: moduleObj.HOLIDAY.UPDATE, label: "Update Holiday", access: false },
            { key: moduleObj.HOLIDAY.DELETE, label: "Delete Holiday", access: false }
        ]
    },

    // Timeline
    {
        key: moduleObj.TIMELINE.MODULE,
        label: "Timeline",
        access: false,
        children: [
            { key: moduleObj.TIMELINE.VIEW, label: "View Timeline", access: false },
            { key: moduleObj.TIMELINE.CREATE, label: "Create Timeline", access: false },
            { key: moduleObj.TIMELINE.UPDATE, label: "Update Timeline", access: false },
            { key: moduleObj.TIMELINE.DELETE, label: "Delete Timeline", access: false }
        ]
    },

    // Policies
    {
        key: moduleObj.POLICIES.MODULE,
        label: "Policies",
        access: false,
        children: [
            { key: moduleObj.POLICIES.VIEW, label: "View Policies", access: false },
            { key: moduleObj.POLICIES.CREATE, label: "Create Policy", access: false },
            { key: moduleObj.POLICIES.UPDATE, label: "Update Policy", access: false },
            { key: moduleObj.POLICIES.DELETE, label: "Delete Policy", access: false },
            { key: moduleObj.POLICIES.VIEW_DETAILS, label: "View Policy Details", access: false }
        ]
    },

    // Loan
    {
        key: moduleObj.LOAN.MODULE,
        label: "Loan",
        access: false,
        children: [
            { key: moduleObj.LOAN.VIEW, label: "View Loan", access: false },
            { key: moduleObj.LOAN.CREATE, label: "Create Loan", access: false },
            { key: moduleObj.LOAN.UPDATE, label: "Update Loan", access: false },
            { key: moduleObj.LOAN.DELETE, label: "Delete Loan", access: false }
        ]
    },

    // Punch Info
    {
        key: moduleObj.PUNCH_INFO.MODULE,
        label: "Self Punch Info",
        access: false,
        children: [
            { key: moduleObj.PUNCH_INFO.VIEW, label: "View Punch Info", access: false },
        ]
    },

    {
        key: moduleObj.EMPLOYEE_PUNCH_INFO.MODULE,
        label: "Employee Punch Info",
        access: false,
        children: [
            { key: moduleObj.EMPLOYEE_PUNCH_INFO.VIEW, label: "View Punch Info", access: false },
            { key: moduleObj.EMPLOYEE_PUNCH_INFO.CREATE, label: "Create Punch Info", access: false },
            { key: moduleObj.EMPLOYEE_PUNCH_INFO.UPDATE, label: "Update Punch Info", access: false }
        ]
    },

    // Notes
    {
        key: moduleObj.NOTES.MODULE,
        label: "Notes",
        access: false,
        children: [
            { key: moduleObj.NOTES.VIEW, label: "View Notes", access: false },
            { key: moduleObj.NOTES.CREATE, label: "Create Note", access: false },
            { key: moduleObj.NOTES.UPDATE, label: "Update Note", access: false },
            { key: moduleObj.NOTES.DELETE, label: "Delete Note", access: false }
        ]
    },

    // Gallery
    {
        key: moduleObj.GALLERY.MODULE,
        label: "Gallery",
        access: false,
        children: [
            { key: moduleObj.GALLERY.VIEW, label: "View Gallery", access: false },
            { key: moduleObj.GALLERY.CREATE, label: "Create Gallery", access: false },
            { key: moduleObj.GALLERY.UPDATE, label: "Update Gallery", access: false },
            { key: moduleObj.GALLERY.DELETE, label: "Delete Gallery", access: false }
        ]
    },

    // Subscription
    {
        key: moduleObj.SUBSCRIPTION.MODULE,
        label: "Subscription",
        access: false,
        children: [
            { key: moduleObj.SUBSCRIPTION.VIEW, label: "View Subscription", access: false },
            { key: moduleObj.SUBSCRIPTION.CREATE, label: "Create Subscription", access: false }
        ]
    },

    // Salary
    {
        key: moduleObj.SALARY.MODULE,
        label: "Salary Template",
        access: false,
        children: [
            { key: moduleObj.SALARY.VIEW, label: "View Salary Template", access: false },
            { key: moduleObj.SALARY.CREATE, label: "Create Salary Template", access: false },
            { key: moduleObj.SALARY.UPDATE, label: "Update Salary Template", access: false },
            { key: moduleObj.SALARY.DELETE, label: "Delete Salary Template", access: false }
        ]
    }
];

module.exports = {
    ROLE_OWNER: "Owner",
    ROLE_CUSTOMER: "Customer",
    TEMP_PASSWORD: "Test@123",
    USER_BACKEND_STATUS: {
        "only_login": "only_login",
        "company_created": "company_created",
    },
    //Role info
    moduleAccess: moduleObj,
    screenRoleInfo: screenList
};
