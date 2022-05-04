import { MenuItemModel } from './layout/components/aside/aside-menu/menu-item-model';
import React, { lazy } from 'react';

const HomePage = lazy(() => import('./pages/_homepage'))
const UserPage = lazy(() => import('./pages/user/user'))
const ProviderPage = lazy(() => import('./pages/provider/provider'))
const ServicePage = lazy(() => import('./pages/service/service'))
const GroupPage = lazy(() => import('./pages/group/group'))
const AdvertisingPage = lazy(() => import('./pages/advertising/advertising'))

export const MainRoutes: MenuItemModel[] = [
  {parent: true, title: 'MENU.DASHBOARD', url: '/dashboard', component: HomePage},
  // { parent: true, title: 'MENU.USER_MANAGEMENT', url: '/user-management', component: UserPage },
  { parent: true, title: 'MENU.VEHICLE_MANAGEMENT', url: '/vehicle-management', component: ProviderPage },
  { parent: true, title: 'MENU.REQUEST_MANAGEMENT', url: '/request-management', component: ServicePage },
  // { parent: true, title: 'MENU.ADMIN_MANAGEMENT', url: '/admin-management', component: HomePage },
];
