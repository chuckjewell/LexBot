const apiKey = 'xxx';
const apiSecret = 'xxx';

const sem3 = require('semantics3-node')(apiKey, apiSecret);
const util = require('util');
const _ = require('lodash');

module.exports.lexSearch = (event, context, callback) => {
  console.log(JSON.stringify(event));

  try {
    if (!event.bot.name.startsWith('GiftFinder')) {
      callback('Invalid Bot');
    }
    dispatch(event, response => callback(null, response));
  } catch (err) {
    callback(err);
  }
};
``;

dispatch = (intentRequest, callback) => {
  let { sessionAttributes, currentIntent } = intentRequest;
  let { slots } = currentIntent;
  let { price = false, priceLow = 150, model = false } = slots;

  if (!(price && model)) {
    callback(
      close(sessionAttributes, 'Fulfilled', {
        contentType: 'PlainText',
        content: `Looks like I didn't get a valid phone model or price, please try again`
      })
    );
  } else {
    console.log(
      `request received for model=${model}, between $${priceLow} and $${price}`
    );

    sem3.products.products_field('search', model);
    sem3.products.products_field('price', 'gt', 150);
    sem3.products.products_field('price', 'lt', price);

    sem3.products.get_products((err, products) => {
      if (err) {
        console.log(
          'Error in get_products request.\n' +
            util.inspect(err) +
            util.inspect(products)
        );

        callback(
          close(sessionAttributes, 'Fulfilled', {
            contentType: 'PlainText',
            content: `I could'nt find anything like that, please try again`
          })
        );
      }

      prodObj = JSON.parse(products);

      if (prodObj.results_count > 0) {
        let results = prodObj.results
          .map(result => {
            return {
              name: result.name,
              price: result.price,
              image: result.images[0],
              url: result.sitedetails[0].url,
              site: result.sitedetails[0].name
            };
          })
          .slice(0, 6);

        results = _.orderBy(results, ['price'], ['asc']);

        let topResults = {
          index: 0,
          results
        };

        sessionAttributes.data = new Buffer(
          JSON.stringify(topResults)
        ).toString('base64');

        callback(
          close(sessionAttributes, 'Fulfilled', {
            contentType: 'PlainText',
            content: `The best deal I found was ${results[0].name} for $${
              results[0].price
            }`
          })
        );
      } else {
        callback(
          close(sessionAttributes, 'Fulfilled', {
            contentType: 'PlainText',
            content: `Sorry, couldn't find a phone in that price range`
          })
        );
      }
    });
  }
};

close = (sessionAttributes, fulfillmentState, message) => {
  return {
    sessionAttributes,
    dialogAction: {
      type: 'Close',
      fulfillmentState,
      message
    }
  };
};
