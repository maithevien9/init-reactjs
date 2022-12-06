import '#/configs/theme/index.less';
import { ConfigProvider, getPopupContainer } from '@enouvo/react-uikit';
import enUS from 'antd/es/locale/en_US';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './configs';

createRoot(document.getElementById('root')!).render(
  <ConfigProvider
    componentSize="large"
    getPopupContainer={getPopupContainer}
    locale={enUS}
  >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ConfigProvider>,
);
