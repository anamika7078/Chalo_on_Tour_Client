/**
 * Checks if a user has permission to perform an action on a specific entry.
 * Superadmin always has full access. Staff can view/edit only leads assigned to them; cannot delete.
 */
export function checkEntryPermission(entry, user, action, globalPermission) {
  if (!user || !entry) return false;
  if (user.role === 'superadmin') return true;
  if (user.role === 'staff') {
    if (action === 'delete') return false;
    const assignedId = entry.assigned_to?._id?.toString?.() || entry.assigned_to?.toString?.() || null;
    return assignedId === user.id;
  }
  return globalPermission;
}

export function canDeleteLead(user) {
  return user?.role === 'superadmin';
}

export function canUploadExcel(user) {
  return user?.role === 'superadmin';
}

export function canEditPayment(user) {
  return user?.role === 'superadmin';
}

export function canCreateLead(user) {
  return user?.role === 'superadmin';
}

export function canAssignLead(user) {
  return user?.role === 'superadmin';
}
