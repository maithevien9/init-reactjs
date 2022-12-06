import path from 'path';
import fs from 'fs';
import { loadEnv } from 'vite';
import vitePluginImp from 'vite-plugin-imp';
import { visualizer } from 'rollup-plugin-visualizer';
import lessToJS from 'less-vars-to-js';
import viteSentry from 'vite-plugin-sentry';
import viteAntdDayjs from 'vite-plugin-antd-dayjs';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import pages from 'vite-plugin-pages';
import { defineConfig } from 'vitest/config';

const themeVariables = lessToJS(
  fs.readFileSync(
    path.resolve(__dirname, './src/configs/theme/index.less'),
    'utf8',
  ),
);

function htmlPlugin(env: Record<string, string | undefined>) {
  return {
    name: 'html-transform',
    transformIndexHtml: {
      enforce: 'pre',
      transform: (html: string) => {
        return html.replace(/<%=(.*?)%>/g, (match, p1) => env[p1] ?? match);
      },
    },
  };
}

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  return defineConfig({
    server: {
      port: 3000,
    },
    plugins: [
      htmlPlugin(process.env),
      svgr(),
      react(),
      pages({
        routeStyle: 'next',
        dirs: 'src/pages',
      }),
      viteAntdDayjs(),
      viteSentry({
        url: process.env.SENTRY_URL,
        authToken: process.env.SENTRY_AUTH_TOKEN,
        org: process.env.SENTRY_ORG,
        project: process.env.SENTRY_PROJECT,
        release: '1.0',
        deploy: {
          env: 'staging',
        },
        setCommits: {
          auto: true,
        },
        sourceMaps: {
          include: ['./build/assets'],
          ignore: ['node_modules'],
          urlPrefix: '~/assets',
        },
      }),
      vitePluginImp({
        optimize: true,
        libList: [
          {
            libName: 'antd',
            style: name => {
              if (name === 'col' || name === 'row') {
                return 'antd/lib/style/index.less';
              }
              return `antd/es/${name}/style/index.less`;
            },
          },
        ],
      }),
    ],
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          modifyVars: themeVariables,
        },
      },
    },
    resolve: {
      alias: [
        {
          find: /^#/,
          replacement: path.resolve(__dirname, 'src'),
        },
        { find: /^~antd/, replacement: 'antd' },
      ],
    },
    optimizeDeps: {
      include: ['@ant-design/icons'],
    },
    build: {
      sourcemap: false,
      outDir: 'build',
      rollupOptions: {
        plugins: [visualizer()],
      },
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./vitest.setup.ts'],
    },
  });
};
