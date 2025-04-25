import likeService from "../services/like.service";
import { responseSuccess } from "../common/helpers/response.helper";
export const likeController = {
   like: async function (req, res, next) {
      try {
         const result = await likeService.like(req);
         const response = responseSuccess(result, `Like ảnh thành công`);
         res.status(response.statusCode).json(response);
      } catch (err) {
         next(err);
      }
   },

   unLike: async function (req, res, next) {
      try {
         const result = await likeService.unLike(req);
         const response = responseSuccess(result, `Bỏ like ảnh thành công`);
         res.status(response.statusCode).json(response);
      } catch (err) {
         next(err);
      }
   },

};
export default likeController;