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
   
};
export default userService