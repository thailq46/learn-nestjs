import {ExecutionContext, ForbiddenException, Injectable, UnauthorizedException} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {AuthGuard} from '@nestjs/passport';
import {Request} from 'express';
import {IS_PUBLIC_KEY, IS_PUBLIC_PERMISSION} from 'src/decorator/customize';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Giúp lấy ra metadata của handler hoặc class
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    const resquest: Request = context.switchToHttp().getRequest();

    const isSkipCheckPermission = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_PERMISSION, [
      context.getHandler(),
      context.getClass(),
    ]);

    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException('Token không hợp lệ');
    }
    // Check permission
    const targetMethod = resquest.method;
    const targetEndpoint = resquest.route.path;

    const permissions = user?.permissions || [];

    let hasPermission = permissions.find(
      (permission) => targetMethod === permission.method && targetEndpoint === permission.endpoint,
    );

    if (targetEndpoint.startsWith('/api/v1/auth')) {
      hasPermission = true;
    }

    if (!hasPermission && !isSkipCheckPermission) {
      throw new ForbiddenException('Bạn không có quyền truy cập endpoint này');
    }
    return user;
  }
}
