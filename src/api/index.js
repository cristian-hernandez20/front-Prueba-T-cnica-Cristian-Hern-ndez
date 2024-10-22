import { default as axios } from 'axios';
import { useModuleLoader } from '@/store';

const port = process.env.NODE_ENV == 'production' ? process.env.PORT : process.env.PORT_DEV;
const getHeaders = () => ({
  Authorization: 'Bearer ' + sessionStorage.token,
  Accept: 'application/json',
});
export const apiAxios = async ({
  responseType = 'json',
  method = 'POST',
  loader = true,
  header = {},
  data = {},
  params,
  url,
}) => {
  const full_url = `http://localhost:${port}${process.env.API}${url}`;
  let config = {
    headers: { ...getHeaders(), ...header },
    params: { ...params },
    responseType,
    method,
    data,
    url: full_url,
    validateStatus: function (status) {
      return status >= 200 && status < 400;
    },
  };
  try {
    useModuleLoader().setLoader$(loader);
    const response = await axios(config);
    if (response.data?.msg?.status) {
      throw new Error(`Error http ${response.data.msg.status}`);
    }
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  } finally {
    useModuleLoader().setLoader$(false);
  }
};

const handleAxiosError = (error) => {
  if (error?.response) {
    const status = error.response.status;
    const errors = error.response.data.errors;

    if (status === 400 && errors) {
      const mensaje = Object.values(errors)[0] || `Estatus ${status}`;
      throw { message: mensaje, tipo: 'error' };
    }
    const https_response = {
      400: 'Solicitud Incorrecta: La solicitud enviada al servidor es inválida',
      401: 'No autorizado: No tienes permisos para acceder a este recurso',
      402: 'Pago requerido: Es necesario realizar un pago para continuar',
      404: 'No encontrado: La ruta o recurso solicitado no existe',
      405: 'Método no permitido: El método de solicitud no está permitido en esta ruta',
      500: 'Error interno del servidor: Ocurrió un error inesperado en el servidor',
    };

    if ([400, 401, 402, 404, 405, 500].includes(status)) {
      const message = error.response.data.error || https_response[status];
      throw { message, tipo: 'error' };
    }
  } else if (error.code === 'ERR_NETWORK') {
    const error_net = {
      message: 'No se pudo mantener la conexión con el servidor, <br> Se encuentra fuera de servicio',
      tipo: 'error',
    };
    throw error_net;
  } else {
    console.debug('-> Error: ', 'global', error);
    throw {
      message: error.message || 'Error desconocido',
      tipo: 'error',
    };
  }
};
