const client = require('../../dynamodbClientService');

exports.verifyCaseForUser = async ({ applicationContext, caseId, userId }) => {
  const myCase = await client.query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':pk': `user|${userId}`,
      ':sk': `case|${caseId}`,
    },
    KeyConditionExpression: '#pk = :pk AND #sk = :sk',
    applicationContext,
  });

  return myCase && myCase.length > 0;
};
