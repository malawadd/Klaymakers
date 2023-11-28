<script>
	import Volume from '../Volume.svelte'

	import {  GITHUB_ICON } from '../../lib/icons'
	import { PRODUCTS } from '../../lib/products'
	import { getChainData } from '../../lib/utils'

	let currencies = getChainData('currencies');

	amplitude.getInstance().logEvent('Home');

</script>
<style>

	.home-wrap {
		background-color: var(--eerie-black);
	}

	.home {
		margin: 0 auto;
		max-width: 960px;
		padding: var(--base-padding);
		padding-bottom: 36px;
	}

	.hero {
		display: flex;
		padding: 48px 0;
	}

	@media (max-width: 800px) {
		.hero {
			flex-direction: column;
		}
	}

		.hero-inner {		
			display: grid;
			grid-auto-flow: row;
			grid-gap: 36px;
		}

		.main-title {
		}

		.main-title img {
			height: 60px;
		}

		.tagline {
			line-height: 1.348;
			font-size: 260%;
			font-weight: 700;
			max-width: 500px;
		}

		.subhead {
			line-height: 1.518;
			font-size: 120%;
			font-weight: 400;
			max-width: 330px;
			margin: 0 auto;
			margin-top: 12px;
		}

		.pill {
			font-size: 110%;
			padding: 8px 14px;
			border-radius: 6px;
			font-weight: 600;
			display: inline-block;
			margin-top: 20px;
			margin-right: 12px;
			background-color: var(--jet);
			color: #fff;
		}

		.chains {
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 90%;
			font-weight: 500;
		}
		.chains :global(svg) {
			height: 22px;
			margin-right: 4px;
			margin-left: 8px;
		}

		.button-wrap {
		}

		.button {
			padding: 16px 26px;
			border-radius: var(--base-radius);
			font-weight: 650;
			font-size: 120%;
			color: var(--green-dark);
			background-color: var(--green);
			display: inline-block;
		}
		.button:hover {
			background-color: var(--green-dim);
		}

		.volume .label {
			color: var(--sonic-silver);
			margin-top: 10px;
		}

		.volume .value {
			font-weight: 700;
			font-size: 110%;
		}

	.supported {
		padding: 12px 36px;
		padding-right: 0;
		text-align: right;
		flex: 1;
	}

	@media (max-width: 800px) {
		.supported {
			text-align: left;
			padding: 36px 0 0;
		}
	}

		.title {
			margin-top: 10px;
			color: var(--sonic-silver);
			margin-bottom: 36px;
		}

		.title:last-child {
			margin-bottom: 0;
		}

		.content img, .content :global(svg) {
			width: 42px;
			margin-left: 16px;
		}

		@media (max-width: 800px) {
			.content img, .content :global(svg) {
				margin-left: 0;
				margin-right: 16px;
			}
		}


	.links {
		padding-top: 18px;
		line-height: 2;
	}
	.links a {
		margin-right: 16px;
		color: var(--sonic-silver);
		font-size: 90%;
		white-space: nowrap;
	}
	.links a:hover {
		color: var(--green);
	}
	.community {
		padding-top: 48px;
		display: flex;
		align-items: center;
	}

	.community a {
		margin-right: 24px;
	}

	.community :global(svg) {
		height: 24px;
		fill: currentColor;
	}

	.sep {
		width: 40px;
		height: 2px;
		background-color: var(--onyx);
	}

	.mountains {
		opacity: 0.75;
		width: 100%;
	}

	.mountains img {
		max-width: 100%;
	}

</style>

<div class='home-wrap'>

	<div class='home'>

		<div class='hero'>

			<div class='hero-inner'>
				
				<div>
					<div class='tagline'>Abood Decentralized<br/>Perp Exchange</div>

					<div class="pill">Low Fees</div>
					<div class="pill">50× Leverage</div>
					
				</div>

				<div class='button-wrap'>
					<a class='button' href='#/trade'>Trade</a>
				</div>

				

			</div>

			<div class='supported'>

				<div class='content'>
					{#each Object.entries(PRODUCTS) as [_productId, info]}
						<img src={info.logo} title={`${_productId}`}>
					{/each}
				</div>
				<div class='title'>Supported Products</div>

				<div class='content'>
					<img src='/logos/KLAY.png' title='Test KLAY'>
					<img src='/logos/USDC.svg' title='Fake USDC'>
				</div>
				<div class='title'>Supported Collateral</div>

				<div class='content'>
					<img src='/logos/Testnet.png' title='klaytn baobab'>
				</div>
				<div class='title'>Supported Networks</div>

			</div>

		</div>

		<div class='sep'>&nbsp;</div>
		
		<div class='community'>
			<a href='https://github.com/malawadd/Klaymakers' target='_blank' title='Github'>{@html GITHUB_ICON}</a>
		</div>

		<div class='links'>
			<a href='https://dorahacks.io/hackathon/klaymakers23/buidl' target='_blank'>Klaymakers Hackathon</a>
		</div>

	</div>

	<div class='mountains'>
		<img src='/city.png'>
	</div>

</div>
