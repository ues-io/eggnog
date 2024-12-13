import { FieldValue, ListenerBotApi } from "@uesio/bots";
import { Params } from "@uesio/app/bots/listener/eurocanuck/eggnog/pay_with_stripe";

export default function pay_with_stripe(bot: ListenerBotApi) {
  const params = bot.params.getAll() as Params;
  const { order, currency, successUrl, cancelUrl } = params;
  const domain = bot.getSession().getSite().getDomain();
  const subdomain = bot.getSession().getSite().getSubDomain();
  const host = `https://${subdomain}.${domain}`;
  const STRIPE_INTEGRATION = "uesio/stripe.stripe";

  const loadresult = bot.load({
    collection: "eurocanuck/eggnog.cart",
    fields: [
      {
        id: "eurocanuck/eggnog.stripe_price",
      },
      {
        id: "eurocanuck/eggnog.quantity",
      },
    ],
    conditions: [
      {
        field: "eurocanuck/eggnog.order",
        value: order,
        operator: "EQ",
      },
    ],
  });

  // Loop over the lines and put them in the right format
  const lineItems = loadresult.map((line) => ({
    price: line["eurocanuck/eggnog.stripe_price"],
    quantity: line["eurocanuck/eggnog.quantity"],
  }));

  if (lineItems) {
    const checkoutResult = bot.runIntegrationAction(
      STRIPE_INTEGRATION,
      "checkout",
      {
        mode: "payment",
        currency,
        success_url: host + successUrl,
        cancel_url: host + cancelUrl,
        line_items: lineItems,
      }
    ) as FieldValue;

    bot.addResult("checkoutResult", checkoutResult);
  }
}
