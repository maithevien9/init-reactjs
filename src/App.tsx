import { Loading } from '@enouvo/react-uikit';
import { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import routes from '~react-pages';

dayjs.extend(utc);

export default function App() {
  return <Suspense fallback={<Loading />}>{useRoutes(routes)}</Suspense>;
}
