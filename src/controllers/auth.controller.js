import { responseSuccess } from "../common/helpers/response.helper";
import authService from "../services/auth.services";
export const authController = {
   register: async function (req, res, next) {
      try {
         const result = await authService.register(req);
         const response = responseSuccess(result, `Đăng kí thành công`);
         res.status(response.statusCode).json(response);
      } catch (err) {
         next(err);
      }
   },

   login: async function (req, res, next) {
      try {
         const result = await authService.login(req);
         const response = responseSuccess(result, `Đăng nhập thành công`);
         res.status(response.statusCode).json(response);
      } catch (err) {
         next(err);
      }
   },

   refreshToken: async (req, res, next) => {
      try {
         const result = await authService.refreshToken(req);
         const response = responseSuccess(result, `Làm mới token thành công`);
         res.status(response.statusCode).json(response);
      } catch (error) {
         next(error);
      }
   },
   getInfo: async (req, res, next) => {
      try {
         const result = await authService.getInfo(req);
         const response = responseSuccess(result, `Lấy thông tin user thành công`);
         res.status(response.statusCode).json(response);
      } catch (error) {
         next(error);
      }
   },
   
};
export default authController