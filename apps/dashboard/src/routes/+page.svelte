<script lang="ts">
  import { onMount } from "svelte";

  let health = null;
  let sessionCount = 0;

  onMount(async () => {
    try {
      const [healthRes, sessionsRes] = await Promise.all([
        fetch("http://localhost:3001/health"),
        fetch("http://localhost:3001/sessions"),
      ]);
      health = await healthRes.json();
      const sessions = await sessionsRes.json();
      sessionCount = sessions.filter(
        (s: any) => s.status === "running" || s.status === "pending",
      ).length;
    } catch (e) {
      console.error(e);
    }
  });
</script>

<svelte:head>
  <title>Moondark Dashboard</title>
</svelte:head>

<div class="container">
  <h1>Moondark Dashboard</h1>

  <div class="stats">
    <div class="stat-card">
      <div class="stat-value">{sessionCount}</div>
      <div class="stat-label">Active Sessions</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">{health ? "Online" : "Offline"}</div>
      <div class="stat-label">API Status</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">
        {health ? Math.round(health.uptime) + "s" : "—"}
      </div>
      <div class="stat-label">Uptime</div>
    </div>
  </div>

  <nav class="nav">
    <a href="/sessions" class="nav-link">View All Sessions →</a>
  </nav>
</div>

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  h1 {
    color: #e0e0e0;
    margin-bottom: 2rem;
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .stat-card {
    background: #16161e;
    border-radius: 12px;
    padding: 1.5rem;
  }

  .stat-value {
    font-size: 2rem;
    font-weight: 700;
    color: #6366f1;
  }

  .stat-label {
    color: #888;
    font-size: 0.9rem;
    margin-top: 0.25rem;
  }

  .nav {
    margin-top: 1rem;
  }

  .nav-link {
    color: #6366f1;
    text-decoration: none;
    font-size: 1.1rem;
  }

  .nav-link:hover {
    text-decoration: underline;
  }
</style>
