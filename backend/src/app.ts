import express from "express";
import cors from "cors";
import Enum  from "./config/env";
import { corsConfig } from "./config/cors";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { LogManager } from "./utils/logUtils";
import { initializeAndSyncDatabase } from "./config/database";
import routes, { setupSwagger } from "./routes";
import router from "./modules/index";
const app = express();



app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(cors(corsConfig));
LogManager.ensureLogDirectory();
app.use(express.json());


app.use('/', routes);
app.use('/', router);
setupSwagger(app);

const initializeDatabase = async () => {
  try {
    await initializeAndSyncDatabase();
  } catch (error) {

    process.exit(1);
  }
};
console.log(Enum.NODE_ENV);


app.use(notFoundHandler);
app.use(errorHandler);

process.on('unhandledRejection', (reason, promise) => {

});
process.on('uncaughtException', (error) => {

  process.exit(1);
});
const startServer = async () => {
  try {
    await initializeDatabase();
    app.listen(Enum.PORT, () => {

      setInterval(() => {
        LogManager.cleanOldLogs(30);
      }, 24 * 60 * 60 * 1000); 
    });
  } catch (error: unknown) {
    process.exit(1);
  }
};
if (process.env.NODE_ENV !== 'test') {
  startServer();
}
export default app;