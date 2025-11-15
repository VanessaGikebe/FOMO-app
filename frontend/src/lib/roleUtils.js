// Small helper to centralize role/type normalization and dashboard routing.
// Frontend uses user-facing role labels: 'Experience Seeker', 'Event Organiser', 'moderator'.

function normalizeRoleOrType(input) {
  if (!input) return null;
  const s = String(input).trim().toLowerCase();
  if (!s) return null;

  // Experience Seeker / attendee variants
  if (
    s === 'attendee' ||
    s.includes('experience') ||
    s.includes('goer') ||
    s.includes('attend') ||
    s === 'eventgoer' ||
    s === 'event_goer' ||
    s === 'experience_seeker' ||
    s === 'experience seeker'
  ) {
    return 'Experience Seeker';
  }

  // Event Organiser / organizer variants
  if (s.includes('organis') || s.includes('organizer') || s.includes('organiser') || s.includes('organ') || s.includes('event_organiser') || s.includes('event organiser')) {
    return 'Event Organiser';
  }

  // Moderator
  if (s.includes('moderator') || s.includes('mod')) return 'moderator';

  return null;
}

function roleToType(roleOrType) {
  // Map normalized role labels to frontend UI 'type' used in Navbar and pages
  const r = normalizeRoleOrType(roleOrType) || String(roleOrType || '').trim();
  if (!r) return 'public';
  if (r === 'Experience Seeker') return 'eventGoer';
  if (r === 'Event Organiser') return 'eventOrganiser';
  if (r === 'moderator') return 'moderator';
  // Fallbacks for UI-style inputs
  const s = String(roleOrType).toLowerCase();
  if (s === 'eventgoer' || s === 'event_goer' || s === 'experience seeker') return 'eventGoer';
  if (s === 'eventorganiser' || s === 'eventorganizer' || s === 'event_organiser') return 'eventOrganiser';
  return 'public';
}

function getDashboardForRole(role) {
  const r = normalizeRoleOrType(role);
  if (r === 'Event Organiser') return '/eo-dashboard';
  if (r === 'moderator') return '/m-dashboard';
  // default and Experience Seeker -> event goer dashboard
  return '/eg-dashboard';
}

export { normalizeRoleOrType, roleToType, getDashboardForRole };
