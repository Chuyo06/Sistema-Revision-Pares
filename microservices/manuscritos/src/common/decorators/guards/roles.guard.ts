import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Extraer los roles definidos en el decorador @Roles
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 2. Si la ruta no tiene el decorador @Roles, se considera pública
    if (!requiredRoles) {
      return true;
    }

    // 3. Obtener la petición y el usuario
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log('--- [RolesGuard] Verificando acceso ---');
    console.log('Roles requeridos:', requiredRoles);
    console.log('Usuario en request:', user);

    // 4. VALIDACIÓN CRÍTICA: Si no hay usuario o no tiene roles, bloqueamos
    if (!user || (!user.roles && !user.rol && !user.role)) {
      console.log('Acceso Denegado: No se encontró usuario o roles en la petición');
      throw new ForbiddenException('No tienes permisos para acceder a este recurso (Usuario no identificado)');
    }

    // Compatibilidad para admitir un array (via user.roles) o un single role (via user.rol/role)
    const userRolesRaw = user.roles || user.rol || user.role;
    const rolesArray = Array.isArray(userRolesRaw) ? userRolesRaw : String(userRolesRaw).split(',');

    // 5. Comprobar si al menos uno de los roles del usuario coincide con los requeridos
    const hasRole = requiredRoles.some((requiredRole) => rolesArray.includes(requiredRole));

    if (!hasRole) {
      console.log(`Acceso Denegado: Los roles '${rolesArray.join(',')}' no son suficientes`);
      throw new ForbiddenException(`Se requiere uno de los siguientes roles: ${requiredRoles.join(', ')}`);
    }

    console.log('Acceso Concedido');
    return true;
  }
}