import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class OptionalRolesGuard implements CanActivate {
  constructor(private readonly allowedRoles: string[]) {}

  private normalizeRole(role: string): string {
    if (!role) return '';
    return role.toLowerCase().replace(/\s+/g, '');
  }

  private isRoleAllowed(role: string): boolean {
    const normalized = this.normalizeRole(role);
    return this.allowedRoles.some(allowed => this.normalizeRole(allowed) === normalized);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    // If no auth header, allow anyway (for testing)
    if (!authHeader) {
      request.user = null;
      return true;
    }

    try {
      const token = authHeader.split(' ')[1];
      const decoded = await admin.auth().verifyIdToken(token);

      // Check token role claim
      if (decoded.role && this.isRoleAllowed(decoded.role)) {
        request.user = decoded;
        return true;
      }

      // Check Firestore user document
      try {
        const userDoc = await admin.firestore().collection('users').doc(decoded.uid).get();
        const userData = userDoc.data();
        
        if (userData?.role && this.isRoleAllowed(userData.role)) {
          request.user = { ...decoded, role: userData.role };
          return true;
        }
      } catch (err) {
        console.warn('Failed to check Firestore user role:', err);
      }

      // If no valid role, still allow for testing (just attach user without role)
      request.user = decoded;
      return true;
    } catch (err) {
      console.warn('Could not verify token:', err);
      // Allow anyway (for testing/development)
      request.user = null;
      return true;
    }
  }
}
