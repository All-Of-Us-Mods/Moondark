<script lang="ts">
  import type { Session } from "$lib/types";
  import { API_BASE } from "$lib/api";

  let sessions: Session[] = [];
  let loading = true;

  async function loadSessions() {
    try {
      const res = await fetch(`${API_BASE}/sessions`);
      sessions = await res.json();
    } catch (e) {
      console.error(e);
    } finally {
      loading = false;
    }
  }

  loadSessions();

  async function terminate(id: string) {
    await fetch(`${API_BASE}/sessions/${id}`, { method: "DELETE" });
    await loadSessions();
  }
</script>

<svelte:head>
  <title>Sessions | Moondark Dashboard</title>
</svelte:head>

<div class="container">
  <h1>Active Sessions</h1>

  {#if loading}
    <p class="loading">Loading sessions...</p>
  {:else if sessions.length === 0}
    <p class="empty">No active sessions</p>
  {:else}
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>User</th>
          <th>Mod</th>
          <th>Status</th>
          <th>Started</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each sessions as session}
          <tr>
            <td class="mono">{session.id}</td>
            <td>{session.userId}</td>
            <td>{session.modId}</td>
            <td>
              <span class="status {session.status}">{session.status}</span>
            </td>
            <td>
              {session.startedAt
                ? new Date(session.startedAt).toLocaleString()
                : "—"}
            </td>
            <td>
              {#if session.status === "running" || session.status === "pending"}
                <button on:click={() => terminate(session.id)} class="btn-terminate">
                  Terminate
                </button>
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</div>

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  h1 {
    color: #e0e0e0;
    margin-bottom: 1.5rem;
  }

  .loading,
  .empty {
    color: #888;
    font-size: 1.1rem;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    background: #16161e;
    border-radius: 8px;
    overflow: hidden;
  }

  th,
  td {
    padding: 0.75rem 1rem;
    text-align: left;
    border-bottom: 1px solid #222;
  }

  th {
    background: #1a1a24;
    color: #888;
    font-weight: 500;
    font-size: 0.85rem;
    text-transform: uppercase;
  }

  td {
    color: #e0e0e0;
  }

  .mono {
    font-family: monospace;
    font-size: 0.85rem;
  }

  .status {
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
  }

  .status.running {
    background: #064e3b;
    color: #34d399;
  }

  .status.pending {
    background: #422006;
    color: #fbbf24;
  }

  .status.stopped {
    background: #1c1917;
    color: #78716c;
  }

  .status.error {
    background: #450a0a;
    color: #f87171;
  }

  .btn-terminate {
    background: #dc2626;
    color: #fff;
    border: none;
    padding: 0.4rem 0.8rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.8rem;
  }

  .btn-terminate:hover {
    background: #ef4444;
  }
</style>
