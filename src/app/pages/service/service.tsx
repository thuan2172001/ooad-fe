import { Fragment, useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { dangerIconStyle, DefaultPagination, HomePageURL, iconStyle, NormalColumn, successIconStyle } from '../../common-library/common-consts/const';
import { MasterHeader } from '../../common-library/common-components/master-header';
import {
  ModifyForm,
  ModifyInputGroup,
  RenderInfoDetail,
  SearchModel
} from '../../common-library/common-types/common-type';
import { InitMasterProps, notifyError } from '../../common-library/helpers/common-function';
import { Route, Switch, useHistory } from 'react-router-dom';
import { Count, Create, Delete, DeleteMany, Get, GetAll, GetById, Lock, Unlock, Update } from "./service.service";
import { MasterBody } from "../../common-library/common-components/master-body";
import { ActionsColumnFormatter } from '../../common-library/common-components/actions-column-formatter';
import { DeleteEntityDialog } from '../../common-library/common-components/delete-entity-dialog';
import { Spinner } from 'react-bootstrap';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import { NotifyDialog } from '../../common-library/common-components/notify-dialog';
import { RootStateOrAny, useSelector } from 'react-redux';
import { MasterEntityDetailDialog } from '../../common-library/common-components/master-entity-detail-dialog';
import { BlockOutlined, CheckOutlined } from '@material-ui/icons';
import EntityCrudPage from '../../common-library/common-components/entity-crud-page';

const headerTitle = 'SERVICE.MASTER.HEADER.TITLE';

function Service() {
  const intl = useIntl();

  const {
    entities,
    deleteEntity,
    setDeleteEntity,
    createEntity,
    editEntity,
    setEditEntity,
    selectedEntities,
    showDelete,
    setShowDetail,
    detailEntity,
    setDetailEntity,
    showDetail,
    setShowDelete,
    paginationProps,
    setPaginationProps,
    filterProps,
    setFilterProps,
    total,
    loading,
    error,
    add,
    update,
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

  const createTitle = 'SERVICE.MASTER.TABLE.CREATE';
  const updateTitle = 'SERVICE.MASTER.TABLE.TITLE';
  const viewTitle = 'SERVICE.MASTER.TABLE.TITLE';

  const [currentTab, setCurrentTab] = useState<string | undefined>('0');
  const [showPermissionDeny, setShowPermissionDeny] = useState<boolean>(false);
  const [trigger, setTrigger] = useState<boolean>(false);
  const [lockPopup, setShowLockPopup] = useState<boolean>(false);

  const history = useHistory();

  const userInfo = useSelector(({ auth }: { auth: RootStateOrAny }) => auth);

  useEffect(() => {
    getAll(filterProps);
  }, [paginationProps, filterProps, trigger, currentTab]);

  const columns = useMemo(() => {
    return [
      {
        dataField: 'id',
        text: `${intl.formatMessage({ id: 'SERVICE.MASTER.TABLE.ID' })}`,
        headerClasses: 'text-center',
        align: 'center',
      },
      {
        dataField: 'name',
        text: `${intl.formatMessage({ id: 'SERVICE.MASTER.TABLE.NAME' })}`,
        headerClasses: 'text-center',
        align: 'center',
      },
      {
        dataField: 'status',
        text: `${intl.formatMessage({ id: 'SERVICE.MASTER.TABLE.STATUS' })}`,
        headerClasses: 'text-center',
        align: 'center',
      },
      {
        dataField: 'action',
        text: `${intl.formatMessage({ id: 'SERVICE.MASTER.TABLE.ACTION_COLUMN' })}`,
        formatter: ActionsColumnFormatter,
        formatExtraData: {
          intl,
          onShowDetail: (entity: any) => {
            setDetailEntity(entity);
            setShowDetail(true);
            // history.push(`${window.location.pathname}/view/${entity.id}`);
          },
          onEdit: (entity: any) => {
            setEditEntity(entity);
            history.push(`${window.location.pathname}/${entity.id}`);
          },
          onDelete: (entity: any) => {
            // if (userInfo.role === "super-admin") {
            setDeleteEntity(entity);
            setShowDelete(true);
            // } else {
            //   setShowPermissionDeny(true);
            // }
          },
          // onLock: (entity: any) => {
          //   setDeleteEntity(entity);
          //   setShowLockPopup(true);
          // },
        },
        ...NormalColumn,
        style: { minWidth: '130px' },
      }
    ]
  }, []);

  const searchModel: SearchModel = useMemo(() => ({
    name: {
      type: 'string',
      label: 'SERVICE.MASTER.SEARCH.NAME',
      placeholder: 'SERVICE.MASTER.SEARCH.NAME'
    },
  }), [currentTab]);

  const [createGroup, setCreateGroup] = useState<ModifyInputGroup>({
    _subTitle: '',
    name: {
      _type: 'string',
      label: 'SERVICE.MASTER.TABLE.NAME',
    },
    image: {
      _type: "image",
      isArray: false,
      maxNumber: 1,
      label: 'SERVICE.MASTER.TABLE.LOGO',
      secondaryLabel: 'SERVICE.MASTER.TABLE.LOGO_SECONDARY_TEXT'
    },
  });

  const [editGroup, setEditGroup] = useState<ModifyInputGroup>({
    _subTitle: '',
    name: {
      _type: 'string',
      label: 'SERVICE.MASTER.TABLE.NAME',
    },
    image: {
      _type: "image",
      isArray: false,
      maxNumber: 1,
      label: 'SERVICE.MASTER.TABLE.LOGO',
      secondaryLabel: 'SERVICE.MASTER.TABLE.LOGO_SECONDARY_TEXT'
    },
  });

  const createForm = useMemo((): ModifyForm => ({
    _header: createTitle,
    panel1: {
      _title: '',
      group1: createGroup,
    },
  }), [createGroup]);

  const updateForm = useMemo((): ModifyForm => ({
    _header: updateTitle,
    panel1: {
      _title: '',
      group1: editGroup,
    },
  }), [editGroup]);

  const actions: any = useMemo(() => ({
    type: 'inside',
    data: {
      save: {
        role: 'submit',
        type: 'submit',
        linkto: undefined,
        className: 'btn btn-primary mr-8 fixed-btn-width',
        label: 'COMMON_COMPONENT.MODIFY_DIALOG.SAVE_BTN',
        icon: loading ? (<Spinner style={iconStyle} animation="border" variant="light" size="sm" />) :
          (<SaveOutlinedIcon style={iconStyle} />)
      },
      cancel: {
        role: 'link-button',
        type: 'button',
        linkto: '/request-management',
        className: 'btn btn-outline-primary fixed-btn-width',
        label: 'COMMON.BTN_CANCEL',
        icon: <CancelOutlinedIcon />,
      }
    }
  }), [loading]);

  const masterEntityDetailDialog: RenderInfoDetail = useMemo((): RenderInfoDetail => [
    {
      data: {
        id: { title: 'SERVICE.MASTER.TABLE.ID' },
        name: { title: 'SERVICE.MASTER.TABLE.NAME' },
        totalProvider: { title: 'SERVICE.MASTER.TABLE.TOTAL' },
        status: { 
          title: 'SERVICE.MASTER.TABLE.STATUS',
          formatter: (data: any) => <span>{data ? "Inactive" : "Active"}</span>,
        },
      },
      titleClassName: 'col-3'
    },
  ], []);

  const onCreate = () => {
    history.push(`${window.location.pathname}/0000000`);
  }

  return (
    <Fragment>
      <Switch>
      <Route path={`${HomePageURL.service}/0000000`}>
          <EntityCrudPage
            mode={"vertical"}
            moduleName={"MODULE.NAME"}
            onModify={add}
            formModel={createForm}
            entity={createEntity}
            actions={actions}
            homePageUrl={HomePageURL.service}
          />
        </Route>
        <Route path={`${HomePageURL.service}/:code`}>
          {({ match }) => (
            <EntityCrudPage
              mode={"vertical"}
              onModify={update}
              entity={editEntity}
              setEditEntity={setEditEntity}
              moduleName={"MODULE.NAME"}
              get={GetById}
              formModel={updateForm}
              actions={actions}
              homePageUrl={HomePageURL.service}
            />
          )}
        </Route>

        <Route path={`${HomePageURL.service}`} exact={true}>
          <MasterHeader
            title={headerTitle}
            onSearch={(value) => {
              setPaginationProps(DefaultPagination)
              let filterProps = {};
              if (value.role) {
                filterProps = { ...value, role: value.role.value }
              } else {
                filterProps = value;
              }
              setFilterProps(filterProps);
            }}
            searchModel={searchModel}
          />
          <div className="activity-body">
            <MasterBody
              title='SERVICE.MASTER.TABLE.TITLE'
              selectedEntities={selectedEntities}
              onCreate={onCreate}
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
        title={viewTitle}
        show={showDetail}
        entity={detailEntity}
        renderInfo={masterEntityDetailDialog}
        size="lg"
        onHide={() => {
          setShowDetail(false);
        }}
      />

      <DeleteEntityDialog
        entity={deleteEntity}
        onDelete={deleteFn}
        isShow={showDelete}
        loading={loading}
        error={error}
        onHide={() => {
          setShowDelete(false);
        }}
        title={"SERVICE.DELETE.TITLE"}
        confirmMessage={"SERVICE.DELETE_MSG"}
        bodyTitle={"SERVICE.DELETE.BODY_MSG"}
        deletingMessage={" "}
        deleteBtn={"COMMON.BTN_DELETE"}
        cancelBtn={"COMMON.BTN_CANCEL"}
      />

      <DeleteEntityDialog
        entity={deleteEntity}
        onDelete={async () => {
          try {
            const result = deleteEntity?.status ? await Unlock(deleteEntity) : await Lock(deleteEntity);
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
        title={deleteEntity?.status ? "SERVICE.UNLOCK.TITLE" : "SERVICE.LOCK.TITLE"}
        confirmMessage={deleteEntity?.status ? "SERVICE.UNLOCK_MSG" : "SERVICE.LOCK_MSG"}
        bodyTitle={deleteEntity?.status ? "SERVICE.UNLOCK.BODY_MSG" : "SERVICE.LOCK.BODY_MSG"}
        deletingMessage={" "}
        deleteBtn={deleteEntity?.status ? "COMMON.BTN_UNLOCK" : "COMMON.BTN_LOCK"}
        cancelBtn={"COMMON.BTN_CANCEL"}
      />

      <NotifyDialog
        title={"COMMON.AUTH.NOT_HAVE_PERMISSION.TITLE"}
        notifyMessage={" "} isShow={showPermissionDeny}
        onHide={() => setShowPermissionDeny(false)}
      />
    </Fragment>
  );
}

export default Service
