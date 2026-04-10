const moduleObj = {
  DASHBOARD: {
    MODULE: "dashboard_module",
    VIEW: "dashboard_view",
    CHARTS: "dashboard_charts",
    WIDGETS: "dashboard_widgets",
  },
  CALL: {
    MODULE: "call_module",
    VIEW: "call_view",
    TEAM_CALL: "team_call",
    CUSTOMER_CALL: "customer_call",
    SPECTATING_CALL: "spectating_call",
  },
  EMPLOYEE: {
    MODULE: "employee_module",
    VIEW: "employee_view",
    CREATE: "employee_create",
    UPDATE: "employee_update",
    DELETE: "employee_delete",
  },
  EMPLOYEE_FIELDS_ACCESS: {
    MODULE: "employee_fields_access_module",
    EMPLOYEE_NAME: "employee_name",
    EMPLOYEE_CODE: "employee_code",
    ROLE: "employee_role",
    STATUS: "employee_status",

    EMAIL: "employee_email",
    PRIMARY_MOBILE: "employee_primary_mobile",

    AADHAR_NUMBER: "employee_aadhar",
    UAN_NUMBER: "employee_uan",
    EPF_NUMBER: "employee_epf",

    BANK_ACCOUNT: "employee_bank_account",
    IFSC_CODE: "employee_ifsc",

    WORK_HOURS_CONFIG: "employee_work_hours_config",
  },
  ROLE: {
    MODULE: "role_module",
    VIEW: "role_view",
    CREATE: "role_create",
    UPDATE: "role_update",
    DELETE: "role_delete",
  },

  COMPANY: {
    MODULE: "company_module",
    VIEW: "company_view",
    UPDATE: "company_update",
  },
  COMPANY_FIELDS_ACCESS: {
    MODULE: "company_fields_access_module",
    COMPANY_NAME: "company_name",
    EMAIL: "company_email",
    PHONE: "company_phone",
    WEBSITE: "company_website",

    ADDRESS_LINE_1: "company_address_line_1",
    ADDRESS_LINE_2: "company_address_line_2",

    GST_NUMBER: "company_gst_number",
    SAC_NUMBER: "company_sac_number",
    PAN_NUMBER: "company_pan_number",
    ESIC_NUMBER: "company_esic_number",
    EPF_NUMBER: "company_epf_number",
    SERVICE_TAX_NUMBER: "company_service_tax_number",
  },

  PROFILE: {
    MODULE: "profile_module",
    VIEW: "profile_view",
    UPDATE: "profile_update",
  },

  SETTINGS: {
    MODULE: "settings_module",
    VIEW: "settings_view",
    CREATE: "settings_create",
    UPDATE: "settings_update",
    DELETE: "settings_delete",
  },

  HOLIDAY: {
    MODULE: "holiday_module",
    VIEW: "holiday_view",
    CREATE: "holiday_create",
    UPDATE: "holiday_update",
    DELETE: "holiday_delete",
  },

  TIMELINE: {
    MODULE: "timeline_module",
    VIEW: "timeline_view",
    CREATE: "timeline_create",
    UPDATE: "timeline_update",
    DELETE: "timeline_delete",
  },

  POLICIES: {
    MODULE: "policies_module",
    VIEW: "policies_view",
    CREATE: "policies_create",
    UPDATE: "policies_update",
    DELETE: "policies_delete",
    VIEW_DETAILS: "policies_view_details",
  },

  LOAN: {
    MODULE: "loan_module",
    VIEW: "loan_view",
    CREATE: "loan_create",
    UPDATE: "loan_update",
    DELETE: "loan_delete",
  },

  PUNCH_INFO: {
    MODULE: "punch_info_module",
    VIEW: "punch_info_view",
  },

  EMPLOYEE_PUNCH_INFO: {
    MODULE: "employee_punch_info_module",
    VIEW: "employee_punch_info_view",
    CREATE: "employee_punch_info_create",
    UPDATE: "employee_punch_info_update",
  },

  NOTES: {
    MODULE: "notes_module",
    VIEW: "notes_view",
    CREATE: "notes_create",
    UPDATE: "notes_update",
    DELETE: "notes_delete",
  },

  GALLERY: {
    MODULE: "gallery_module",
    VIEW: "gallery_view",
    CREATE: "gallery_create",
    UPDATE: "gallery_update",
    DELETE: "gallery_delete",
  },

  SUBSCRIPTION: {
    MODULE: "subscription_module",
    VIEW: "subscription_view",
    CREATE: "subscription_create",
  },

  SALARY: {
    MODULE: "salary_module",
    VIEW: "salary_view",
    CREATE: "salary_create",
    UPDATE: "salary_update",
    DELETE: "salary_delete",
  },

  ORGANIZATION: {
    MODULE: "organization_hierarchy_module",
    VIEW: "organization_hierarchy_view",
  },

  TEAM_CHAT: {
    MODULE: "team_chat_module",
    VIEW: "team_chat_view",
  },
};

