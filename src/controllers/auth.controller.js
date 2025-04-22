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

   findOne: async function (req, res, next) {
      try {
         const result = await authService.findOne(req);
         const response = responseSuccess(result, `Get auth #${req.params.id} successfully`);
         res.status(response.statusCode).json(response);
      } catch (err) {
         next(err);
      }
   },

   update: async function (req, res, next) {
      try {
         const result = await authService.update(req);
         const response = responseSuccess(result, `Update auth #${req.params.id} successfully`);
         res.status(response.statusCode).json(response);
      } catch (err) {
         next(err);
      }
   },

   remove: async function (req, res, next) {
      try {
         const result = await authService.remove(req);
         const response = responseSuccess(result, `Remove auth #${req.params.id} successfully`);
         res.status(response.statusCode).json(response);
      } catch (err) {
         next(err);
      }
   }
};
export default authController