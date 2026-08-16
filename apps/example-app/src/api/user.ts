import request from '@/utils/request';

/** 示例接口：获取用户信息 */
export const fetchUserInfo = (userId: string) => {
    return request.get(`/user/${userId}`);
};
