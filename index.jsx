import React from 'react';
import PropTypes from 'prop-types';

import translate from '../../../../utils/translate';
import PageHeader from '../../../../components/PageHeader';
import Table from '../../../../components/Table';
import { useUsers } from './hooks';
import { getUserColumns } from '../../../../helpers/tableData';
import UsersTableHeader from './components/UsersTableHeader';
import UsersSearchModal from './components/UsersSearchModal';
import UsersFilterModal from './components/UsersFilterModal';

const columns = getUserColumns(true);

const Main = ({ location }) => {
  const { data: { users } } = useUsers(location);

  return (
    <div className="page-inner pd-t-25 pd-b-25">
      <PageHeader title={translate('Users')} />
      <div className="row">
        <div className="col-md-12">
          <Table
            caption={translate('All users')}
            header={<UsersTableHeader />}
            columns={columns}
            data={users}
          />
        </div>
      </div>

      <UsersSearchModal location={location} />
      <UsersFilterModal location={location} />
    </div>
  );
};

Main.propTypes = {
  location: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default Main;
