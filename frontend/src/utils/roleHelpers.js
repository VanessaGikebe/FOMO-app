// Compatibility shim: re-export helpers from `src/lib/roleUtils.js` so older imports
// using `@/utils/roleHelpers` keep working.
import { normalizeRoleOrType, roleToType, getDashboardForRole } from '../lib/roleUtils';

export { normalizeRoleOrType, roleToType, getDashboardForRole };

export default {
  normalizeRoleOrType,
  roleToType,
  getDashboardForRole,
};
