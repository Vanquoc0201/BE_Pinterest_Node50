const likeSwagger = {
    "/like" : {
        post : {
            tags: ["Like"],
            security : [ {bearerAuth : []}],
            requestBody : {
                content : {
                    "application/json" : {
                        schema : {
                            type : "object",
                            properties : {
                                imageId : {type : "string" , example : "1"}
                            }
                        }
                    }
                }
            },
            responses : {
                200: { description: "Oke" },
                401: {
                  description: "Chưa xác thực hoặc token không hợp lệ",
              },
            },
        },
        delete : {
            tags: ["Like"],
            security : [ {bearerAuth : []}],
            requestBody : {
                content : {
                    "application/json" : {
                        schema : {
                            type : "object",
                            properties : {
                                imageId : {type : "string" , example : "1"}
                            }
                        }
                    }
                }
            },
            responses : {
                200: { description: "Oke" },
                401: {
                  description: "Chưa xác thực hoặc token không hợp lệ",
              },
            },
        }
    }
}
export default likeSwagger;