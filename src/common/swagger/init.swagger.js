import authSwagger from "./auth.swagger";
import photoSwagger from "./photo.swagger";
import userSwagger from "./user.swagger";

const swaggerDocument = {
    openapi: "3.1.1",
    info: {
       title: "Cyber Community API",
       version: "1.0.0",
    },
    servers: [
       {
          url: "http://localhost:3069",
          description: "Local Server",
       },
       {
          url: "https://cybercommunity.vercel.app",
          description: "Production Server",
       },
    ],
    components: {
       securitySchemes: {
          bearerAuth: {
             type: "http",
             scheme: "bearer",
             bearerFormat: "JWT",
          },
       },
    },
    paths: {
       ...authSwagger,
       ...photoSwagger,
       ...userSwagger
    },
 };
 
 export default swaggerDocument;