/* eslint-disable @typescript-eslint/camelcase */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    component__shared__meta: require('locales/en/components/shared/meta.json'),
    component__shared__header: require('locales/en/components/shared/header.json'),
    component__shared__sidebar: require('locales/en/components/shared/sidebar.json'),
    page__home: require('locales/en/pages/home.json'),
    page__not_found: require('locales/en/pages/not-found.json')
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    keySeparator: '.', // we do not use keys in form messages.welcome
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
