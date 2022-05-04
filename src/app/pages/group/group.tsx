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
import { Count, Create, Delete, DeleteMany, Get, GetAll, GetById, Lock, Unlock, Update } from "./group.service";
import { MasterBody } from "../../common-library/common-components/master-body";
import { ActionsColumnFormatter } from '../../common-library/common-components/actions-column-formatter';
import { DeleteEntityDialog } from '../../common-library/common-components/delete-entity-dialog';
import { Spinner } from 'react-bootstrap';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import { NotifyDialog } from '../../common-library/common-components/notify-dialog';
import { RootStateOrAny, useSelector } from 'react-redux';
import { MasterEntityDetailDialog } from '../../common-library/common-components/master-entity-detail-dialog';
import EntityCrudPage from '../../common-library/common-components/entity-crud-page';
import { GetAll as ServiceGetAll } from '../service/service.service';

const headerTitle = 'GROUP.MASTER.HEADER.TITLE';

function Group() {
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

  const createTitle = 'GROUP.MASTER.TABLE.CREATE';
  const updateTitle = 'GROUP.MASTER.TABLE.TITLE';
  const viewTitle = 'GROUP.MASTER.TABLE.TITLE';

  const [currentTab, setCurrentTab] = useState<string | undefined>('0');
  const [trigger, setTrigger] = useState<boolean>(false);
  const history = useHistory();

  useEffect(() => {
    getAll(filterProps);
  }, [paginationProps, filterProps, trigger, currentTab]);

  const columns = useMemo(() => {
    return [
      {
        dataField: 'id',
        text: `${intl.formatMessage({ id: 'GROUP.MASTER.TABLE.ID' })}`,
        headerClasses: 'text-center',
        align: 'center',
      },
      {
        dataField: 'name',
        text: `${intl.formatMessage({ id: 'GROUP.MASTER.TABLE.NAME' })}`,
        headerClasses: 'text-center',
        align: 'center',
      },
      {
        dataField: 'fee',
        text: `${intl.formatMessage({ id: 'GROUP.MASTER.TABLE.FEE' })}`,
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
        text: `${intl.formatMessage({ id: 'GROUP.MASTER.TABLE.ACTION_COLUMN' })}`,
        formatter: ActionsColumnFormatter,
        formatExtraData: {
          intl,
          onShowDetail: (entity: any) => {
            setDetailEntity(entity);
            setShowDetail(true);
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
    categoryId: {
      type: 'search-select',
      keyField: 'name',
      selectField: 'id',
      onChange: (e, { setFieldValue }) => {
        return e.id;
      },
      onSearch: ServiceGetAll,
      label: 'GROUP.MASTER.SEARCH.SERVICE',
      placeholder: 'GROUP.MASTER.SEARCH.SERVICE'
    },
  }), [currentTab]);

  const [createGroup, setCreateGroup] = useState<ModifyInputGroup>({
    _subTitle: '',
    name: {
      _type: 'string',
      required: true,
      label: 'GROUP.MASTER.TABLE.NAME',
    },
    fee: {
      _type: 'number',
      required: true,
      label: 'GROUP.MASTER.TABLE.FEE',
    },
    service_ids: {
      _type: 'tag',
      required: true,
      label: 'GROUP.MASTER.TABLE.SERVICE',
      onSearch: ServiceGetAll,
      queryProps: { query: "2" },
      fieldName: 'name',
    }
  });

  const [editGroup, setEditGroup] = useState<ModifyInputGroup>({
    _subTitle: '',
    name: {
      _type: 'string',
      required: true,
      label: 'GROUP.MASTER.TABLE.NAME',
    },
    fee: {
      _type: 'number',
      required: true,
      label: 'GROUP.MASTER.TABLE.FEE',
    },
    serviceInfo: {
      _type: 'tag',
      required: true,
      label: 'GROUP.MASTER.TABLE.SERVICE',
      onSearch: ServiceGetAll,
      fieldName: 'name'
    }
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
        linkto: '/group-management',
        className: 'btn btn-outline-primary fixed-btn-width',
        label: 'COMMON.BTN_CANCEL',
        icon: <CancelOutlinedIcon />,
      }
    }
  }), [loading]);

  const masterEntityDetailDialog: RenderInfoDetail = useMemo((): RenderInfoDetail => [
    {
      data: {
        id: { title: 'GROUP.MASTER.TABLE.ID' },
        name: { title: 'GROUP.MASTER.TABLE.NAME' },
        fee: { title: 'GROUP.MASTER.TABLE.FEE' },
        serviceInfo: {
          title: 'GROUP.MASTER.TABLE.SERVICE',
          formatter: (value: any) => <div>{value?.map((item: any) => item.serviceName).join(", ")}</div>,
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
        <Route path={`${HomePageURL.group}/0000000`}>
          <EntityCrudPage
            mode={"vertical"}
            moduleName={"MODULE.NAME"}
            onModify={add}
            formModel={createForm}
            entity={createEntity}
            actions={actions}
            homePageUrl={HomePageURL.group}
          />
        </Route>
        <Route path={`${HomePageURL.group}/:code`}>
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
              homePageUrl={HomePageURL.group}
            />
          )}
        </Route>

        <Route path={`${HomePageURL.group}`} exact={true}>
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
              title='GROUP.MASTER.TABLE.TITLE'
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

      {/* <DeleteEntityDialog
        entity={deleteEntity}
        onDelete={deleteFn}
        isShow={showDelete}
        loading={loading}
        error={error}
        onHide={() => {
          setShowDelete(false);
        }}
        title={"GROUP.DELETE.TITLE"}
        confirmMessage={"GROUP.DELETE_MSG"}
        bodyTitle={"GROUP.DELETE.BODY_MSG"}
        deletingMessage={" "}
        deleteBtn={"COMMON.BTN_DELETE"}
        cancelBtn={"COMMON.BTN_CANCEL"}
      /> */}

    </Fragment>
  );
}

export default Group
