// utils.js
export function processEventsDeployer(events) {
    let numDeployments = 0;
    const uniqueDeployer = new Set();
    const returnValues = [];
    const uniqueFactory = new Set();

    events.forEach(event => {
        if (event.event === 'Deployment') {
            numDeployments++;
            const deployer = event.returnValues.deployer;
            const deployed = event.returnValues.deployed;
            const titleEscrowFactory = event.returnValues.titleEscrowFactory;
            returnValues.push({ deployer, deployed, titleEscrowFactory });
            if (!uniqueDeployer.has(deployer)){
                uniqueDeployer.add(deployer);
            }
            if (!uniqueFactory.has(titleEscrowFactory)){
                uniqueFactory.add(titleEscrowFactory);
            }
            
        }
    });

    return {
        numDeployments,
        uniqueDeployer: Array.from(uniqueDeployer),
        uniqueFactory: Array.from(uniqueFactory),
        returnValues,
        
    };
}

export function processEventsTitleEscrow(events){
    let numCreated = 0;
    const uniqueTokenRegistry = new Set();
    const returnValues = [];
    const uniqueFactory = new Set();

    events.forEach(event => {
        if (event.event === 'TitleEscrowCreated'){
            numCreated++;
            const tokenRegistry = event.returnValues.tokenRegistry
            const tokenId = event.returnValues.tokenId;
            const titleEscrow = event.returnValues.titleEscrow;
            returnValues.push({tokenRegistry, tokenId, titleEscrow});

            uniqueTokenRegistry.add(tokenRegistry);
        }
    });

    return {
        numCreated,
        returnValues,
    };
}

export  function combine(string_deployments, string_titleCreated){
    console.log('Type of deployments:', typeof string_deployments);
    console.log('Type of titleCreated:', typeof string_titleCreated);
    const deployments = JSON.parse(string_deployments);
    const titleCreated = JSON.parse(string_titleCreated);
    console.log('Type of deployments:', typeof titleCreated);
    console.log(titleCreated);

        deployments.returnValues.forEach(deployment => {
            const deployed = deployment.deployed;
            deployment.deployed = [deployed, {'number of tokens':0},[]];
            titleCreated.returnValues.forEach(creation => {
                const tokenReg = creation.tokenRegistry;
                const tokenId = creation.tokenId;
                const titleEscrow = creation.titleEscrow;
                const param = {tokenId,titleEscrow};
                if (deployed === tokenReg){
                    deployment.deployed[2].push(param)
                }
            })
        });

        deployments.returnValues.forEach(deployment => {
            const content = deployment.deployed[2]
            const num_tokens = content.length
            deployment.deployed[1]['number of tokens'] = num_tokens;
        });

        const numCreated = titleCreated.numCreated;

    return {
        deployments,
        numCreated,
    }
}
