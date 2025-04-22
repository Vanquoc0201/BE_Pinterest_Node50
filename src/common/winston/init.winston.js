import winston from "winston";
import chalk from "chalk";

const colorLevel = (level) => {
   if (level === `INFO`) return chalk.greenBright(level);
   if (level === `DEBUG`) return chalk.blueBright(level);
   if (level === `WARN`) return chalk.yellowBright(level);
   if (level === `ERROR`) return chalk.redBright(level);
   return level;
};

const consoleFormat = winston.format.combine(
   winston.format.timestamp({ format: `YYYY-MM-DD HH:mm:ss` }),
   winston.format.printf(({ level, message, timestamp, tag }) => {
      tag = chalk.bgMagenta.cyanBright(tag || "SYSTEM");
      const levelUpercase = level.toUpperCase();
      const levelColor = colorLevel(levelUpercase);
      return `${timestamp}\t${levelColor}\t${tag}\t${message}`;
   })
);

const logger = winston.createLogger({
   level: "info", // Sẽ ghi tất cả level từ info trở lên (theo bậc level ở trang chủ winston)
   format: winston.format.json(), // Ghi log với dạng JSON
   defaultMeta: { tag: "SYSTEM" },

   // Nơi thiết lập log đến (console, file, ...)
   transports: [
      // CONSOLE:: thiết lập cho log ở terminal
      new winston.transports.Console({ format: consoleFormat }),

      // FILE:: Chỉ ghi log là error vào file error.log
      new winston.transports.File({ filename: "logs/error.log", level: "error" }),

      // FILE:: Ghi tất cả log vào file combined.log
      new winston.transports.File({ filename: "logs/combined.log" }),
   ],
});

export default logger;