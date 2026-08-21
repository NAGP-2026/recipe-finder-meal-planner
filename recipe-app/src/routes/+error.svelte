<script lang="ts">
	import { page } from '$app/stores';

	const messages: Record<number, { emoji: string; title: string; hint: string }> = {
		404: { emoji: '🍽️', title: 'Recipe Not Found', hint: 'The page you\'re looking for doesn\'t exist or was removed.' },
		500: { emoji: '🔥', title: 'Something Went Wrong', hint: 'An unexpected error occurred. Please try again in a moment.' },
	};

	$: info = messages[$page.status] ?? {
		emoji: '⚠️',
		title: 'Unexpected Error',
		hint: $page.error?.message ?? 'Something went wrong. Please go back and try again.',
	};
</script>

<div class="error-page">
	<div class="error-card">
		<div class="error-emoji">{info.emoji}</div>
		<div class="error-code">{$page.status}</div>
		<h1 class="error-title">{info.title}</h1>
		<p class="error-hint">{info.hint}</p>
		<div class="error-actions">
			<a href="/" class="btn btn-primary">🏠 Back to Home</a>
			<button class="btn btn-secondary" onclick={() => history.back()}>← Go Back</button>
		</div>
	</div>
</div>

<style>
	.error-page {
		min-height: calc(100vh - 70px);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 40px 24px;
		background:
			radial-gradient(ellipse 60% 50% at 20% 30%, rgba(244,63,94,0.12) 0%, transparent 60%),
			radial-gradient(ellipse 50% 40% at 80% 70%, rgba(255,107,53,0.08) 0%, transparent 60%),
			#0B0F1E;
	}

	.error-card {
		text-align: center;
		max-width: 480px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16px;
		padding: 48px 32px;
		background: rgba(255,255,255,0.03);
		border: 1px solid rgba(255,255,255,0.09);
		border-radius: 28px;
		backdrop-filter: blur(20px);
	}

	.error-emoji {
		font-size: 72px;
		filter: drop-shadow(0 8px 24px rgba(244,63,94,0.3));
		animation: floatError 4s ease-in-out infinite;
	}

	@keyframes floatError {
		0%, 100% { transform: translateY(0) rotate(-3deg); }
		50% { transform: translateY(-14px) rotate(3deg); }
	}

	.error-code {
		font-size: 80px;
		font-weight: 900;
		line-height: 1;
		background: linear-gradient(135deg, #F43F5E 0%, #FF6B35 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		font-family: 'Playfair Display', serif;
		letter-spacing: -3px;
	}

	.error-title {
		font-size: 24px;
		font-weight: 800;
		color: #fff;
		font-family: 'Playfair Display', serif;
		letter-spacing: -0.5px;
	}

	.error-hint {
		color: #7B85A8;
		font-size: 15px;
		line-height: 1.65;
		max-width: 360px;
	}

	.error-actions {
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
		justify-content: center;
		margin-top: 8px;
	}
</style>
