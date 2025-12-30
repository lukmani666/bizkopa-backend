export enum BusinessRole {
  OWNER = 'owner',
  MANAGER = 'manager',
  STAFF = 'staff'
}

export enum BusinessPermission {
  BUSINESS_READ = 'business:read',
  BUSINESS_UPADATE = 'business:update',
  BUSINESS_DELETE = 'business:delete',

  STAFF_READ = 'staff:read',
  STAFF_INVITE = 'staff:invite',
  STAFF_UPDATE = 'staff:update',
  STAFF_REMOVE = 'staff:remove'
}

export const RolePermission: Record<BusinessRole, BusinessPermission[]> = {
  [BusinessRole.OWNER]: [
    BusinessPermission.BUSINESS_READ,
    BusinessPermission.BUSINESS_UPADATE,
    BusinessPermission.BUSINESS_DELETE,
    BusinessPermission.STAFF_READ,
    BusinessPermission.STAFF_INVITE,
    BusinessPermission.STAFF_UPDATE,
    BusinessPermission.STAFF_REMOVE
  ],

  [BusinessRole.MANAGER]: [
    BusinessPermission.BUSINESS_READ,
    BusinessPermission.BUSINESS_UPADATE,
    BusinessPermission.STAFF_READ,
    BusinessPermission.STAFF_INVITE
  ],

  [BusinessRole.STAFF]: [
    BusinessPermission.BUSINESS_READ
  ]
};