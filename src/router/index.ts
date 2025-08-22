import type { App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'
import { setupPageGuard } from './permission'
import mjlayout from '@/views/mj/layout.vue'
import sunoLayout from '@/views/suno/layout.vue'
import lumaLayout from '@/views/luma/layout.vue'

const routes: RouteRecordRaw[] = [
  // 将根路径重定向到绘画功能
  {
    path: '/',
    name: 'Root',
    redirect: '/draw'
  },


  {
    path: '/draw',
    name: 'Rootdraw',
    component: mjlayout,
    redirect: '/draw/index',
    children: [
      {
        path: '/draw/:uuid?',
        name: 'draw',
        component: () => import('@/views/mj/draw.vue'),
      },
    ],
  },

    {
    path: '/music',
    name: 'music',
    component: sunoLayout,
    redirect: '/music/index',
    children: [
      {
        path: '/music/:uuid?',
        name: 'music',
        component: () => import('@/views/suno/music.vue'),
      },
    ],

    

  },
  {
    path: '/video',
    name: 'video',
    component: lumaLayout,
    redirect: '/video/index',
    children: [
      {
        path: '/video/:uuid?',
        name: 'video',
        component: () => import('@/views/luma/video.vue'),
      },
    ],
  },

  {
    path: '/dance',
    name: 'dance',
    component: lumaLayout,
    redirect: '/dance/index',
    children: [
      {
        path: '/dance/:uuid?',
        name: 'dance',
        component: () => import('@/views/viggle/dance.vue'),
      },
    ],
  },

  {
    path: '/wav',
    name: 'wav',
    component: lumaLayout,
    redirect: '/wav/index',
    children: [
      {
        path: '/wav/:uuid?',
        name: 'wav',
        component: () => import('@/views/wav/wav.vue'),
      },
    ],
  },

  //调试
  // {
  //   path: '/mytest',
  //   name: 'mytest',
  //   component: () => import('@/views/mj/myTest.vue'),
  // },

  {
    path: '/404',
    name: '404',
    component: () => import('@/views/exception/404/index.vue'),
  },

  {
    path: '/500',
    name: '500',
    component: () => import('@/views/exception/500/index.vue'),
  },

  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    redirect: '/404',
  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

setupPageGuard(router)

export async function setupRouter(app: App) {
  app.use(router)
  await router.isReady()
}
