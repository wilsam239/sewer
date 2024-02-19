import PipelineListVue from 'src/components/dashboard/PipelineList.vue';
import ProjectViewerVue from 'src/components/dashboard/ProjectViewer.vue';
import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/dashboard',
    redirect: '/dashboard/all',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('layouts/LoginLayout.vue'),
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: ':id',
        name: 'dashboard_pipeline',
        component: ProjectViewerVue,
      },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
