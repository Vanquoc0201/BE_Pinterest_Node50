import userService from "../services/user.service";
import { responseSuccess } from "../common/helpers/response.helper";
export const userController = {

   saveImage: async function (req, res, next) {
      try {
         const result = await userService.saveImage(req);
         const response = responseSuccess(result, `Lấy danh sách ảnh người dùng lưu thành công`);
         res.status(response.statusCode).json(response);
      } catch (err) {
         next(err);
      }
   },

   
};
export default userController