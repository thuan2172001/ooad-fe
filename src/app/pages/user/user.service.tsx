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
import { UserModel } from "./user.model";
import _ from "lodash";
import { formatParamsGet } from '../../common-library/helpers/axios-slice';

export const API_URL = API_BASE_URL + `/admin/users`;

export const Create: CreateProps<any> = (data: any) => {
  return axios.post(API_URL, data);
};

export const GetAll: GetAllPropsServer<any> = ({
  queryProps,
  sortList,
  paginationProps,
}) => {
  const params = formatParamsGet(queryProps, sortList, paginationProps)
  return axios.get(`${API_URL}`, {
    params,
  });
};

export const Count: CountProps<UserModel> = (queryProps) => {
  return axios.get(`${API_URL}/get/count`, {
    params: { ...queryProps },
  });
};

export const GetById = (_id: string) => {
  return axios.get(`${API_URL}/${_id}`);
};

export const Get: GetProps<any> = (entity: any) => {
  return axios.get(`${API_URL}/${entity.id}`);
};

export const Update: UpdateProps<any> = (entity: any) => {
  return axios.put(`${API_URL}/${entity.id}`, entity);
};

export const Delete: DeleteProps<any> = (entity: any) => {
  return axios.post(`${API_URL}/${entity.id}/delete`);
};

export const DeleteMany: DeleteManyProps<any> = (entities: any[]) => {
  return axios.delete(API_URL, {});
};

export const BanUser: any = (entity: any) => {
  const id: any = entity?.id;
  return axios.post(`${API_URL}/${id}/ban`, {});
};

export const UnbanUser: any = (entity: any) => {
  const id: any = entity?.id;
  return axios.post(`${API_URL}/${id}/unban`, {});
};

