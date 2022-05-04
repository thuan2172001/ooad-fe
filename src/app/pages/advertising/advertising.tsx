import { GetAll as ServiceGetAll } from '../service/service.service';
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
import { Count, Create, Delete, DeleteMany, Get, GetAll, GetById, Lock, Unlock, Update } from "./advertising.service";
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
import { CDN } from '../../../utils/cdn';

const headerTitle = 'ADVERTISING.MASTER.HEADER.TITLE';

function Advertising() {
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

  const createTitle = 'ADVERTISING.MASTER.TABLE.CREATE';
  const updateTitle = 'ADVERTISING.MASTER.TABLE.TITLE';
  const viewTitle = 'ADVERTISING.MASTER.TABLE.TITLE';

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
        text: `${intl.formatMessage({ id: 'ADVERTISING.MASTER.TABLE.ID' })}`,
        headerClasses: 'text-center',
        align: 'center',
      },
      {
        dataField: 'name',
        text: `${intl.formatMessage({ id: 'ADVERTISING.MASTER.TABLE.NAME' })}`,
        headerClasses: 'text-center',
        align: 'center',
      },
      {
        dataField: 'price',
        text: `${intl.formatMessage({ id: 'ADVERTISING.MASTER.TABLE.PRICE' })}`,
        headerClasses: 'text-center',
        align: 'center',
      },
      {
        dataField: 'serviceInfo',
        text: `${intl.formatMessage({ id: 'GROUP.MASTER.TABLE.SERVICE' })}`,
        headerClasses: 'text-center',
        align: 'center',
        formatter: (value: any) => <div>{value?.map((item: any) => item.serviceName).join(", ")}</div>,
      },
      {
        dataField: 'action',
        text: `${intl.formatMessage({ id: 'ADVERTISING.MASTER.TABLE.ACTION_COLUMN' })}`,
        formatter: ActionsColumnFormatter,
        formatExtraData: {
          intl,
          onShowDetail: (entity: any) => {
            setDetailEntity(entity);
            setShowDetail(true);
            // history.push(`${window.location.pathname}/view/${entity.id}`);
          },
          onDelete: (entity: any) => {
            // if (userInfo.role === "super-admin") {
            setDeleteEntity(entity);
            setShowDelete(true);
            // } else {
            //   setShowPermissionDeny(true);
            // }
          },
          onEdit: (entity: any) => {
            setEditEntity(entity);
            history.push(`${window.location.pathname}/${entity.id}`);
          },
        },
        ...NormalColumn,
        style: { minWidth: '130px' },
      }
    ]
  }, []);

  const searchModel: SearchModel = useMemo(() => ({
    serviceName: {
      type: 'string',
      label: 'ADVERTISING.MASTER.SEARCH.SERVICE',
      placeholder: 'ADVERTISING.MASTER.SEARCH.SERVICE'
    },
  }), [currentTab]);

  const [createGroup, setCreateGroup] = useState<ModifyInputGroup>({
    _subTitle: '',
    bannerUrl: {
      _type: "image",
      isArray: false,
      maxNumber: 1,
      label: 'ADVERTISING.MASTER.TABLE.BANNER',
    },
    name: {
      _type: 'string',
      label: 'ADVERTISING.MASTER.TABLE.NAME',
      required: true,
    },
    price: {
      _type: 'number',
      label: 'ADVERTISING.MASTER.TABLE.PRICE',
      required: true,
    },
    description: {
      _type: 'string',
      rows: 3,
      label: 'ADVERTISING.MASTER.TABLE.DESCRIPTION',
      required: true,
    },
    service_ids: {
      _type: 'tag',
      label: 'ADVERTISING.MASTER.TABLE.SERVICE',
      onSearch: ServiceGetAll,
      queryProps: { query: "1" },
      fieldName: 'name',
      required: true,
    },
  });

  const [editGroup, setEditGroup] = useState<ModifyInputGroup>({
    _subTitle: '',
    bannerUrl: {
      _type: "image",
      isArray: false,
      maxNumber: 1,
      label: 'ADVERTISING.MASTER.TABLE.BANNER',
    },
    name: {
      _type: 'string',
      label: 'ADVERTISING.MASTER.TABLE.NAME',
    },
    price: {
      _type: 'number',
      label: 'ADVERTISING.MASTER.TABLE.PRICE',
      required: true,
    },
    description: {
      _type: 'string',
      rows: 3,
      label: 'ADVERTISING.MASTER.TABLE.DESCRIPTION',
      required: true,
    },
    serviceInfo: {
      required: true,
      _type: 'tag',
      label: 'ADVERTISING.MASTER.TABLE.SERVICE',
      onSearch: ServiceGetAll,
      queryProps: { query: 1 },
      fieldName: 'name',
      secondaryField: 'serviceName',
      secondaryId: 'serviceId'
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
        linkto: '/advertising-management',
        className: 'btn btn-outline-primary fixed-btn-width',
        label: 'COMMON.BTN_CANCEL',
        icon: <CancelOutlinedIcon />,
      }
    }
  }), [loading]);

  const masterEntityDetailDialog: RenderInfoDetail = useMemo((): RenderInfoDetail => [
    {
      data: {
        id: { title: 'ADVERTISING.MASTER.TABLE.ID' },
        name: { title: 'ADVERTISING.MASTER.TABLE.NAME' },
        price: { title: 'ADVERTISING.MASTER.TABLE.PRICE' },
        serviceInfo: {
          title: 'ADVERTISING.MASTER.TABLE.SERVICE',
          formatter: (value: any) => <div>{value?.map((item: any) => item.serviceName).join(", ")}</div>,
        },
        bannerUrl: {
          title: 'ADVERTISING.MASTER.TABLE.BANNER',
          formatter: (data: any) => <img src={CDN(data)} alt="banner"
            style={{
              maxWidth: "200px"
            }}
          />,
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
        <Route path={`${HomePageURL.advertising}/0000000`}>
          <EntityCrudPage
            mode={"vertical"}
            moduleName={"MODULE.NAME"}
            onModify={add}
            formModel={createForm}
            entity={createEntity}
            actions={actions}
            homePageUrl={HomePageURL.advertising}
          />
        </Route>
        <Route path={`${HomePageURL.advertising}/:code`}>
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
              homePageUrl={HomePageURL.advertising}
            />
          )}
        </Route>
        <Route path={`${HomePageURL.advertising}`} exact={true}>
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
              title='ADVERTISING.MASTER.TABLE.TITLE'
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
        title={"ADVERTISING.DELETE.TITLE"}
        confirmMessage={"ADVERTISING.DELETE_MSG"}
        bodyTitle={"ADVERTISING.DELETE.BODY_MSG"}
        deletingMessage={" "}
        deleteBtn={"COMMON.BTN_DELETE"}
        cancelBtn={"COMMON.BTN_CANCEL"}
      />
    </Fragment>
  );
}

export default Advertising
