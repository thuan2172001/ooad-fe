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

export const API_URL = API_BASE_URL + `/admin/groups`;
export const API_NORM_URL = API_BASE_URL + `/groups`;

export const Create: CreateProps<any> = async (data: any) => {
  let payload = { ...data };
  if (payload?.service_ids) {
    payload.serviceIds = data.service_ids;
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
  if (payload?.serviceInfo) {
    payload.serviceIds = payload.serviceInfo;
    payload.serviceInfo = null;
    payload = removeValueFromObject(payload, null);
  }
  return axios.put(`${API_URL}/${entity.id}`, payload);
};

export const Lock: any = (entity: any) => {
  return axios.post(`${API_URL}/${entity.id}/ban`, { "data": { id: entity.id } });
};

export const Unlock: any = (entity: any) => {
  return axios.post(`${API_URL}/${entity.id}/unban`, { "data": { id: entity.id } });
};

export const Delete: DeleteProps<any> = (entity: any) => {
  return axios.post(`${API_URL}/delete`, { categoryId: entity.id });
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

export const GetPreSignedURL = (data: {
  UserId: string,
  filename: string;
  contentLength: number;
}) => {
  return axios.post(API_BASE_URL + '/upload-url', data).then((res) => res.data);
};

export const handleUploadImage = async (listImg: any[]): Promise<string> => {
  if (listImg.length < 1) return '';

  const data = await GetPreSignedURL({
    filename: listImg[0].name as string,
    contentLength: listImg[0].size as number,
    UserId: '',
  });

  const { form: headers, url } = data;

  const formData = new FormData();
  for (const key in headers) {
    formData.append(key, headers[key]);
  }
  const file = listImg[0];
  formData.append('file', file, headers.key);

  await CustomPostRequest(url, formData).catch((error: any) => {
    throw new Error(error);
  });
  return headers.key;
};

export const CustomPostRequest = (url: string, data: any) => {
  const _axios = axios.create();
  return _axios({
    url: url,
    method: 'post',
    data: data,
  });
};
