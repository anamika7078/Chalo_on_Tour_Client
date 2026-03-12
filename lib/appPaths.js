function getRole(userOrRole) {
  if (!userOrRole) return null;
  if (typeof userOrRole === 'string') return userOrRole;
  return userOrRole.role || null;
}

export function isPortalUser(userOrRole) {
  return getRole(userOrRole) === 'staff';
}

export function getAppBasePath(userOrRole) {
  return isPortalUser(userOrRole) ? '/portal' : '/admin';
}

export function getScopedPath(userOrRole, path = '') {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${getAppBasePath(userOrRole)}${normalizedPath}`;
}

export function getRoleHomePath(userOrRole) {
  return getScopedPath(userOrRole, '/dashboard');
}

export function getLeadsPath(userOrRole, suffix = '') {
  return `${getScopedPath(userOrRole, '/leads')}${suffix}`;
}
