const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_ROUTES = {
  //Rotas Fixas
  USER: `${BASE_URL}/user`,
  MESSAGE: `${BASE_URL}/message`,
  GROUP: `${BASE_URL}/group`,
  COMPANY: `${BASE_URL}/company`,
  MY_GROUPS: `${BASE_URL}/group/my-groups`,
  //Rotas Dinâmicas
  COMPANY_BY_ID: (companyId: string | number) => `${BASE_URL}/company/${companyId}`,
  GROUP_BY_ID: (groupId: string | number) => `${BASE_URL}/group/${groupId}`,
  MESSAGE_BY_ID: (messageId: number) => `${BASE_URL}/message/${messageId}`,
  USER_BY_ID: (userId: string | number) => `${BASE_URL}/user/${userId}`,
  GROUP_MESSAGES: (groupId: string | number) => `${BASE_URL}/message/group/${groupId}`,
  GROUP_FILES: (groupId: string | number) => `${BASE_URL}/files/${groupId}`,
  GROUP_FILE_BY_NAME: (groupId: string | number, fileName: string) => `${BASE_URL}/files/${groupId}/${fileName}`,
}