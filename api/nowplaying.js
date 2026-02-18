export default async function handler(req, res) {
  const PLEX_URL   = process.env.PLEX_URL;
  const PLEX_TOKEN = process.env.PLEX_TOKEN;
  const ID         = process.env.ID;

  let timer = setInterval(() => {
  try {
    const response = await fetch(`${PLEX_URL}/status/sessions?X-Plex-Token=${PLEX_TOKEN}`, {
      headers: { 'Accept': 'application/json', 'X-Plex-Token': PLEX_TOKEN }
    });
    const data = await response.json();
    const sessions = data?.MediaContainer?.Metadata || [];
    const track = sessions.find(s => s.type === 'track' && s.User?.id === ID);
    if (!track) return res.send('Nothing playing right now!');
    res.send(`🎵 ${track.title} — ${track.grandparentTitle} (${track.parentTitle})🎵 `);
  } catch(e) {
    res.send('Could not reach Plex.');
    clearInterval(timer);
}, 5000);
  }
}
