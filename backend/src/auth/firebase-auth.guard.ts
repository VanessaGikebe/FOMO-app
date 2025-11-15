import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import * as admin from "firebase-admin";

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader =
      request.headers["authorization"] || request.headers["Authorization"];
    if (!authHeader) throw new UnauthorizedException('Missing Authorization header');

    const parts = authHeader.split(' ');
    if (parts.length < 2) throw new UnauthorizedException('Bad Authorization header');
    const token = parts[1];

    try {
      const decoded = await admin.auth().verifyIdToken(token);
      // attach decoded token to request for handlers
      request.user = decoded;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired Firebase ID token');
    }
  }
}
