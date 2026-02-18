module.exports = async function handler(req, res) {
  const PLEX_URL   = process.env.PLEX_URL;
  const PLEX_TOKEN = process.env.PLEX_TOKEN;
  const ID         = process.env.ID;

  try {
    const response = await fetch(`${PLEX_URL}/status/sessions?X-Plex-Token=${PLEX_TOKEN}`, {
      headers: { 'Accept': 'application/json', 'X-Plex-Token': PLEX_TOKEN }
    });
    const data = await response.json();
    const sessions = data?.MediaContainer?.Metadata || [];
    const track = sessions.find(s => s.type === 'track' && s.User?.id === ID);
    res.setHeader('Content-Type', 'text/plain');
    if (!track) return res.end('Nothing playing right now!');
    res.end(`${track.title} — ${track.grandparentTitle} (${track.parentTitle})`);
  } catch(e) {
    res.setHeader('Content-Type', 'text/plain');
    res.end('Nothing playing right now!');
  }
}
