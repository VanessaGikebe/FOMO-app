import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  async signup(
    @Body()
    body: {
      email: string;
      password: string;
      fullName: string;
      role: string;
    },
  ) {
    const { email, password, fullName, role } = body;
    return this.authService.registerUser(
      email,
      password,
      role as any,
      fullName,
    );
  }
}
