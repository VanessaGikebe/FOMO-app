import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly allowedRoles: string[]) {}

  private normalizeRole(role: string): string {
    if (!role) return '';
    // Normalize: lowercase and remove spaces, then check against allowed roles
    return role.toLowerCase().replace(/\s+/g, '');
  }

  private isRoleAllowed(role: string): boolean {
    const normalized = this.normalizeRole(role);
    return this.allowedRoles.some(allowed => this.normalizeRole(allowed) === normalized);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) throw new ForbiddenException('Missing Authorization header');

    const token = authHeader.split(' ')[1];
    const decoded = await admin.auth().verifyIdToken(token);
    console.log('✅ Token verified for UID:', decoded.uid);
    console.log('📋 Token role claim:', decoded.role);
    console.log('🔍 Allowed roles:', this.allowedRoles);

    // First check: token has role claim
    if (decoded.role && this.isRoleAllowed(decoded.role)) {
      console.log('✅ Role allowed via token claim:', decoded.role);
      request.user = decoded;
      return true;
    }

    // Fallback: check Firestore user document for role
    try {
      console.log('🔍 Checking Firestore for UID:', decoded.uid);
      const userDoc = await admin.firestore().collection('users').doc(decoded.uid).get();
      const userData = userDoc.data();
      console.log('📄 Firestore user data:', userData);
      
      if (userData?.role && this.isRoleAllowed(userData.role)) {
        console.log('✅ Role allowed via Firestore:', userData.role);
        request.user = { ...decoded, role: userData.role };
        return true;
      }
      
      console.log('❌ Firestore role not allowed:', userData?.role);
    } catch (err) {
      console.warn('❌ Failed to check Firestore user role:', err);
    }

    throw new ForbiddenException('Access denied: insufficient permissions');
  }
}

