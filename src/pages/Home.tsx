import React from 'react';
import Helmet from 'react-helmet';
import { useTranslation } from 'react-i18next';

type Props = {};

const Home = (props: Props) => {
  const [t] = useTranslation('page____home');

  return (
    <>
      <Helmet>
        <title>{t('pageTitle')}</title>
        <meta name="description" content={t('pageDescription')} />
      </Helmet>
      Home Page
    </>
  );
};

export default Home;
