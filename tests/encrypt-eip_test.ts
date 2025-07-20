import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.5.4/index.ts';
import { assertEquals } from 'https://deno.land/std@0.170.0/testing/asserts.ts';

Clarinet.test({
    name: "Verify entity registration",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const block = chain.mineBlock([
            Tx.contractCall('encrypt-eip', 'register-entity', [types.utf8('TestEntity')], deployer.address)
        ]);
        
        assertEquals(block.receipts.length, 1);
        assertEquals(block.height, 2);
        block.receipts[0].result.expectOk().expectBool(true);
    }
});

Clarinet.test({
    name: "Create encrypted record",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const block = chain.mineBlock([
            Tx.contractCall('encrypt-eip', 'register-entity', [types.utf8('TestEntity')], deployer.address),
            Tx.contractCall('encrypt-eip', 'create-encrypted-record', 
                [
                    types.utf8('SensitiveData'),
                    types.utf8('PrivateRecord'),
                    types.none(),
                    types.utf8('PublicKey'),
                    types.utf8('Signature')
                ], 
                deployer.address)
        ]);
        
        assertEquals(block.receipts.length, 2);
        block.receipts[1].result.expectOk().expectUint(1);
    }
});