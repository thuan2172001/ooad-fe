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
import { formatParamsGet } from '../../common-library/helpers/axios-slice';

export const API_URL = API_BASE_URL + `/agent/vehicles`;
export const API_NORM_URL = API_BASE_URL + `/vehicles`;

export const Create: CreateProps<any> = (data: any) => {
  return axios.post(`${API_URL}`, data);
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
    axios.get(`${API_NORM_URL}/${_id}`).then(data => {
      resolve({ data: data?.data?.business || {} });
    }).catch(() => {
      reject(null)
    });
  })
};

export const Get: GetProps<any> = (entity) => {
  return axios.get(`${API_NORM_URL}/${entity.id}`);
};

export const Update: UpdateProps<any> = (entity: any) => {
  return axios.put(`${API_URL}/${entity.id ?? entity.code}`, entity);
};

export const Lock: any = (entity: any) => {
  return axios.post(`${API_URL}/${entity.id}/ban`, { "data": { id: entity.id } });
};

export const Unlock: any = (entity: any) => {
  return axios.post(`${API_URL}/${entity.id}/unban`, { "data": { id: entity.id } });
};

export const Delete: DeleteProps<any> = (entity: any) => {
  return axios.post(`${API_URL}/${entity.id}/delete`, { "data": { id: entity.id } });
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
