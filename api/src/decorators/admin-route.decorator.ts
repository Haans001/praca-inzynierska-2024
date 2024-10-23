import { SetMetadata } from '@nestjs/common';

export const ADMIN_ROUTE_KEY = 'adminRoute';
export const AdminRoute = () => SetMetadata(ADMIN_ROUTE_KEY, true);
