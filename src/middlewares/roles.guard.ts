import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 *
 */
@Injectable()
export class RoleAdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const userRole: number = request.user.dataValues.idRole;
    const isActive: boolean = request.user.dataValues.active == true;
    const isDeleted: boolean = request.user.dataValues.deleted == true;
    return userRole == 1 && isActive && !isDeleted ? true : false;
  }
}

/**
 *
 */
@Injectable()
export class RoleWarehouseGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const userRole: number = request.user.dataValues.idRole;
    const isActive: boolean = request.user.dataValues.active == true;
    const isDeleted: boolean = request.user.dataValues.deleted == true;
    return userRole == 3 && isActive && !isDeleted ? true : false;
  }
}

/**
 *
 */
@Injectable()
export class RoleOrganizationAdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const userRole: number = request.user.dataValues.idRole;
    const isActive: boolean = request.user.dataValues.active == true;
    const isDeleted: boolean = request.user.dataValues.deleted == true;
    return (userRole == 1 || userRole == 2) && isActive && !isDeleted ? true : false;
  }
}

/**
 *
 */
@Injectable()
export class RoleClientGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const userRole: number = request.user.dataValues.idRole;
    const isActive: boolean = request.user.dataValues.active == true;
    const isDeleted: boolean = request.user.dataValues.deleted == true;
    return userRole == 7 && isActive && !isDeleted ? true : false;
  }
}

/**
 *
 */
@Injectable()
export class RoleProductionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const userRole: number = request.user.dataValues.idRole;
    const isActive: boolean = request.user.dataValues.active == true;
    const isDeleted: boolean = request.user.dataValues.deleted == true;
    return userRole == 8 && isActive && !isDeleted ? true : false;
  }
}


/**
 *
 */
@Injectable()
export class RoleDeviceGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return request.user.idDevice ? true : false;
  }
}

/**
 *
 */
@Injectable()
export class RoleWaterDeviceGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return request.user.type == 1 ? true : false;
  }
}

/**
 *
 */
@Injectable()
export class RoleGasDeviceGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return request.user.type == 0 ? true : false;
  }
}

/**
 *
 */
@Injectable()
export class RoleTechnicianGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const userRole: number = request.user.dataValues.idRole;
    const isActive: boolean = request.user.dataValues.active == true;
    const isDeleted: boolean = request.user.dataValues.deleted == true;
    return userRole == 6 && isActive && !isDeleted ? true : false;
  }
}
