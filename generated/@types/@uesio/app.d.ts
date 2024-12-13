
declare module "@uesio/app/bots/listener/eurocanuck/eggnog/pay_with_stripe" {

	type Params = {
		order: string
		currency?: string
		successUrl?: string
		cancelUrl?: string
	}

	export type {
		Params
	}
}