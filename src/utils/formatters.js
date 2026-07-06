export function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function getInitials(user) {
  if (!user) return '?';
  const f = user.first_name?.[0] || '';
  const l = user.last_name?.[0] || '';
  return (f + l).toUpperCase() || user.username?.[0]?.toUpperCase() || '?';
}

export function getStatusClass(status) {
  const map = { pending: 'badge-pending', approved: 'badge-approved', rejected: 'badge-rejected' };
  return map[status] || 'badge';
}
