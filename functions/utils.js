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
            
            uniqueDeployer.add(deployer);
            uniqueFactory.add(titleEscrowFactory);
        }
    });

    return {
        // numDeployments,
        // uniqueDeployer: Array.from(uniqueDeployer),
        returnValues,
        // uniqueFactory: Array.from(uniqueFactory)
    };
}
