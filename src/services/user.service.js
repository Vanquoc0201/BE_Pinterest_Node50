import prisma from "../common/prisma/init.prisma";

export const userService = {
    saveImage: async function (req) {
        const userId = +req.user.userId;
        const savePhotos = await prisma.saves.findMany({
            where : {
                userId: userId,
            },
            include: {
                Images: true,
            },
        })
        return savePhotos
    },
    getLike : async function (req) {
        const userId = +req.params.id;
        if(+req.user.userId !== userId) {
            throw new Error("Bạn không có quyền truy cập vào ảnh này")
        }
        const likePhotos = await prisma.likes.findMany({
            where : {
                userId: userId,
            },
            include: {
                Images: true,
            },
        })
        return likePhotos;
    }
   
};
export default userService