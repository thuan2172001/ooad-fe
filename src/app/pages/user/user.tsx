import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { dangerIconStyle, DefaultPagination, HomePageURL, NormalColumn, SortColumn, successIconStyle } from '../../common-library/common-consts/const';
import { MasterHeader } from '../../common-library/common-components/master-header';
import {
  ActionsColumnFormatter,
} from '../../common-library/common-components/actions-column-formatter';
import { DeleteEntityDialog } from '../../common-library/common-components/delete-entity-dialog';
import {
  RenderInfoDetail,
  SearchModel
} from '../../common-library/common-types/common-type';
import { InitMasterProps, notifyError } from '../../common-library/helpers/common-function';
import { Route, Switch, useHistory } from 'react-router-dom';
import { UserModel } from './user.model';
import { MasterEntityDetailDialog } from "../../common-library/common-components/master-entity-detail-dialog";
import { BanUser, Count, Create, Delete, DeleteMany, Get, GetAll, UnbanUser, Update } from "./user.service";
import './style.scss'
import { MasterBody } from "../../common-library/common-components/master-body";
import { Tooltip } from '@material-ui/core';
import { BlockOutlined, CheckOutlined } from '@material-ui/icons';

const headerTitle = 'USER.MASTER.HEADER.TITLE';
const detailDialogTitle = 'USER.DETAIL_DIALOG.TITLE';
const moduleName = 'USER.MODULE_NAME';
const lockDialogTitle = 'USER.LOCK_DIALOG.TITLE';
const unlockDialogTitle = 'USER.UNLOCK_DIALOG.TITLE';
const lockBtn = 'USER.LOCK_DIALOG.LOCK_BTN';
const unlockBtn = 'COMMON.BTN_UNLOCK';
const lockConfirmMessage = 'USER.LOCK_DIALOG.CONFIRM_MESSAGE';
const lockDialogBodyTitle = 'USER.LOCK_DIALOG.BODY_TITLE';
const deleteDialogTitle = 'USER.DELETE_DIALOG.TITLE';
const deleteConfirmMessage = 'USER.DELETE_DIALOG.CONFIRM_MESSAGE';
const deleteDialogBodyTitle = 'USER.DELETE_DIALOG.BODY_TITLE'

