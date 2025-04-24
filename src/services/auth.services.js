import prisma from "../common/prisma/init.prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import logger from "../common/winston/init.winston";
import { BadRequestException, UnAuthorizedException } from "../common/helpers/exception.helper";
import tokenService from "./token.service";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../common/constant/app.constant";
export const authService = {
   register: async function (req) {
      const {email, password, hoTen} = req.body;
      const userExist = await prisma.users.findUnique({
        where : {
            email: email,
        }
      });
      if(userExist) throw new BadRequestException("Tài khoản đã tồn tại vui lòng đăng nhập");
      const salt = bcrypt.genSaltSync(10); // Tạo ra một chuỗi ngẫu nhiên để làm tăng phức tạp mã hóa
      const hashPassword = bcrypt.hashSync(password,salt);
      const userNew = await prisma.users.create({
        data: {
            email: email,
            password: hashPassword,
            hoTen: hoTen,
        }
      });
      delete userNew.password;
      return userNew;
   },

   login: async function (req) {
      const { email, password} = req.body;
      const userExist = await prisma.users.findUnique({
        where : {
            email: email
        }
      });
      if(!userExist) throw new BadRequestException("Tài khoản chưa tồn tại, vui lòng đăng ký");
      if(!userExist.password) throw new BadRequestException("Vui lòng đăng nhập bằng google hoặc facebook, để cập nhật mật khẩu mới");
      const isPassword = bcrypt.compareSync(password, userExist.password);
      if(!isPassword){
        logger.error(`${userExsit.id} đăng nhập quá 3 lần, lưu dấu vết hoặc cho vào blacklist`);
        throw new BadRequestException("Mật khẩu không chính xác")
      }
      const tokens = tokenService.createTokens(userExist.userId);
      return tokens;
   },

   refreshToken: async function (req) {
      const {accessToken, refreshToken} = req.body;
      if(!accessToken) throw new BadRequestException("Không có accessToken");
      if(!refreshToken) throw new BadRequestException("Không có refreshToken");
      const decodeRefreshToken = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
      const decodeAccessToken = jwt.verify(accessToken,ACCESS_TOKEN_SECRET, {ignoreExpiration: true});
      if(decodeRefreshToken.userId !== decodeAccessToken.userId) throw new UnAuthorizedException("Token không hợp lệ");
      const tokens = tokenService.createTokens(decodeRefreshToken.userId);
      return tokens;
   },
   getInfo: async (req) => {
      delete req.user.password;
      return req.user;
   },

};
export default authService