import axios from 'axios';
import { API_BASE_URL } from '../../common-library/common-consts/enviroment';
import {
  CountProps,
  CreateProps,
  DeleteManyProps,
  DeleteProps,
  GetAllPropsServer,
  GetProps,
  UpdateProps,
} from '../../common-library/common-types/common-type';
import { formatParamsGet, removeValueFromObject } from '../../common-library/helpers/axios-slice';
import { handleUploadImage } from '../group/group.service';

export const API_URL = API_BASE_URL + `/admin/promote-management`;

export const Create: CreateProps<any> = async (data: any) => {
  let payload = { ...data };
  if (payload?.bannerUrl) {
    payload.bannerUrl = data.bannerUrl.file ? await handleUploadImage([data.bannerUrl.file]) : data.bannerUrl;
  }
  if (payload?.service_ids) {
    payload.categoryIds = data.service_ids;
    payload.service_ids = null;
    payload = removeValueFromObject(payload, null);
  }
  return axios.post(`${API_URL}`, payload);
};

export const GetAll: GetAllPropsServer<any> = ({
  queryProps,
  sortList,
  paginationProps,
}) => {
  return axios.get(`${API_URL}`, {
    params: formatParamsGet(queryProps, sortList, paginationProps),
  });
};

export const GetById = (_id: string) => {
  return new Promise((resolve, reject) => {
    axios.get(`${API_URL}/${_id}`).then(data => {
      resolve({ data: data?.data?.business || {} });
    }).catch(() => {
      reject(null)
    });
  })
};

export const Get: GetProps<any> = (entity) => {
  return axios.get(`${API_URL}/${entity.id}`);
};

export const Update: UpdateProps<any> = async (entity: any) => {
  let payload = { ...entity };
  if (payload?.bannerUrl) {
    payload.bannerUrl = payload.bannerUrl.file ? await handleUploadImage([payload.bannerUrl.file]) : payload.bannerUrl;
  }
  if (payload?.serviceInfo) {
    payload.categoryIds = payload.serviceInfo;
    payload.serviceInfo = null;
    payload = removeValueFromObject(payload, null);
  }
  payload.categoryIds = payload.categoryIds.map((item: any) => item?.serviceId ?? item);
  return axios.put(`${API_URL}/${entity.id ?? entity.code}`, payload);
};

export const Lock: any = (entity: any) => {
  return axios.post(`${API_URL}/${entity.id}/ban`, { "data": { id: entity.id } });
};

export const Unlock: any = (entity: any) => {
  return axios.post(`${API_URL}/${entity.id}/unban`, { "data": { id: entity.id } });
};

export const Delete: DeleteProps<any> = (entity: any) => {
  return axios.post(`${API_URL}/${entity.id}/delete`, { id: entity.id  });
};

export const Count: CountProps<any> = (queryProps) => {
  return axios.get(`${API_URL}/get/count`, {
    params: { ...queryProps },
  });
};

export const DeleteMany: DeleteManyProps<any> = (entities: any[]) => {
  return axios.delete(API_URL, {
    data: { data: entities },
  });
};
