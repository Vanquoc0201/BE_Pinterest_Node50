const authSwagger = {
    "/auth/login" : {
        post: {
            tags: ["Auth"],
            requestBody: {
                content : {
                    "application/json" : {
                        schema: {
                            type : "object",
                            properties: {
                                email: {type: "string",example: "quoc@gmail.com"},
                                password: {type: "string",example: "1234"},
                            }
                        }
                    }
                }
            },
            responses: {
                200: {description: "OK"},
            }
        }
    },
    "/auth/register": {
        post : {
            tags : ["Auth"],
            requestBody: {
                content : {
                    "application/json" : {
                        schema : {
                            type: "object",
                            properties: {
                                hoTen: {type: "string",example: "Võ Văn Quốc"},
                                email: {type: "string",example: "quoc@gmail.com"},
                                password: {type: "string",example: "1234"},
                            }
                        }
                    }
                }
            },
            responses: {
                200: {description: "OK"},
                
            }
        }
    },
   "/auth/get-info": {
    get: {
        tags: ["Auth"],
        description: "Yêu cầu access token hợp lệ trong header (Authorization: Bearer <token>)",
        security: [
            {
                bearerAuth: [],
            },
        ],
        responses: {
            200: {
                description: "Trả về thông tin người dùng",
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                userId: { type: "string" },
                                hoTen: { type: "string" },
                                email: { type: "string"},
                            },
                        },
                    },
                },
            },
            401: {
                description: "Chưa xác thực hoặc token không hợp lệ",
            },
        },
    },
}
}
export default authSwagger