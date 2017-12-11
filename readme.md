# Phone Finder Lex Bot

**Bot Location:**
[http://lex-client-static.s3-website-us-east-1.amazonaws.com](http://lex-client-static.s3-website-us-east-1.amazonaws.com)

**Deploy lambda**

    sls deploy

**Deploy web client**

    sls client deploy

**Service Information**

    service: lex-search-bot
    stage: dev
    region: us-east-1
    stack: lex-search-bot-dev
    lexSearch: lex-search-bot-dev-lexSearch

**Lambda Test Data**

    {
      "messageVersion": "1.0",
      "invocationSource": "FulfillmentCodeHook",
      "userId": "user-1",
      "sessionAttributes": {},
      "bot": {
        "name": "GiftFinder",
        "alias": "$LATEST",
        "version": "$LATEST"
      },
      "outputDialogMode": "Text",
      "currentIntent": {
        "name": "PhoneSearch",
        "slots": {
          "price": "400",
          "model": "iphone 6s",
          "priceLow": "200"
        },
        "confirmationStatus": "None"
      }
    }
