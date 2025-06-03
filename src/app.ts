// src/app.ts
import "reflect-metadata";
import express, { Express, Request, Response, NextFunction } from "express";
import { errorHandler } from "./middleware/errorhandler";
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger-output.json';

import * as dotenv from "dotenv";
import { AppDataSource } from "./config/database";
import { UserRouter } from "./routes/RegisterUserRoutes";

 //import UserRouter  from "./routes/userRoutes";
import * as bodyParser from "body-parser";

dotenv.config();

AppDataSource.initialize()
  .then(() => {
        console.log("Successfully connected to the database");
    const app: Express = express();

    app.use(bodyParser.json());
    app.use(express.json());
     

// Serve Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    // Route setup
    UserRouter.forEach(route => {
      const method = route.method.toLowerCase();
      const middlewares = route.middlewares || [];
      // Validate the HTTP method
      if (typeof (app as any)[method] !== "function") {
        throw new Error(`Invalid HTTP method: ${route.method}`);
      }

      // Register the route
     (app as any)[method](
  route.route,
  ...middlewares,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Directly call the controller function
      await route.controller(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

    });
// Error handling middleware
      app.use(errorHandler);
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
      console.log(`Server running at http://127.0.0.1:${PORT}`);
    });
  })
  .catch(error => {
    console.error(" Data source initialization failed:", error);
  });


// import "reflect-metadata";
// import express, { Express } from "express";
// import * as dotenv from "dotenv";
// import { AppDataSource } from "./config/database";
// import { errorHandler } from "./middleware/errorhandler";
// import UserRouter from "./routes/userRoutes";
// import * as bodyParser from "body-parser";

// dotenv.config();

// AppDataSource.initialize()
//   .then(() => {
//     console.log("Successfully connected to the database");
//     const app: Express = express();

//     app.use(bodyParser.json());
//     app.use(express.json());

//     // Mount routes
//     app.use("/users", UserRouter);

//      // Error handling middleware
//       app.use(errorHandler);
      
//     const PORT = process.env.PORT;
//     app.listen(PORT, () => {
//       console.log(`Server running at http://127.0.0.1:${PORT}`);
//     });
//   })
//   .catch(error => {
//     console.error("Data source initialization failed:", error);
//   });

