const { createClient, getClient } = require('@reservoir0x/relay-sdk');

createClient({
    baseApiUrl: 'https://api.relay.link',
    source: 'srd-exchange'
});

async function main() {
    const relayClient = getClient();
    const quote = await relayClient.actions.getQuote({
        user: "FmYt1L31Y6o8K46UvP53o4b5H5hD7L2jZ2H6R6t9F6h3",
        recipient: "0x0000000000000000000000000000000000000000",
        chainId: 792703809,
        toChainId: 137,
        currency: "11111111111111111111111111111111",
        toCurrency: "0x0000000000000000000000000000000000000000",
        amount: "10000",
        tradeType: "EXACT_INPUT"
    });
    console.log(JSON.stringify(quote.steps[0].items[0].data, null, 2));
}

main().catch(console.error);
