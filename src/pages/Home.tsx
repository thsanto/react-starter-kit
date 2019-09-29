import React from 'react';
import { useTranslation } from 'react-i18next';
import Meta from 'components/shared/Meta';

const Home = () => {
  const [t] = useTranslation('page__home');

  return (
    <>
      <Meta title={t('pageTitle')} description={t('pageDescription')} />
      Home Page
    </>
  );
};

export default Home;