const screenList = [
  // Dashboard
  {
    key: moduleObj.DASHBOARD.MODULE,
    label: "Dashboard",
    type:"module_access",
    access: false,
    children: [
      { key: moduleObj.DASHBOARD.VIEW, label: "View Dashboard", access: false },
      { key: moduleObj.DASHBOARD.CHARTS, label: "View Charts", access: false },
      {
        key: moduleObj.DASHBOARD.WIDGETS,
        label: "View Widgets",
        access: false,
      },
    ],
  },

  // Organization
  {
    key: moduleObj.ORGANIZATION.MODULE,
    label: "Organization Hierarchy",
    type:"module_access",
    access: false,
    children: [
      {
        key: moduleObj.ORGANIZATION.VIEW,
        label: "View Organization",
        access: false,
      },
    ],
  },

  // Team Chat
  {
    key: moduleObj.TEAM_CHAT.MODULE,
    label: "Team Chat",
    type:"module_access",
    access: false,
    children: [
      { key: moduleObj.TEAM_CHAT.VIEW, label: "Access Chat", access: false },
    ],
  },

  // Company
  {
    key: moduleObj.COMPANY.MODULE,
    label: "Company",
    type:"module_access",
    access: false,
    children: [
      { key: moduleObj.COMPANY.VIEW, label: "View Company", access: false },
      { key: moduleObj.COMPANY.UPDATE, label: "Update Company", access: false },
    ],
  },

  {
  key: moduleObj.COMPANY_FIELDS_ACCESS.MODULE,
  label: "Company Fields Access",
  type:"fields_access",
  access: false,
  children: [
    { key: moduleObj.COMPANY_FIELDS_ACCESS.COMPANY_NAME, label: "Company Name", access: false },
    { key: moduleObj.COMPANY_FIELDS_ACCESS.EMAIL, label: "Email", access: false },
    { key: moduleObj.COMPANY_FIELDS_ACCESS.PHONE, label: "Phone", access: false },

    { key: moduleObj.COMPANY_FIELDS_ACCESS.GST_NUMBER, label: "GST Number", access: false },
    { key: moduleObj.COMPANY_FIELDS_ACCESS.PAN_NUMBER, label: "PAN Number", access: false },
    { key: moduleObj.COMPANY_FIELDS_ACCESS.ESIC_NUMBER, label: "ESIC Number", access: false },
    { key: moduleObj.COMPANY_FIELDS_ACCESS.EPF_NUMBER, label: "EPF Number", access: false },
  ]
},

  // Employee
  {
    key: moduleObj.EMPLOYEE.MODULE,
    label: "Employee",
    type:"module_access",
    access: false,
    children: [
      { key: moduleObj.EMPLOYEE.VIEW, label: "View Employees", access: false },
      {
        key: moduleObj.EMPLOYEE.CREATE,
        label: "Create Employee",
        access: false,
      },
      {
        key: moduleObj.EMPLOYEE.UPDATE,
        label: "Update Employee",
        access: false,
      },
      {
        key: moduleObj.EMPLOYEE.DELETE,
        label: "Delete Employee",
        access: false,
      },
    ],
  },

  {
    key: moduleObj.EMPLOYEE_FIELDS_ACCESS.MODULE,
    type:"fields_access",
    label: "Employee Fields Access",
    access: true,
    children: [
      {
        key: moduleObj.EMPLOYEE_FIELDS_ACCESS.EMPLOYEE_NAME,
        label: "Employee Name",
        access: true,
      },
      {
        key: moduleObj.EMPLOYEE_FIELDS_ACCESS.EMPLOYEE_CODE,
        label: "Employee Code",
        access: true,
      },
      {
        key: moduleObj.EMPLOYEE_FIELDS_ACCESS.ROLE,
        label: "Role",
        access: true,
      },
      {
        key: moduleObj.EMPLOYEE_FIELDS_ACCESS.STATUS,
        label: "Status",
        access: true,
      },

      {
        key: moduleObj.EMPLOYEE_FIELDS_ACCESS.EMAIL,
        label: "Email",
        access: true,
      },
      {
        key: moduleObj.EMPLOYEE_FIELDS_ACCESS.PRIMARY_MOBILE,
        label: "Primary Mobile",
        access: true,
      },

      {
        key: moduleObj.EMPLOYEE_FIELDS_ACCESS.AADHAR_NUMBER,
        label: "Aadhar Number",
        access: true,
      },
      {
        key: moduleObj.EMPLOYEE_FIELDS_ACCESS.UAN_NUMBER,
        label: "UAN Number",
        access: true,
      },
      {
        key: moduleObj.EMPLOYEE_FIELDS_ACCESS.EPF_NUMBER,
        label: "EPF Number",
        access: true,
      },

      {
        key: moduleObj.EMPLOYEE_FIELDS_ACCESS.BANK_ACCOUNT,
        label: "Bank Account",
        access: true,
      },
      {
        key: moduleObj.EMPLOYEE_FIELDS_ACCESS.IFSC_CODE,
        label: "IFSC Code",
        access: true,
      },

      {
        key: moduleObj.EMPLOYEE_FIELDS_ACCESS.WORK_HOURS_CONFIG,
        label: "Work Hours Config",
        access: true,
      },
    ],
  },

  // Role
  {
    key: moduleObj.ROLE.MODULE,
    label: "Role Management",
    type:"module_access",
    access: false,
    children: [
      { key: moduleObj.ROLE.VIEW, label: "View Roles", access: false },
      { key: moduleObj.ROLE.CREATE, label: "Create Role", access: false },
      { key: moduleObj.ROLE.UPDATE, label: "Update Role", access: false },
      { key: moduleObj.ROLE.DELETE, label: "Delete Role", access: false },
    ],
  },

  // Profile
  {
    key: moduleObj.PROFILE.MODULE,
    label: "Profile",
    type:"module_access",
    access: false,
    children: [
      { key: moduleObj.PROFILE.VIEW, label: "View Profile", access: false },
      { key: moduleObj.PROFILE.UPDATE, label: "Update Profile", access: false },
    ],
  },

  // Settings
  {
    key: moduleObj.SETTINGS.MODULE,
    label: "Settings",
    type:"module_access",
    access: false,
    children: [
      { key: moduleObj.SETTINGS.VIEW, label: "View Settings", access: false },
      {
        key: moduleObj.SETTINGS.CREATE,
        label: "Create Settings",
        access: false,
      },
      {
        key: moduleObj.SETTINGS.UPDATE,
        label: "Update Settings",
        access: false,
      },
      {
        key: moduleObj.SETTINGS.DELETE,
        label: "Delete Settings",
        access: false,
      },
    ],
  },

  // Holiday
  {
    key: moduleObj.HOLIDAY.MODULE,
    label: "Holiday",
    type:"module_access",
    access: false,
    children: [
      { key: moduleObj.HOLIDAY.VIEW, label: "View Holiday", access: false },
      { key: moduleObj.HOLIDAY.CREATE, label: "Create Holiday", access: false },
      { key: moduleObj.HOLIDAY.UPDATE, label: "Update Holiday", access: false },
      { key: moduleObj.HOLIDAY.DELETE, label: "Delete Holiday", access: false },
    ],
  },

  // Timeline
  {
    key: moduleObj.TIMELINE.MODULE,
    label: "Timeline",
    type:"module_access",
    access: false,
    children: [
      { key: moduleObj.TIMELINE.VIEW, label: "View Timeline", access: false },
      {
        key: moduleObj.TIMELINE.CREATE,
        label: "Create Timeline",
        access: false,
      },
      {
        key: moduleObj.TIMELINE.UPDATE,
        label: "Update Timeline",
        access: false,
      },
      {
        key: moduleObj.TIMELINE.DELETE,
        label: "Delete Timeline",
        access: false,
      },
    ],
  },

  // Policies
  {
    key: moduleObj.POLICIES.MODULE,
    label: "Policies",
    type:"module_access",
    access: false,
    children: [
      { key: moduleObj.POLICIES.VIEW, label: "View Policies", access: false },
      { key: moduleObj.POLICIES.CREATE, label: "Create Policy", access: false },
      { key: moduleObj.POLICIES.UPDATE, label: "Update Policy", access: false },
      { key: moduleObj.POLICIES.DELETE, label: "Delete Policy", access: false },
      {
        key: moduleObj.POLICIES.VIEW_DETAILS,
        label: "View Policy Details",
        access: false,
      },
    ],
  },

  // Loan
  {
    key: moduleObj.LOAN.MODULE,
    label: "Loan",
    type:"module_access",
    access: false,
    children: [
      { key: moduleObj.LOAN.VIEW, label: "View Loan", access: false },
      { key: moduleObj.LOAN.CREATE, label: "Create Loan", access: false },
      { key: moduleObj.LOAN.UPDATE, label: "Update Loan", access: false },
      { key: moduleObj.LOAN.DELETE, label: "Delete Loan", access: false },
    ],
  },

  // Punch Info
  {
    key: moduleObj.PUNCH_INFO.MODULE,
    label: "Self Punch Info",
    type:"module_access",
    access: false,
    children: [
      {
        key: moduleObj.PUNCH_INFO.VIEW,
        label: "View Punch Info",
        access: false,
      },
    ],
  },

  {
    key: moduleObj.EMPLOYEE_PUNCH_INFO.MODULE,
    label: "Employee Punch Info",
    type:"module_access",
    access: false,
    children: [
      {
        key: moduleObj.EMPLOYEE_PUNCH_INFO.VIEW,
        label: "View Punch Info",
        access: false,
      },
      {
        key: moduleObj.EMPLOYEE_PUNCH_INFO.CREATE,
        label: "Create Punch Info",
        access: false,
      },
      {
        key: moduleObj.EMPLOYEE_PUNCH_INFO.UPDATE,
        label: "Update Punch Info",
        access: false,
      },
    ],
  },

  // Notes
  {
    key: moduleObj.NOTES.MODULE,
    label: "Notes",
    type:"module_access",
    access: false,
    children: [
      { key: moduleObj.NOTES.VIEW, label: "View Notes", access: false },
      { key: moduleObj.NOTES.CREATE, label: "Create Note", access: false },
      { key: moduleObj.NOTES.UPDATE, label: "Update Note", access: false },
      { key: moduleObj.NOTES.DELETE, label: "Delete Note", access: false },
    ],
  },

  // Gallery
  {
    key: moduleObj.GALLERY.MODULE,
    label: "Gallery",
    type:"module_access",
    access: false,
    children: [
      { key: moduleObj.GALLERY.VIEW, label: "View Gallery", access: false },
      { key: moduleObj.GALLERY.CREATE, label: "Create Gallery", access: false },
      { key: moduleObj.GALLERY.UPDATE, label: "Update Gallery", access: false },
      { key: moduleObj.GALLERY.DELETE, label: "Delete Gallery", access: false },
    ],
  },

  // Subscription
  {
    key: moduleObj.SUBSCRIPTION.MODULE,
    label: "Subscription",
    type:"module_access",
    access: false,
    children: [
      {
        key: moduleObj.SUBSCRIPTION.VIEW,
        label: "View Subscription",
        access: false,
      },
      {
        key: moduleObj.SUBSCRIPTION.CREATE,
        label: "Create Subscription",
        access: false,
      },
    ],
  },

  // Salary
  {
    key: moduleObj.SALARY.MODULE,
    label: "Salary Template",
    type:"module_access",
    access: false,
    children: [
      {
        key: moduleObj.SALARY.VIEW,
        label: "View Salary Template",
        access: false,
      },
      {
        key: moduleObj.SALARY.CREATE,
        label: "Create Salary Template",
        access: false,
      },
      {
        key: moduleObj.SALARY.UPDATE,
        label: "Update Salary Template",
        access: false,
      },
      {
        key: moduleObj.SALARY.DELETE,
        label: "Delete Salary Template",
        access: false,
      },
    ],
  },
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
