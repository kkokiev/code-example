import _pickBy from 'lodash/pickBy';
import _identity from 'lodash/identity';
import qs from 'qs';

import { formatDateNoUtc } from '../../../../utils/dates';

export const removeEmptyParams = (params) => _pickBy(params, _identity);

export const formatParams = (values, dateFormat = 'YYYY-MM-DD') => {
  const date_from = values.date_from ? formatDateNoUtc(values.date_from, dateFormat) : '';
  const date_to = values.date_to ? formatDateNoUtc(values.date_to, dateFormat) : '';

  return {
    ...values,
    date_from,
    date_to,
  };
};

export const setParams = (params) => {
  const searchParams = new URLSearchParams();

  const keys = Object.keys(removeEmptyParams(params));
  keys.map((key) => {
    searchParams.set(key, params[key]);
    return null;
  });

  return searchParams.toString();
};

export const applyParams = (hideModal, values, location, history) => {
  hideModal();

  const currentParams = qs.parse(location.search, { ignoreQueryPrefix: true });

  const params = formatParams(values);
  const url = setParams({ ...currentParams, ...params });
  history.push(`?${url}`);
};
