# Cleanup TODOs

## Files to Remove from GitHub Later

### 1. **frontend/src/app/(eventOrganiser)/eo-setup/page.js**
   - **Reason:** Role assignment should be handled during signup or by admin panel, not as a public page
   - **Status:** Currently on GitHub (commit 4e811b8)
   - **Action:** Delete and create clean commit to remove it
   - **Command:** 
     ```bash
     git rm "frontend/src/app/(eventOrganiser)/eo-setup/page.js"
     git commit -m "remove: Delete eo-setup page - role assignment should be handled during signup"
     git push origin main
     ```

### 2. **frontend/src/app/diagnosis/page.js**
   - **Reason:** Diagnostic/debugging tool - only for development troubleshooting
   - **Status:** Not committed (untracked)
   - **Action:** Delete or keep locally for development only
   - **Command:** Delete if not needed:
     ```bash
     rm "frontend/src/app/diagnosis/page.js"
     ```

### 3. **backend/src/auth/optional-roles.guard.ts**
   - **Reason:** Optional guard for testing - not needed in production, RolesGuard is the official implementation
   - **Status:** Not committed (untracked)
   - **Action:** Delete or keep locally
   - **Command:** Delete if not needed:
     ```bash
     rm backend/src/auth/optional-roles.guard.ts
     ```

## Files Already Committed (Core Functionality ✅)

- ✅ `backend/src/auth/auth.controller.ts` - POST /auth/set-role endpoint
- ✅ `backend/src/auth/roles.guard.ts` - Role normalization & dual auth
- ✅ `frontend/src/lib/api.js` - API functions
- ✅ `frontend/src/contexts/UserContext.js` - Token handling
- ✅ `frontend/src/components/pages/ProfilePage.js` - Real user data
- ✅ `frontend/src/app/(eventOrganiser)/eo-create_event_page/page.js` - Event creation
- ✅ `frontend/src/app/(eventOrganiser)/eo-edit_event_page/page.js` - Event editing

## Next Steps

1. Test event creation workflow with current setup
2. When ready, remove eo-setup page with separate commit
3. Clean up untracked files in local environment
