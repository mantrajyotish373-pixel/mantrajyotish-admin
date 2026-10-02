// Which permission unlocks which screen. Used for the sidebar, route guards and the landing redirect.
export const ROUTE_PERMISSIONS = [
  { prefix: '/dashboard', perm: 'dashboard.view' },
  { prefix: '/users', perm: 'users.view' },
  { prefix: '/astrologers/add', perm: 'astrologers.edit' },
  { prefix: '/astrologers', perm: 'astrologers.view' },
  { prefix: '/kyc-verification', perm: 'kyc.view' },
  { prefix: '/interviews', perm: 'interviews.view' },
  { prefix: '/interview-room', perm: 'interviews.view' },
  { prefix: '/bookings', perm: 'bookings.view' },
  { prefix: '/chats', perm: 'chats.view' },
  { prefix: '/calls', perm: 'calls.view' },
  { prefix: '/payments', perm: 'payments.view' },
  { prefix: '/withdraw-requests', perm: 'withdrawals.view' },
  { prefix: '/reports', perm: 'reports.view' },
  { prefix: '/reviews', perm: 'reviews.view' },
  { prefix: '/notifications', perm: 'notifications.view' },
  { prefix: '/coupons', perm: 'coupons.manage' },
  { prefix: '/banner-management', perm: 'banners.manage' },
  { prefix: '/team', perm: 'SUPERADMIN' },
  { prefix: '/roles', perm: 'SUPERADMIN' },
  { prefix: '/audit-log', perm: 'SUPERADMIN' }
];

export const permissionForPath = (path) =>
  ROUTE_PERMISSIONS.find((r) => path.startsWith(r.prefix))?.perm || null;
