// File: .env
VITE_API_SERVER_URL=http://localhost:8080
VITE_API_BASE_PATH=/api

// File: env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_SERVER_URL: string
  readonly VITE_API_BASE_PATH: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// File: vite.config.ts
import { defineConfig, loadEnv, ConfigEnv, UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [vue(), vueDevTools()],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_SERVER_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
})

// File: src/api/config.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios'

const apiConfig: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_API_BASE_PATH,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
}

const api: AxiosInstance = axios.create(apiConfig)

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    // 例如：添加认证token
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    // 处理请求错误
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    return response.data
  },
  (error: AxiosError) => {
    // 对响应错误做点什么
    if (error.response && error.response.status === 401) {
      // 处理未授权访问
      // 例如，重定向到登录页面
    }
    return Promise.reject(error)
  }
)

export default api

// File: src/api/user.ts
import api from './config'

export interface User {
  id: number
  name: string
  email: string
}

export interface UserCreateDto extends Omit<User, 'id'> {}
export interface UserUpdateDto extends Partial<Omit<User, 'id'>> {}

export const UserAPI = {
  /**
   * 获取所有用户
   * @returns {Promise<User[]>} 解析为用户数组的 Promise
   */
  getUsers: () => api.get<User[]>('/users'),

  /**
   * 通过 ID 获取用户
   * @param {number} id - 用户的唯一标识符
   * @returns {Promise<User>} 解析为用户对象的 Promise
   */
  getUser: (id: number) => api.get<User>(`/users/${id}`),

  /**
   * 创建新用户
   * @param {UserCreateDto} user - 要创建的用户数据
   * @returns {Promise<User>} 解析为创建的用户对象的 Promise
   */
  createUser: (user: UserCreateDto) => api.post<User>('/users', user),

  /**
   * 更新用户信息
   * @param {number} id - 要更新的用户 ID
   * @param {UserUpdateDto} user - 要更新的用户数据
   * @returns {Promise<User>} 解析为更新后的用户对象的 Promise
   */
  updateUser: (id: number, user: UserUpdateDto) => api.put<User>(`/users/${id}`, user),

  /**
   * 删除用户
   * @param {number} id - 要删除的用户 ID
   * @returns {Promise<void>} 解析为空的 Promise
   */
  deleteUser: (id: number) => api.delete(`/users/${id}`)
}

// File: src/components/UserList.vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { UserAPI, User } from '../api/user'

const users = ref<User[]>([])

onMounted(async () => {
  try {
    users.value = await UserAPI.getUsers()
  } catch (error) {
    console.error('Failed to fetch users:', error)
  }
})
</script>

<template>
  <div>
    <h2>User List</h2>
    <ul>
      <li v-for="user in users" :key="user.id">{{ user.name }}</li>
    </ul>
  </div>
</template>