function User() {
  const intl = useIntl();

  const history = useHistory();
  const {
    entities,
    setEntities,
    deleteEntity,
    setDeleteEntity,
    setDetailEntity,
    createEntity,
    setCreateEntity,
    selectedEntities,
    setSelectedEntities,
    detailEntity,
    showDelete,
    setShowDelete,
    showDeleteMany,
    setShowDeleteMany,
    showDetail,
    setShowDetail,
    paginationProps,
    setPaginationProps,
    filterProps,
    setFilterProps,
    total,
    loading,
    setLoading,
    error,
    add,
    update,
    get,
    deleteMany,
    deleteFn,
    getAll,
    formatLongString,
  } = InitMasterProps<any>({
    getServer: Get,
    countServer: Count,
    createServer: Create,
    deleteServer: Delete,
    deleteManyServer: DeleteMany,
    getAllServer: GetAll,
    updateServer: Update,
  });

  const [currentTab, setCurrentTab] = useState<string | undefined>('0');
  const [trigger, setTrigger] = useState<boolean>(false);
  const [lockPopup, setShowLockPopup] = useState<boolean>(false);

  useEffect(() => {
    getAll(filterProps);
  }, [paginationProps, filterProps, trigger, currentTab]);

  const columns = useMemo(() => {
    return [
      {
        dataField: 'id',
        text: `${intl.formatMessage({ id: 'USER.MASTER.TABLE.ID' })}`,
        headerClasses: 'text-center',
        classes: 'text-center',
      },
      {
        dataField: 'mail',
        text: `${intl.formatMessage({ id: 'USER.MASTER.TABLE.MAIL' })}`,
        formatter: (input: any) => <Tooltip style={{}} children={<span>{formatLongString(input, 10, 10)}</span>} title={input} />,
        headerClasses: 'text-center',
        classes: 'text-center',
      },
      {
        dataField: 'phone',
        text: `${intl.formatMessage({ id: 'USER.MASTER.TABLE.PHONE' })}`,
        headerClasses: 'text-center',
        classes: 'text-center',
      },
      {
        dataField: 'status',
        class: "btn-primary",
        text: `${intl.formatMessage({ id: 'USER.MASTER.TABLE.STATUS' })}`,
        headerClasses: 'text-center',
        classes: 'text-center',
        formatter: (input: any) => !input ? <CheckOutlined style={successIconStyle} /> : <BlockOutlined style={dangerIconStyle} />,
      },
      {
        dataField: 'action',
        text: `${intl.formatMessage({ id: 'USER.MASTER.TABLE.ACTION_COLUMN' })}`,
        formatter: ActionsColumnFormatter,
        formatExtraData: {
          intl,
          onShowDetail: (entity: UserModel) => {
            setDetailEntity(entity);
            setShowDetail(true);
          },
          onLock: (entity: any) => {
            setDeleteEntity(entity);
            setShowLockPopup(true);
          },
          onDelete: (entity: any) => {
            setDeleteEntity(entity);
            setShowDelete(true);
          },
        },
        ...NormalColumn,
        style: { minWidth: '130px' },
      }
    ]
  }, []);

  const masterEntityDetailDialog: RenderInfoDetail = useMemo((): RenderInfoDetail => [
    {
      data: {
        id: { title: 'USER.MASTER.TABLE.ID' },
        mail: { title: 'USER.MASTER.TABLE.MAIL' },
        phone: { title: 'USER.MASTER.TABLE.PHONE' },
      },
    },
  ], []);

  const searchModel: SearchModel = useMemo(() => ({
    mail: {
      type: 'string',
      label: 'USER.MASTER.SEARCH.MAIL',
      placeholder: 'USER.MASTER.SEARCH.MAIL',
    },
    phone: {
      type: 'string-number',
      label: 'USER.MASTER.SEARCH.PHONE',
      placeholder: 'USER.MASTER.SEARCH.PHONE',
    },
  }), [currentTab]);

  return (
    <Fragment>
      <Switch>
        {/* <Route path={`${HomePageURL.user}/0000000`}>
          <EntityCrudPage
            moduleName={moduleName}
            onModify={add}
            formModel={createForm}
            entity={createEntity}
            actions={actions}
            validation={validationSchema}
            homePageUrl={HomePageURL.user}
          />
        </Route> */}
        {/* <Route path={`/account/user/:code`}>
          {({ match }) => (
            <EntityCrudPage
              onModify={update}
              moduleName={moduleName}
              code={match?.params.code}
              get={GetById}
              formModel={updateForm}
              actions={actions}
              validation={validationSchema}
              homePageUrl={HomePageURL.user}
            />
          )}
        </Route> */}
        <Route path={`${HomePageURL.user}`} exact={true}>
          <MasterHeader
            title={headerTitle}
            onSearch={(value) => {
              setPaginationProps(DefaultPagination)
              setFilterProps(value)
              console.log({ value });
            }}
            searchModel={searchModel}
          />
          <div className="user-body">
            <MasterBody
              title='USER.MASTER.TABLE.TITLE'
              optionTitle={Object.keys(filterProps).length > 0 ? (total > 0 ? `${total} items founded` : "No items founded") : ""}
              selectedEntities={selectedEntities}
              entities={entities}
              total={total}
              columns={columns as any}
              loading={loading}
              paginationParams={paginationProps}
              setPaginationParams={setPaginationProps}
              isShowId={false}
            />
          </div>
        </Route>
      </Switch>
      <MasterEntityDetailDialog
        title={detailDialogTitle}
        moduleName={moduleName}
        entity={detailEntity}
        onHide={() => {
          setShowDetail(false);
        }}
        show={showDetail}
        size={'lg'}
        renderInfo={masterEntityDetailDialog} />

      <DeleteEntityDialog
        entity={deleteEntity}
        onDelete={async () => {
          try {
            const result = deleteEntity?.status ? await UnbanUser(deleteEntity) : await BanUser(deleteEntity);
            if (result.success) {
              setTrigger(!trigger);
            }
            setShowLockPopup(false);
          } catch (err: any) {
            console.log(err?.message)
            notifyError(err?.toString() ?? "Failed");
            setShowLockPopup(false);
          }
        }}
        isShow={lockPopup}
        loading={loading}
        error={error}
        onHide={() => {
          setShowLockPopup(false);
        }}
        title={deleteEntity?.status ? unlockDialogTitle : lockDialogTitle}
        confirmMessage={deleteEntity?.status ? "USER.UNLOCK_MSG" : lockConfirmMessage}
        bodyTitle={deleteEntity?.status ? "USER.UNLOCK.BODY_MSG" : lockDialogBodyTitle}
        deletingMessage={" "}
        deleteBtn={deleteEntity?.status ? unlockBtn : lockBtn}
        cancelBtn={"COMMON.BTN_CANCEL"}
      />

      <DeleteEntityDialog
        entity={deleteEntity}
        onDelete={async () => {
          const result: any = await Delete(deleteEntity);
          if (result.success) {
            setTrigger(!trigger);
          }
          setShowDelete(false);
        }}
        isShow={showDelete}
        loading={loading}
        error={error}
        onHide={() => {
          setShowDelete(false);
        }}
        title={deleteDialogTitle}
        confirmMessage={deleteConfirmMessage}
        bodyTitle={deleteDialogBodyTitle}
        deletingMessage={" "}
        deleteBtn="COMMON.BTN_DELETE"
        cancelBtn="COMMON.BTN_CANCEL"
      />
    </Fragment>
  );
}

export default User
