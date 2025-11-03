import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly allowedRoles: string[]) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) throw new ForbiddenException('Missing Authorization header');

    const token = authHeader.split(' ')[1];
    const decoded = await admin.auth().verifyIdToken(token);

    if (!decoded.role || !this.allowedRoles.includes(decoded.role)) {
      throw new ForbiddenException('Access denied: insufficient permissions');
    }

    request.user = decoded;
    return true;
  }
}
