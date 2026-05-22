export default function HomePage() {
  return (
    <main style={{ padding: 32, maxWidth: 720 }}>
      <h1>ScoutFeed</h1>
      <p>Backend is running. Frontend pages will land here.</p>
      <ul>
        <li><a href="/api/businesses">/api/businesses</a></li>
        <li><a href="/api/competitors?businessId=gym-001">/api/competitors?businessId=gym-001</a></li>
        <li><a href="/api/analytics?businessId=cafe-001">/api/analytics?businessId=cafe-001</a></li>
      </ul>
    </main>
  );
}
