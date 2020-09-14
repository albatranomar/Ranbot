import { Configuration, BestBotClient } from "./library";
import { PrismaClient } from "@prisma/client";

(global as any).prisma = new PrismaClient();
(global as any).config = Configuration.getInstance();

import "./library/extensions/Guild";
import "./library/extensions/Message";
import "./library/extensions/Member";
import "./library/classes/general/Formatter";

const bot = new BestBotClient({
  owners: config.get("bot.owners"),
  token: config.get("bot.tokens.discord"),
  builtDirectory: "dist",
});

(async () => {
  await prisma.$connect().catch((err) => bot.logger.error(err));

  await bot.start().catch((err) => bot.logger.error(err));
})();
