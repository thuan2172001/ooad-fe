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
import { Count, Create, Delete, DeleteMany, Get, GetAll, GetById, Lock, Unlock, Update } from "./provider.service";
import { MasterBody } from "../../common-library/common-components/master-body";
import { Tooltip } from '@material-ui/core';
import { ActionsColumnFormatter } from '../../common-library/common-components/actions-column-formatter';
import { DeleteEntityDialog } from '../../common-library/common-components/delete-entity-dialog';
import EntityCrudPage from '../../common-library/common-components/entity-crud-page';
import { Spinner } from 'react-bootstrap';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import { NotifyDialog } from '../../common-library/common-components/notify-dialog';
import { RootStateOrAny, useSelector } from 'react-redux';
import { MasterEntityDetailDialog } from '../../common-library/common-components/master-entity-detail-dialog';
import { BlockOutlined, CheckOutlined, Router } from '@material-ui/icons';
import { CDN } from '../../../utils/cdn';

const headerTitle = 'PROVIDER.MASTER.HEADER.TITLE';

function Provider() {
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

  const createTitle = 'PROVIDER.MASTER.TABLE.CREATE';
  const updateTitle = 'PROVIDER.MASTER.TABLE.TITLE';
  const viewTitle = 'PROVIDER.MASTER.TABLE.TITLE';

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
        text: `${intl.formatMessage({ id: 'PROVIDER.MASTER.TABLE.ID' })}`,
        headerClasses: 'text-center',
        align: 'center',
      },
      {
        dataField: 'name',
        text: `${intl.formatMessage({ id: 'PROVIDER.MASTER.TABLE.NAME' })}`,
        headerClasses: 'text-center',
        align: 'center',
      },
      {
        dataField: 'chip_id',
        text: `${intl.formatMessage({ id: 'PROVIDER.MASTER.TABLE.CHIP_ID' })}`,
        headerClasses: 'text-center',
        align: 'center',
      },
      {
        dataField: 'brand',
        text: `${intl.formatMessage({ id: 'PROVIDER.MASTER.TABLE.BRAND' })}`,
        headerClasses: 'text-center',
        align: 'center',
      },
      {
        dataField: 'owner',
        text: `${intl.formatMessage({ id: 'PROVIDER.MASTER.TABLE.OWNER' })}`,
        headerClasses: 'text-center',
        align: 'center',
        formatter: (input: any) => <div>{input ?? "Chưa có"}</div>,
      },
      {
        dataField: 'status',
        class: "btn-primary",
        text: `${intl.formatMessage({ id: 'PROVIDER.MASTER.TABLE.STATUS' })}`,
        headerClasses: 'text-center',
        classes: 'text-center',
        formatter: (input: any) => <div>{intl.formatMessage({ id: `PROVIDER.MASTER.STATUS.${input.toString().toUpperCase()}` })}</div>,
      },
      {
        dataField: 'produce_at',
        class: "btn-primary",
        text: `${intl.formatMessage({ id: 'PROVIDER.MASTER.TABLE.CREATED_AT' })}`,
        headerClasses: 'text-center',
        classes: 'text-center',
        formatter: (input: any) => <div>{new Date(input).toLocaleString()}</div>,
      },
      {
        dataField: 'last_maintain',
        class: "btn-primary",
        text: `${intl.formatMessage({ id: 'PROVIDER.MASTER.TABLE.LAST_MAINTAIN' })}`,
        headerClasses: 'text-center',
        classes: 'text-center',
        formatter: (input: any) => <div>{new Date(input).toLocaleString()}</div>,
      },
      {
        dataField: 'vehicle_type',
        class: "btn-primary",
        text: `${intl.formatMessage({ id: 'PROVIDER.MASTER.TABLE.VEHICLE_TYPE' })}`,
        headerClasses: 'text-center',
        classes: 'text-center',
        formatter: (input: any) => <div>{input}</div>,
      },
      {
        dataField: 'action',
        text: `${intl.formatMessage({ id: 'PROVIDER.MASTER.TABLE.ACTION_COLUMN' })}`,
        formatter: ActionsColumnFormatter,
        formatExtraData: {
          intl,
          onShowDetail: (entity: any) => {
            setDetailEntity(entity);
            setShowDetail(true);
          },
          onEdit: (entity: any) => {
            setEditEntity(entity);
            history.push(`${window.location.pathname}/edit/${entity.id}`);
          },
        },
        ...NormalColumn,
        style: { minWidth: '130px' },
      }
    ]
  }, []);

  const searchModel: SearchModel = useMemo(() => ({
    id: {
      type: 'string',
      label: 'PROVIDER.MASTER.TABLE.ID',
      placeholder: 'PROVIDER.MASTER.TABLE.ID'
    },
    vehicle_type: {
      type: 'string',
      label: 'PROVIDER.MASTER.TABLE.VEHICLE_TYPE',
      placeholder: 'PROVIDER.MASTER.TABLE.VEHICLE_TYPE'
    },
    brand: {
      type: 'string',
      label: 'PROVIDER.MASTER.TABLE.BRAND',
      placeholder: 'PROVIDER.MASTER.TABLE.BRAND'
    },
  }), [currentTab]);

  const [createGroup, setCreateGroup] = useState<ModifyInputGroup>({
    _subTitle: '',
    id: {
      _type: 'string',
      label: 'PROVIDER.MASTER.TABLE.ID',
      required: true,
    },
    name: {
      _type: 'string',
      label: 'PROVIDER.MASTER.TABLE.NAME',
      required: true,
    },
    brand: {
      _type: 'string',
      label: 'PROVIDER.MASTER.TABLE.BRAND',
      required: true,
    },
    vehicle_type: {
      _type: 'string',
      label: 'PROVIDER.MASTER.TABLE.VEHICLE_TYPE',
      required: true,
    },
    image: {
      _type: 'image',
      label: 'PROVIDER.MASTER.TABLE.IMAGE',
      required: true,
    },
  });

  const [editGroup, setEditGroup] = useState<ModifyInputGroup>({
    _subTitle: '',
    id: {
      _type: 'string',
      label: 'PROVIDER.MASTER.TABLE.ID',
      required: true,
    },
    name: {
      _type: 'string',
      label: 'PROVIDER.MASTER.TABLE.NAME',
      required: true,
    },
    brand: {
      _type: 'string',
      label: 'PROVIDER.MASTER.TABLE.BRAND',
      required: true,
    },
    vehicle_type: {
      _type: 'string',
      label: 'PROVIDER.MASTER.TABLE.VEHICLE_TYPE',
      required: true,
    },
    image: {
      _type: 'image',
      label: 'PROVIDER.MASTER.TABLE.IMAGE',
      required: true,
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
        linkto: '/vehicle-management',
        className: 'btn btn-outline-primary fixed-btn-width',
        label: 'COMMON.BTN_CANCEL',
        icon: <CancelOutlinedIcon />,
      }
    }
  }), [loading]);

  const masterEntityDetailDialog: RenderInfoDetail = useMemo((): RenderInfoDetail => [
    {
      data: {
        id: { title: 'PROVIDER.MASTER.TABLE.ID' },
        name: { title: 'PROVIDER.MASTER.TABLE.NAME' },
        brand: { title: 'PROVIDER.MASTER.TABLE.BRAND' },
        status: {
          title: 'PROVIDER.MASTER.TABLE.STATUS',
          formatter: (input: any) => <div>{
            intl.formatMessage({ id: `PROVIDER.MASTER.STATUS.${input.toString().toUpperCase()}` })
          }</div>,
        },
        image: {
          title: 'PROVIDER.MASTER.TABLE.IMAGE',
          formatter: (input: any) => <div>{input ? <img src={input} style={{ width: "320px" }} alt="anh" /> : <></>}</div>,
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
        <Route path={`${HomePageURL.provider}/0000000`}>
          <EntityCrudPage
            mode={"vertical"}
            moduleName={"MODULE.NAME"}
            onModify={add}
            formModel={createForm}
            entity={createEntity}
            actions={actions}
            homePageUrl={HomePageURL.provider}
          />
        </Route>
        <Route path={`${HomePageURL.provider}/edit/:code`}>
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
              homePageUrl={HomePageURL.provider}
            />
          )}
        </Route>
        <Route path={`${HomePageURL.provider}`} exact={true}>
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
              title='PROVIDER.MASTER.TABLE.TITLE'
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

      <NotifyDialog
        title={"COMMON.AUTH.NOT_HAVE_PERMISSION.TITLE"}
        notifyMessage={" "} isShow={showPermissionDeny}
        onHide={() => setShowPermissionDeny(false)}
      />
    </Fragment>
  );
}

export default Provider
