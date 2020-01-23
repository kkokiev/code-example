import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { useHistory } from 'react-router-dom';
import qs from 'qs';
import _isEmpty from 'lodash/isEmpty';

import { USERS_SEARCH_MODAL, USERS_FILTER_MODAL } from '../../../../constants/modals';
import createLoadingSelector from '../../../../selectors/loadingSelector';
import useModal from '../../../../utils/useModal';
import { getDeviceCampaigns } from '../../../campaigns/services/actions';
import CAMPAIGNS from '../../../campaigns/services/types';
import USERS from '../../services/types';
import { getUsers, getLocations } from '../../services/actions';
import translate from '../../../../utils/translate';
import { applyParams } from './helpers';

const selector = createSelector(
  (state) => state.users.users,
  (users) => ({
    users,
  }),
);

export const useUsers = (location) => {
  const dispatch = useDispatch();

  const openPage = useCallback(() => {
    const params = qs.parse(location.search, { ignoreQueryPrefix: true });

    if (_isEmpty(params)) {
      dispatch(getUsers());
    } else {
      dispatch(getUsers(params));
    }
  }, [dispatch, location]);

  useEffect(() => {
    openPage();
  }, [openPage]);

  return {
    data: useSelector(selector),
  };
};

export const useUsersSearch = (location) => {
  const { showModal, hideModal } = useModal(USERS_SEARCH_MODAL);
  const history = useHistory();

  const hanleSearchSubmit = useCallback(
    (values) => applyParams(hideModal, values, location, history), [hideModal, history, location],
  );

  return {
    actions: {
      showSearchModal: showModal,
      hideSearchModal: hideModal,
      hanleSearchSubmit,
    },
  };
};

const usersFilterSelector = createSelector(
  createLoadingSelector(CAMPAIGNS.READ_LIST.base),
  createLoadingSelector(USERS.READ_LOCATIONS_LIST.base),
  (state) => state.campaigns.list,
  (state) => state.users.locations,
  (isLoadingCampaigns, isLoadingLocations, campaigns = [], locations = []) => ({
    isLoadingCampaigns,
    isLoadingLocations,
    campaigns: [
      { value: '', label: translate('Campaign') },
      ...campaigns.map(({ id, name }) => ({ value: id, label: name })),
    ],
    locations: [
      { value: '', label: translate('Location') },
      ...locations.map((loc) => ({ value: loc, label: loc })),
    ],
  }),
);

export const useUsersFilter = (location) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { showModal, hideModal } = useModal(USERS_FILTER_MODAL);

  const openPage = useCallback(() => {
    dispatch(getDeviceCampaigns());
    dispatch(getLocations());
  }, [dispatch]);

  useEffect(() => {
    openPage();
  }, [openPage]);

  const hanleFilterSubmit = useCallback(
    (values) => applyParams(hideModal, values, location, history), [hideModal, history, location],
  );

  return {
    actions: {
      showFilterModal: showModal,
      hideFilterModal: hideModal,
      hanleFilterSubmit,
    },
    data: useSelector(usersFilterSelector),
  };
};
