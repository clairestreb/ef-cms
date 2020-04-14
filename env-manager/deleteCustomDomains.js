const { getCustomDomains } = require('./getCustomDomains');
const { sleep } = require('./sleep');

exports.deleteCustomDomains = async ({ apiGateway, environment }) => {
  const customDomains = await getCustomDomains({
    apiGateway,
    environment,
  });
  for (const domain of customDomains) {
    await apiGateway
      .deleteDomainName({ DomainName: domain.DomainName })
      .promise();
  }

  let resourceCount = customDomains.length;

  while (resourceCount > 0) {
    await sleep(2000);
    const refreshedDomains = await getCustomDomains({
      apiGateway,
      environment,
    });
    console.log(
      'Waiting for domains to be deleted: ',
      Date(),
      refreshedDomains,
    );
    resourceCount = refreshedDomains.length;
  }
};
