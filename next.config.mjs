/** @type {import('next').NextConfig} */
const nextConfig = {
  // Strict Mode double-mounts in dev, which collides with react-leaflet@4's
  // MapContainer init. Off in dev keeps the onboarding map stable. Production
  // is unaffected (Strict Mode is a dev-only behaviour).
  reactStrictMode: false,
};
export default nextConfig;
